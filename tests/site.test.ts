import { describe, expect, it } from "vitest";
import { canonicalPath } from "../src/data/routes.ts";
import { readingTime, slugify } from "../src/site/markdown.ts";

describe("site text utilities", () => {
  it.each([
    ["  PDF <em>Text</em> &amp; Fonts!  ", "pdf-text-fonts"],
    ["Two\n\tLines", "two-lines"],
    ["Already-hyphenated", "already-hyphenated"],
    ["", ""],
  ])("slugifies %j", (text, expected) => expect(slugify(text)).toBe(expected));

  it("uses a one-minute minimum and rounds at 220 words per minute", () => {
    expect(readingTime("")).toBe(1);
    expect(readingTime("word ".repeat(329))).toBe(1);
    expect(readingTime("word ".repeat(330))).toBe(2);
    expect(readingTime("word ".repeat(660))).toBe(3);
  });
  it("ignores fenced code and presentation shortcodes in the estimate", () => {
    expect(readingTime("hello\n```ts\n" + "word ".repeat(1000) + "\n```\n" + ":bulb: {{scissors}} ".repeat(1000))).toBe(1);
  });
});

describe("canonicalPath", () => {
  it.each([
    ["/", "/"], ["/blog", "/blog/"], ["/blog/", "/blog/"],
    ["/guide.pdf", "/guide.pdf"], ["/v1.0/guide", "/v1.0/guide/"],
    ["/blog?tag=pdf", "/blog?tag=pdf"], ["/blog#intro", "/blog#intro"],
  ])("canonicalizes %s", (path, expected) => expect(canonicalPath(path)).toBe(expected));
});
