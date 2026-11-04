import { describe, expect, it } from "vitest";
import { boundsOf, rotatePoint, translate } from "../src/geometry.ts";
import type { InkAnnotation, LineAnnotation, ShapeAnnotation } from "../src/types.ts";

const line: LineAnnotation = {
  id: "line", page: 1, kind: "line", color: "#000000", strokeWidth: 2, head: "end",
  x1: 10, y1: 20, x2: -5, y2: 45,
};
const ink: InkAnnotation = {
  id: "ink", page: 1, kind: "ink", color: "#000000", strokeWidth: 2,
  opacity: 1, cap: "round", dash: null, brush: "pen",
  points: [{ x: 10, y: 20 }, { x: -5, y: 45 }, { x: 3, y: 12 }],
};
const rect: ShapeAnnotation = {
  id: "rect", page: 1, kind: "rect", color: "#000000", strokeWidth: 2,
  fill: null, fillOpacity: 1, rotation: 0, x: 10, y: 20, w: 30, h: 10,
};

describe("translate", () => {
  it("moves both line endpoints without changing the original", () => {
    expect(translate(line, 3, -2)).toEqual({ ...line, x1: 13, y1: 18, x2: -2, y2: 43 });
    expect(line.x1).toBe(10);
  });
  it("moves every ink point and allocates independent points", () => {
    const moved = translate(ink, 3, -2);
    expect(moved).toEqual({ ...ink, points: [{ x: 13, y: 18 }, { x: -2, y: 43 }, { x: 6, y: 10 }] });
    expect(ink.points[0]).toEqual({ x: 10, y: 20 });
  });
  it("moves a box without changing its size or rotation", () => {
    expect(translate(rect, -20, 4)).toEqual({ ...rect, x: -10, y: 24 });
    expect(translate(rect, 0, 0)).toBe(rect);
  });
});

describe("rotatePoint", () => {
  it.each([[0, 12, 10], [90, 10, 12], [-90, 10, 8], [180, 8, 10]])(
    "rotates around the supplied center by %i degrees", (angle, x, y) => {
      const actual = rotatePoint(12, 10, 10, 10, angle);
      expect(actual.x).toBeCloseTo(x);
      expect(actual.y).toBeCloseTo(y);
    },
  );
});

describe("boundsOf", () => {
  it("handles a line drawn backwards", () => {
    expect(boundsOf(line)).toEqual({ x: -5, y: 20, w: 15, h: 25 });
  });
  it("encloses every ink point", () => {
    expect(boundsOf(ink)).toEqual({ x: -5, y: 12, w: 15, h: 33 });
  });
  it("encloses a box rotated about its center", () => {
    const bounds = boundsOf({ ...rect, rotation: 90 });
    expect(bounds.x).toBeCloseTo(20);
    expect(bounds.y).toBeCloseTo(10);
    expect(bounds.w).toBeCloseTo(10);
    expect(bounds.h).toBeCloseTo(30);
  });
});
