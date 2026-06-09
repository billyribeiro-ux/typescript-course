import { useBoard, resetBoard } from "./store/board.js";
import { Column } from "./components/Column.js";
import "./index.css";

export function App() {
  const columns = useBoard((s) => s.columns);
  const columnIds = columns.map((c) => c.id);

  return (
    <main className="app">
      <header className="app-header">
        <h1>🗂️ Kanban Board</h1>
        <button type="button" onClick={resetBoard}>
          Reset board
        </button>
      </header>
      <div className="board">
        {columns.map((column) => (
          <Column key={column.id} column={column} columnIds={columnIds} />
        ))}
      </div>
    </main>
  );
}
