import { memo, useCallback } from 'react';
import './Card.css';

const Card = memo(({ card, categoryId, settingsMode, onEdit, onClick }) => {
  const handleClick = useCallback(() => {
    if (settingsMode) {
      onEdit(categoryId, card);
    } else {
      onClick(card.url);
    }
  }, [settingsMode, card, categoryId, onEdit, onClick]);

  return (
    <div
      className="card"
      style={{ backgroundColor: card.bgColor, color: card.textColor }}
      onClick={handleClick}
      title={card.url}
    >
      <span>{card.label}</span>
    </div>
  );
});

export default Card;