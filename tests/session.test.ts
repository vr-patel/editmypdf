import { describe, expect, it } from "vitest";
import { normalizeAnnotations } from "../src/session.ts";

describe("normalizeAnnotations", () => {
  it.each([null, {}, "not an array", 5])("rejects a non-array %j", (raw) => {
    expect(normalizeAnnotations(raw)).toEqual([]);
  });
  it("skips unsupported records and empty text", () => {
    expect(normalizeAnnotations([null, 5, {}, { kind: "unknown" }, { kind: "text", text: "" },
      { kind: "emoji", emoji: "not-an-emoji" }])).toEqual([]);
  });
  it("fills legacy text defaults and preserves explicit zero dimensions", () => {
    const old = { kind: "text", id: "text", page: 1, x: 0, y: 0, text: "Hello", fontId: "helvetica",
      fontSize: 12, color: "#000000", bold: false, italic: false, underline: false, align: "left" };
    const stored = { ...old, width: 0, height: 0, rotation: 0, autoWidth: true };
    const normalized = normalizeAnnotations([old, stored]);
    expect(normalized).toEqual([
      { ...old, width: 220, height: null, rotation: 0, autoWidth: false }, stored,
    ]);
    expect(old).not.toHaveProperty("width");
    expect(normalizeAnnotations(normalized)).toEqual(normalized);
  });
  it.each([[-0.5, 0], [0, 0], [0.4, 0.4], [2, 1]])("clamps shape opacity %f", (input, expected) => {
    const shape = { kind: "rect", id: "rect", page: 1, x: 1, y: 2, w: 3, h: 4,
      color: "#000000", strokeWidth: 2, fillOpacity: input };
    expect(normalizeAnnotations([shape])).toEqual([
      { ...shape, fill: null, fillOpacity: expected, rotation: 0 },
    ]);
    expect(shape.fillOpacity).toBe(input);
  });
});
