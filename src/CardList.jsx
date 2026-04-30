import Card from './Card';

const CardList = ({ cards, categoryId, settingsMode, onAddCard, onEditCard, onCardClick }) => (
  <div className="card-list">
    {cards.map(card => (
      <Card
        key={card.id}
        card={card}
        categoryId={categoryId}
        settingsMode={settingsMode}
        onEdit={onEditCard}
        onClick={onCardClick}
      />
    ))}
    {settingsMode && (
      <button className="add-card-placeholder" onClick={() => onAddCard(categoryId)}>
        ＋
      </button>
    )}
  </div>
);

export default CardList;