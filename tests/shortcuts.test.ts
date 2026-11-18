import { afterEach, expect, it, vi } from "vitest";

afterEach(() => vi.unstubAllGlobals());

it.each([
  ["MacIntel", true, "⇧⌘Z", "⌘⌫"],
  ["iPad", true, "⇧⌘Z", "⌘⌫"],
  ["Win32", false, "Ctrl+Shift+Z", "Ctrl+Backspace"],
  ["Linux x86_64", false, "Ctrl+Shift+Z", "Ctrl+Backspace"],
])("formats shortcuts for %s", async (platform, mac, redo, remove) => {
  vi.resetModules();
  vi.stubGlobal("navigator", { platform });
  const { shortcut, isMac } = await import("../src/shortcuts.ts");
  expect(isMac).toBe(mac);
  expect(shortcut("z", "shift", "mod")).toBe(redo);
  expect(shortcut("mod", "backspace")).toBe(remove);
});

it("can be imported without a browser navigator", async () => {
  vi.resetModules();
  vi.stubGlobal("navigator", undefined);
  const { shortcut } = await import("../src/shortcuts.ts");
  expect(shortcut("mod", "k")).toBe("Ctrl+K");
});
