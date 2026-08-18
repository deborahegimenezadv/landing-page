import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("hero provides the three scroll narrative scenes", async () => {
  const hero = await readFile(
    new URL("../components/sections/Hero.tsx", import.meta.url),
    "utf8",
  );

  assert.match(hero, /data-hero-scene="opening"/);
  assert.match(hero, /data-hero-scene="opening"[\s\S]*lg:top-\[56px\]/);
  assert.match(hero, /data-hero-scene="clarity"/);
  assert.match(hero, /data-hero-scene="commitment"/);
  assert.match(hero, /data-hero-scene="clarity"[\s\S]*lg:invisible/);
  assert.match(hero, /data-hero-scene="commitment"[\s\S]*lg:invisible/);
});

test("cinematic scroll pins the desktop hero and animates each scene", async () => {
  const motion = await readFile(
    new URL("../components/motion/CinematicScroll.tsx", import.meta.url),
    "utf8",
  );

  assert.match(motion, /pin: true/);
  assert.match(motion, /\[data-hero-scene\]/);
  assert.match(motion, /\[data-hero-intro\]/);
  assert.match(motion, /useIntro/);
  assert.match(motion, /!introDone/);
});

test("home page is dynamically rendered to prevent stale deployment HTML", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /export const dynamic = "force-dynamic"/);
});
