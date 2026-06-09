import type { Card } from "../store/board.js";
import { useBoard } from "../store/board.js";

interface CardItemProps {
  card: Card;
  columnId: string;
  columnIds: readonly string[];
}

/** A single card with controls to move it between columns or delete it. */
export function CardItem({ card, columnId, columnIds }: CardItemProps) {
  const moveCard = useBoard((s) => s.moveCard);
  const deleteCard = useBoard((s) => s.deleteCard);

  const index = columnIds.indexOf(columnId);
  const prev = columnIds[index - 1];
  const next = columnIds[index + 1];

  return (
    <li className="card">
      <span className="card-title">{card.title}</span>
      <div className="card-actions">
        <button
          type="button"
          aria-label={`Move "${card.title}" left`}
          disabled={!prev}
          onClick={() => prev && moveCard(card.id, prev)}
        >
          ◀
        </button>
        <button
          type="button"
          aria-label={`Move "${card.title}" right`}
          disabled={!next}
          onClick={() => next && moveCard(card.id, next)}
        >
          ▶
        </button>
        <button
          type="button"
          aria-label={`Delete "${card.title}"`}
          onClick={() => deleteCard(card.id)}
        >
          ✕
        </button>
      </div>
    </li>
  );
}
