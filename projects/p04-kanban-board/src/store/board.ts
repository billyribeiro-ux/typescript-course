/**
 * The Kanban board state, managed with Zustand. The store holds normalized
 * data (cards by id + columns referencing card ids) and a set of immutable
 * actions. Because the actions are plain functions on the store, the whole
 * board's behaviour is unit-testable without rendering any UI.
 */
import { create } from "zustand";

export interface Card {
  readonly id: string;
  readonly title: string;
}

export interface Column {
  readonly id: string;
  readonly title: string;
  readonly cardIds: readonly string[];
}

export interface BoardState {
  readonly cards: Readonly<Record<string, Card>>;
  readonly columns: readonly Column[];
  addCard: (columnId: string, title: string) => void;
  renameCard: (cardId: string, title: string) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, toColumnId: string, toIndex?: number) => void;
}

let seq = 0;
const nextId = (): string => `c${++seq}`;
/** Test helper: reset the id counter for deterministic ids. */
export const __resetIds = () => {
  seq = 0;
};

export const initialBoard: Pick<BoardState, "cards" | "columns"> = {
  cards: {
    a1: { id: "a1", title: "Design the schema" },
    a2: { id: "a2", title: "Write the store" },
    a3: { id: "a3", title: "Ship it" },
  },
  columns: [
    { id: "todo", title: "To Do", cardIds: ["a1"] },
    { id: "doing", title: "In Progress", cardIds: ["a2"] },
    { id: "done", title: "Done", cardIds: ["a3"] },
  ],
};

/** Remove a card id from whichever column currently holds it. */
function removeFromColumns(columns: readonly Column[], cardId: string): Column[] {
  return columns.map((col) =>
    col.cardIds.includes(cardId)
      ? { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) }
      : col,
  );
}

export const useBoard = create<BoardState>((set) => ({
  ...initialBoard,

  addCard: (columnId, title) =>
    set((state) => {
      const clean = title.trim();
      if (clean.length === 0) return state; // ignore empty titles
      const id = nextId();
      return {
        cards: { ...state.cards, [id]: { id, title: clean } },
        columns: state.columns.map((col) =>
          col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col,
        ),
      };
    }),

  renameCard: (cardId, title) =>
    set((state) => {
      const clean = title.trim();
      const card = state.cards[cardId];
      if (!card || clean.length === 0) return state;
      return { cards: { ...state.cards, [cardId]: { ...card, title: clean } } };
    }),

  deleteCard: (cardId) =>
    set((state) => {
      if (!state.cards[cardId]) return state;
      const cards = { ...state.cards };
      delete cards[cardId];
      return { cards, columns: removeFromColumns(state.columns, cardId) };
    }),

  moveCard: (cardId, toColumnId, toIndex) =>
    set((state) => {
      if (!state.cards[cardId]) return state;
      const withoutCard = removeFromColumns(state.columns, cardId);
      return {
        columns: withoutCard.map((col) => {
          if (col.id !== toColumnId) return col;
          const index = toIndex ?? col.cardIds.length;
          const next = [...col.cardIds];
          next.splice(Math.max(0, Math.min(index, next.length)), 0, cardId);
          return { ...col, cardIds: next };
        }),
      };
    }),
}));

/** Reset the store to the initial board (used by tests + a reset button). */
export function resetBoard(): void {
  __resetIds();
  useBoard.setState({ ...initialBoard });
}
