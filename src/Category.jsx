import { memo, useState, useCallback, useEffect } from 'react';
import CardList from './CardList';
import './Category.css';

const Category = memo(({ category, settingsMode, onRename, dragHandlers, onAddCard, onEditCard, onCardClick, onDeleteCategory }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);

  useEffect(() => {
    if (!editing) setName(category.name);
  }, [category.name, editing]);

  const startEditing = useCallback(() => {
    if (!settingsMode) return;
    setName(category.name);
    setEditing(true);
  }, [settingsMode, category.name]);

  const confirmRename = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== category.name) onRename(category.id, trimmed);
    setEditing(false);
  }, [name, category.id, category.name, onRename]);

  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') confirmRename();
    if (e.key === 'Escape') setEditing(false);
  }, [confirmRename]);

  return (
    <div className="category" draggable={settingsMode} {...dragHandlers}>
      <div className="category-header">
        {settingsMode && <span className="drag-handle">⠿</span>}
        {editing ? (
          <input
            className="cat-name-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={confirmRename}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h2 className="cat-name" onClick={startEditing}>{category.name}</h2>
        )}
        {settingsMode && (
          <button className="delete-cat-btn" onClick={() => onDeleteCategory(category.id)} title="Delete category">✕</button>
        )}
      </div>
      <CardList
          cards={category.cards}
          categoryId={category.id}
          settingsMode={settingsMode}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onCardClick={onCardClick}
        />
    </div>
  );
});

export default Category;