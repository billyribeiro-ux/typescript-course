import type { Column as ColumnType } from "../store/board.js";
import { useBoard } from "../store/board.js";
import { CardItem } from "./CardItem.js";
import { AddCardForm } from "./AddCardForm.js";

interface ColumnProps {
  column: ColumnType;
  columnIds: readonly string[];
}

/** One board column: a heading, its cards, and an add-card form. */
export function Column({ column, columnIds }: ColumnProps) {
  // Select the stable `cards` record (same reference until cards change), then
  // derive this column's cards in render. Returning a NEW array from a Zustand
  // selector would create a fresh snapshot every call → infinite re-render loop.
  const cardsById = useBoard((s) => s.cards);
  const cards = column.cardIds.map((id) => cardsById[id]).filter((c) => c != null);

  return (
    <section className="column" aria-label={column.title}>
      <h2>
        {column.title} <span className="count">{cards.length}</span>
      </h2>
      <ul className="card-list">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} columnId={column.id} columnIds={columnIds} />
        ))}
      </ul>
      <AddCardForm columnId={column.id} />
    </section>
  );
}
