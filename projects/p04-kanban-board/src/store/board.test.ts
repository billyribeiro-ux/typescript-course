import { describe, it, expect, beforeEach } from "vitest";
import { useBoard, resetBoard } from "./board.js";

const get = () => useBoard.getState();
const columnById = (id: string) => get().columns.find((c) => c.id === id)!;

beforeEach(() => resetBoard());

describe("board store", () => {
  it("starts with the seeded board", () => {
    expect(get().columns).toHaveLength(3);
    expect(columnById("todo").cardIds).toEqual(["a1"]);
    expect(get().cards.a2?.title).toBe("Write the store");
  });

  describe("addCard", () => {
    it("adds a trimmed card to a column", () => {
      get().addCard("todo", "  New task  ");
      const ids = columnById("todo").cardIds;
      expect(ids).toHaveLength(2);
      const newId = ids[1]!;
      expect(get().cards[newId]?.title).toBe("New task");
    });
    it("ignores empty titles", () => {
      get().addCard("todo", "   ");
      expect(columnById("todo").cardIds).toEqual(["a1"]);
    });
  });

  describe("moveCard", () => {
    it("moves a card to another column (append by default)", () => {
      get().moveCard("a1", "done");
      expect(columnById("todo").cardIds).toEqual([]);
      expect(columnById("done").cardIds).toEqual(["a3", "a1"]);
    });
    it("inserts at a specific index", () => {
      get().moveCard("a1", "done", 0);
      expect(columnById("done").cardIds).toEqual(["a1", "a3"]);
    });
    it("is a no-op for an unknown card", () => {
      get().moveCard("nope", "done");
      expect(columnById("done").cardIds).toEqual(["a3"]);
    });
  });

  describe("deleteCard", () => {
    it("removes a card from cards and its column", () => {
      get().deleteCard("a2");
      expect(get().cards.a2).toBeUndefined();
      expect(columnById("doing").cardIds).toEqual([]);
    });
  });

  describe("renameCard", () => {
    it("renames a card immutably and trims", () => {
      get().renameCard("a1", "  Renamed  ");
      expect(get().cards.a1?.title).toBe("Renamed");
    });
    it("ignores empty or unknown", () => {
      get().renameCard("a1", "  ");
      expect(get().cards.a1?.title).toBe("Design the schema");
      get().renameCard("ghost", "x");
      expect(get().cards.ghost).toBeUndefined();
    });
  });
});
