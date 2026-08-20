import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("brand theme provides the dark graphite surface scale", async () => {
  const globals = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(globals, /--color-wine:\s*#20232d;/i);
  assert.match(globals, /--color-wine-raised:\s*#292d38;/i);
  assert.match(globals, /--color-wine-card:\s*#313641;/i);
  assert.match(globals, /--color-ivory:\s*#f3ece4;/i);
});

test("content surfaces use the dark theme instead of white", async () => {
  const files = await Promise.all([
    "../app/page.tsx",
    "../components/sections/Areas.tsx",
    "../components/sections/Sobre.tsx",
    "../components/sections/Advogados.tsx",
    "../components/sections/Faq.tsx",
    "../components/layout/Navbar.tsx",
  ].map((path) => readFile(new URL(path, import.meta.url), "utf8")));

  for (const source of files) {
    assert.doesNotMatch(source, /bg-white/);
  }

  assert.match(files[0], /bg-wine/);
  assert.match(files[1], /bg-wine/);
  assert.match(files[2], /bg-wine-raised/);
  assert.match(files[3], /bg-wine/);
  assert.match(files[4], /bg-wine-raised/);
  assert.match(files[5], /bg-wine/);
});
