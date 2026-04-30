import { useCallback, useState } from 'react';
import Category from './Category';
import './CategoryList.css';

const CategoryList = ({ categories, settingsMode, onRename, onMove, onDeleteCategory, onAddCategory, onAddCard, onEditCard, onCardClick }) => {
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    onMove(dragIndex, index);
    setDragIndex(index);
  }, [dragIndex, onMove]);

  const handleDragEnd = useCallback(() => setDragIndex(null), []);

  return (
    <div className="category-list">
      {categories.map((cat, idx) => (
        <Category
          key={cat.id}
          category={cat}
          index={idx}
          settingsMode={settingsMode}
          onRename={onRename}
          dragHandlers={{
            onDragStart: (e) => handleDragStart(e, idx),
            onDragOver: (e) => handleDragOver(e, idx),
            onDragEnd: handleDragEnd,
          }}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onCardClick={onCardClick}
          onDeleteCategory={onDeleteCategory}
        />
      ))}
      {settingsMode && (
        <button className="add-category-btn" onClick={onAddCategory}>
          + Add category
        </button>
      )}
    </div>
  );
};

export default CategoryList;