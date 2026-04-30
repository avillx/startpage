import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './Header.jsx';
import Greeting from './Greeting.jsx';
import CategoryList from './CategoryList.jsx';
import CardModal from './CardModal';
import { loadState, saveState } from './storage';
import { saveBackground, loadBackground, removeBackground } from './blobStorage';
import { safeId } from './utils';
import './App.css';

const App = () => {
  const [state, setState] = useState(() => loadState());
  const [settingsMode, setSettingsMode] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const backgroundUrlRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const revokePreviousBg = useCallback(() => {
    if (backgroundUrlRef.current) {
      URL.revokeObjectURL(backgroundUrlRef.current);
      backgroundUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadBackground().then(blob => {
      if (!mountedRef.current) return;
      if (blob) {
        const url = URL.createObjectURL(blob);
        revokePreviousBg();
        backgroundUrlRef.current = url;
        setBackgroundUrl(url);
      }
    });
    return () => {
      mountedRef.current = false;
      revokePreviousBg();
    };
  }, [revokePreviousBg]);

  const toggleSettings = useCallback(() => setSettingsMode(p => !p), []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    revokePreviousBg();
    const url = URL.createObjectURL(file);
    backgroundUrlRef.current = url;
    setBackgroundUrl(url);
    saveBackground(file);
  }, [revokePreviousBg]);

  const clearBackground = useCallback(() => {
    revokePreviousBg();
    setBackgroundUrl(null);
    removeBackground();
  }, [revokePreviousBg]);

  const openAddCard = useCallback((categoryId) => setEditingCard({ categoryId }), []);
  const openEditCard = useCallback((categoryId, card) => setEditingCard({ categoryId, card }), []);
  const closeCardEditor = useCallback(() => setEditingCard(null), []);

  const addCategory = useCallback(() => {
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, { id: safeId(), name: 'New category', cards: [] }]
    }));
  }, []);

  const renameCategory = useCallback((id, name) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, name } : c)
    }));
  }, []);

  const moveCategory = useCallback((fromIndex, toIndex) => {
    setState(prev => {
      const cats = [...prev.categories];
      const [moved] = cats.splice(fromIndex, 1);
      cats.splice(toIndex, 0, moved);
      return { ...prev, categories: cats };
    });
  }, []);

  const deleteCategory = useCallback((id) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  }, []);

  const saveCard = useCallback((categoryId, cardData) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id !== categoryId) return c;
        const existingIndex = c.cards.findIndex(card => card.id === cardData.id);
        if (existingIndex >= 0) {
          const updated = [...c.cards];
          updated[existingIndex] = cardData;
          return { ...c, cards: updated };
        }
        return { ...c, cards: [...c.cards, { ...cardData, id: safeId() }] };
      })
    }));
    closeCardEditor();
  }, [closeCardEditor]);

  const deleteCard = useCallback((categoryId, cardId) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === categoryId ? { ...c, cards: c.cards.filter(card => card.id !== cardId) } : c
      )
    }));
    closeCardEditor();
  }, [closeCardEditor]);

  const handleCardClick = useCallback((url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="app" style={{ backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined }}>
      <div className="app-content">
        <Header
          settingsMode={settingsMode}
          onToggleSettings={toggleSettings}
        />
        <Greeting
          username={state.username}
          onUsernameChange={(name) => setState(prev => ({ ...prev, username: name }))}
          settingsMode={settingsMode}
        />
        {settingsMode && (
          <div className="header-bg">
            <label className="header-bg-file-label">
              {backgroundUrl ? 'Change background' : 'Choose background'}
              <input
                type="file"
                accept="image/*"
                className="header-bg-file"
                onChange={handleFileSelect}
              />
            </label>
            {backgroundUrl && (
              <button className="danger" onClick={clearBackground}>✕</button>
            )}
          </div>
        )}
        <CategoryList
          categories={state.categories}
          settingsMode={settingsMode}
          onRename={renameCategory}
          onMove={moveCategory}
          onDeleteCategory={deleteCategory}
          onAddCategory={addCategory}
          onAddCard={openAddCard}
          onEditCard={openEditCard}
          onCardClick={handleCardClick}
        />
      </div>
      {editingCard && (
        <CardModal
          card={editingCard.card}
          onSave={(data) => saveCard(editingCard.categoryId, data)}
          onDelete={editingCard.card ? (() => deleteCard(editingCard.categoryId, editingCard.card.id)) : undefined}
          onClose={closeCardEditor}
        />
      )}
    </div>
  );
};

export default App;