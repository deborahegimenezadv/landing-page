import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("practice areas provide client-facing topics", async () => {
  const content = await readFile(new URL("../lib/content.ts", import.meta.url), "utf8");

  assert.match(content, /topics:\s*\[/);
  assert.match(content, /"Aposentadorias"/);
  assert.match(content, /"Defesa em autuações fiscais"/);
  assert.match(content, /"Direito de família"/);
});

test("areas render as editorial practice blocks instead of cards", async () => {
  const section = await readFile(
    new URL("../components/sections/Areas.tsx", import.meta.url),
    "utf8",
  );

  assert.match(section, /data-area-editorial/);
  assert.match(section, /O QUE ESSA ÁREA ABRANGE/);
  assert.match(section, /area\.topics\.map/);
  assert.doesNotMatch(section, /rounded-\[4px\] border border-line bg-wine-card/);
});
