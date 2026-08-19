import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Antoliano profile references its portrait asset", async () => {
  const content = await readFile(
    new URL("../lib/content.ts", import.meta.url),
    "utf8",
  );

  assert.match(
    content,
    /name: "Antoliano Santana Gimenez",[\s\S]*photoSrc: "\/antoliano\.JPG"/,
  );
});
