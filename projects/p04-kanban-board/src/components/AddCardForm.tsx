import { useState } from "react";
import { useBoard } from "../store/board.js";

/** A controlled form to add a card to a given column. */
export function AddCardForm({ columnId }: { columnId: string }) {
  const addCard = useBoard((s) => s.addCard);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    addCard(columnId, clean);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-card">
      <label htmlFor={`add-${columnId}`} className="sr-only">
        Add a card to this column
      </label>
      <input
        id={`add-${columnId}`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a card…"
      />
      <button type="submit" disabled={title.trim().length === 0}>
        Add
      </button>
    </form>
  );
}
