# Motion & GSAP Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cinematic GSAP-driven intro loader (a justice scale that draws itself and reveals the site) plus a consistent, elegant `motion`-driven scroll-reveal system across every section of the Dantas Gimenez & Machado landing page.

**Architecture:** A client-side `IntroProvider` context owns whether the intro has finished and renders the `IntroLoader` overlay once per page load. The `Hero` reads that context to time its own entrance. A reusable `Reveal`/`RevealItem` pair (built on `motion/react`'s `whileInView`) is dropped into every other section for fade+rise reveals, with staggered children for card grids and lists. GSAP is used exclusively inside `IntroLoader` to sequence the SVG line-draw and the overlay exit — it has no other role in the app.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `motion` (React bindings via `motion/react`), `gsap` (core, no paid plugins). No test runner is installed in this repo — verification is done via `pnpm exec tsc --noEmit`, `pnpm run build`, and headless-Chromium Playwright scripts (pattern established earlier in this project; see Task 1 for how to reach a working `playwright` install).

**Spec:** `docs/superpowers/specs/2026-08-16-motion-animations-design.md`

## Global Constraints

- Library split is fixed: `motion` (react) for every scroll-triggered / declarative animation; `gsap` only inside `IntroLoader` for its imperative timeline. Do not use GSAP's `ScrollTrigger` or any other plugin anywhere.
- The intro loader plays on **every** page load (no `sessionStorage` gating) — keep its total duration around 2s and always provide a skip affordance.
- No parallax and no scroll-pinned sections anywhere in the site.
- Every `whileInView` reveal uses `viewport={{ once: true, amount: 0.2 }}` — animates once, never re-triggers.
- `prefers-reduced-motion` must be respected everywhere: `motion` animations via `MotionConfig reducedMotion="user"` at the app root; the GSAP intro timeline via an explicit `window.matchMedia('(prefers-reduced-motion: reduce)')` check.
- Reuse existing Tailwind tokens only (`bg-navy`, `text-gold`, `text-text-soft`, etc. from `app/globals.css`) — do not introduce new colors.
- Easing for every `motion` fade/rise is the cubic-bezier `[0.16, 0.84, 0.44, 1]` (matches the original design's reveal timing).

---

## File Structure

**New files:**
- `components/svg/ScaleIcon.tsx` — presentational, ref-forwarding SVG line-art of a justice scale. No animation logic; GSAP targets its `[data-draw]` children from outside.
- `components/intro/IntroLoader.tsx` — client component. Owns the GSAP timeline, the skip button, the `body` scroll lock, and the `prefers-reduced-motion` fallback. Takes an `onComplete: () => void` prop.
- `components/intro/IntroProvider.tsx` — client component. Owns `introDone` state, renders `IntroLoader` until done, wraps children in `MotionConfig reducedMotion="user"`, and exposes `useIntro(): boolean`.
- `components/motion/Reveal.tsx` — client component. Exports `Reveal` (single fade+rise, or stagger container) and `RevealItem` (a staggered child) plus the shared `revealItemVariants`.

**Modified files:**
- `package.json` / `pnpm-lock.yaml` — add `motion` and `gsap`.
- `app/page.tsx` — wrap the section tree in `<IntroProvider>`.
- `components/sections/Hero.tsx` — becomes a client component; reads `useIntro()` to time its entrance stagger, adds the float loop on the decorative shapes, the gold line draw, and the bottom scroll-indicator loop.
- `components/sections/Areas.tsx` — heading wrapped in `<Reveal>`, card grid wrapped in `<Reveal stagger>` + `<RevealItem>` per card.
- `components/sections/Sobre.tsx` — text column wrapped in `<Reveal>`, values column wrapped in `<Reveal stagger>` + `<RevealItem>` per value.
- `components/sections/Advogados.tsx` — same pattern as Areas.
- `components/sections/Faq.tsx` — heading wrapped in `<Reveal>`, list wrapped in `<Reveal stagger>` + `<RevealItem>` per question.
- `components/sections/Contato.tsx` — whole two-column block wrapped in a single `<Reveal>`.
- `components/ui/WhatsAppButton.tsx` — restructured so a `motion.span` pulse ring can sit behind the button.

---

### Task 1: Install `motion` and `gsap`

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

**Interfaces:**
- Produces: the `motion` package (imported later as `motion/react`) and the `gsap` package (default export `gsap`), available to every later task.

- [ ] **Step 1: Install the packages**

Run:
```bash
pnpm add motion gsap
```

- [ ] **Step 2: Confirm the import paths this plan relies on actually exist**

Run:
```bash
node -e "console.log(require.resolve('motion/react', { paths: [process.cwd()] }))"
node -e "console.log(require.resolve('gsap', { paths: [process.cwd()] }))"
```
Expected: both print a path inside `node_modules` with no error. If `motion/react` fails to resolve, open `node_modules/motion/package.json` and check the `exports` map for the correct React subpath, and use that import path in every later task instead.

- [ ] **Step 3: Verify the project still builds**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: both succeed with no errors (nothing imports the new packages yet, so this just proves the install didn't break anything).

- [ ] **Step 4: Confirm a headless-Chromium Playwright setup is reachable for the visual checks in later tasks**

Run:
```bash
node -e "require('/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs')" 2>&1 || echo "MISSING"
ls /usr/bin/chromium-browser
```
Expected: no `MISSING` output, and `chromium-browser` exists. This is the exact combination used successfully earlier in this project (a borrowed `playwright` install driving the system `chromium-browser` binary via `executablePath`, since this repo has no Playwright of its own and no network access to download browsers). Every later task's Playwright script follows this same pattern — copy it rather than trying `npx playwright install`.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add motion and gsap for the animation phase"
```

---

### Task 2: `ScaleIcon` SVG component

**Files:**
- Create: `components/svg/ScaleIcon.tsx`

**Interfaces:**
- Produces: `ScaleIcon`, a `forwardRef<SVGSVGElement, { className?: string }>` component. Every stroke element inside it carries a `data-draw` attribute — `IntroLoader` (Task 3) selects them with `svg.querySelectorAll('[data-draw]')`.

- [ ] **Step 1: Create the component**

```tsx
// components/svg/ScaleIcon.tsx
import { forwardRef } from "react";

type ScaleIconProps = {
  className?: string;
};

export const ScaleIcon = forwardRef<SVGSVGElement, ScaleIconProps>(
  function ScaleIcon({ className }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <line data-draw x1="42" y1="14" x2="58" y2="14" />
        <line data-draw x1="50" y1="14" x2="50" y2="82" />
        <line data-draw x1="34" y1="82" x2="66" y2="82" />
        <line data-draw x1="20" y1="26" x2="80" y2="26" />
        <line data-draw x1="20" y1="26" x2="10" y2="50" />
        <line data-draw x1="20" y1="26" x2="30" y2="50" />
        <path data-draw d="M10,50 Q20,58 30,50" />
        <line data-draw x1="80" y1="26" x2="70" y2="50" />
        <line data-draw x1="80" y1="26" x2="90" y2="50" />
        <path data-draw d="M70,50 Q80,58 90,50" />
      </svg>
    );
  },
);
```

- [ ] **Step 2: Verify it renders with no console errors**

Temporarily render it to check the shape looks like a scale before wiring any animation. Add this at the very end of `app/page.tsx` (`return` block, right before the closing `</div>`), just for this manual check — it will be removed in Task 3:

```tsx
<div className="fixed bottom-2 left-2 z-50 h-24 w-24 bg-navy p-2">
  <ScaleIcon className="h-full w-full text-gold" />
</div>
```
(add the import `import { ScaleIcon } from "@/components/svg/ScaleIcon";` at the top)

Run: `pnpm run dev`, then in another terminal:
```bash
timeout 20 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'
cat > /tmp/check-icon.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/scale-icon-check.png" });
console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-icon.mjs
```
Expected: `ERRORS: []`. Open `/tmp/scale-icon-check.png` (Read tool) and confirm a gold line-art scale is visible bottom-left on navy.

- [ ] **Step 3: Remove the temporary render from `app/page.tsx`**

Delete the `<div className="fixed bottom-2 left-2...">` block and its `ScaleIcon` import you added in Step 2 — `app/page.tsx` should be byte-identical to its state before this task. Stop the dev server: `lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`.

- [ ] **Step 4: Commit**

```bash
git add components/svg/ScaleIcon.tsx
git commit -m "feat: add ScaleIcon SVG for the intro loader"
```

---

### Task 3: `IntroLoader` — GSAP timeline, skip, reduced-motion fallback

**Files:**
- Create: `components/intro/IntroLoader.tsx`
- Modify: `app/page.tsx` (temporary direct wiring, replaced by `IntroProvider` in Task 4)

**Interfaces:**
- Consumes: `ScaleIcon` (Task 2), forwarding a ref to it.
- Produces: `IntroLoader({ onComplete: () => void })`. Calls `onComplete` exactly once, either when the GSAP timeline finishes, when the reduced-motion fallback fade finishes, or when the user clicks skip. Task 4's `IntroProvider` depends on this exact prop name and one-shot-call guarantee.

- [ ] **Step 1: Create the component**

```tsx
// components/intro/IntroLoader.tsx
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScaleIcon } from "@/components/svg/ScaleIcon";

type IntroLoaderProps = {
  onComplete: () => void;
};

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [skipped, setSkipped] = useState(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const svg = svgRef.current;
    if (!overlay || !svg) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.body.style.overflow = previousOverflow;
      onComplete();
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(overlay, { opacity: 0, duration: 0.2, ease: "power1.out" });
      timelineRef.current = tl;
      return () => {
        tl.kill();
      };
    }

    const strokes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("[data-draw]"),
    );
    strokes.forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
    });

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(strokes, {
      strokeDashoffset: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.inOut",
    })
      .to(svg, {
        scale: 1.04,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      })
      .to(overlay, {
        opacity: 0,
        scale: 1.03,
        duration: 0.6,
        ease: "power2.inOut",
        pointerEvents: "none",
      });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (skipped) return;
    setSkipped(true);
    timelineRef.current?.progress(1);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleSkip}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy"
    >
      <span className="sr-only">Carregando o site</span>
      <ScaleIcon ref={svgRef} className="h-24 w-24 text-gold" />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleSkip();
        }}
        aria-label="Pular introdução"
        className="absolute bottom-6 right-6 text-xs font-medium tracking-[0.08em] text-text-soft transition-colors hover:text-gold"
      >
        Pular →
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Wire it directly into `app/page.tsx` for verification**

In `app/page.tsx`, add the import `import { IntroLoader } from "@/components/intro/IntroLoader";` and render it as the very first child inside the root `<div>`, right after `<StructuredData />`:

```tsx
<IntroLoader onComplete={() => console.log("intro complete")} />
```

- [ ] **Step 3: Verify the full sequence and the skip button**

Run: `pnpm run dev`, wait for it (`timeout 20 bash -c 'until curl -sf http://localhost:3000 >/dev/null; do sleep 1; done'`), then:

```bash
cat > /tmp/check-loader.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });

// 1. Full sequence: draw -> pulse -> reveal
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));
  page.on("pageerror", (e) => logs.push(String(e)));
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/tmp/loader-drawing.png" });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: "/tmp/loader-done.png" });
  console.log("SEQUENCE_LOGS:", JSON.stringify(logs));
  await page.close();
}

// 2. Skip button
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.click('button[aria-label="Pular introdução"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: "/tmp/loader-skipped.png" });
  console.log("SKIP_LOGS:", JSON.stringify(logs));
  await page.close();
}

// 3. Reduced motion
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: "/tmp/loader-reduced-motion.png" });
  console.log("REDUCED_MOTION_LOGS:", JSON.stringify(logs));
  await page.close();
}

await browser.close();
EOF
node /tmp/check-loader.mjs
```

Expected:
- `SEQUENCE_LOGS` includes `"intro complete"` and no error-looking entries.
- `/tmp/loader-drawing.png` (Read tool) shows the scale mid-draw (some strokes visible, some not yet).
- `/tmp/loader-done.png` shows the hero fully revealed, overlay gone.
- `SKIP_LOGS` includes `"intro complete"` — proves skip fires `onComplete`.
- `/tmp/loader-skipped.png` shows the hero already revealed (skip worked near-instantly).
- `REDUCED_MOTION_LOGS` includes `"intro complete"`, and `/tmp/loader-reduced-motion.png` (taken only 400ms in) already shows the hero, not a mid-draw icon — proves the reduced-motion path skipped the draw.

- [ ] **Step 4: Stop the dev server**

```bash
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
```

- [ ] **Step 5: Commit**

```bash
git add components/intro/IntroLoader.tsx app/page.tsx
git commit -m "feat: add IntroLoader with GSAP draw-in timeline"
```

---

### Task 4: `IntroProvider` — context, `useIntro()`, global reduced-motion config

**Files:**
- Create: `components/intro/IntroProvider.tsx`
- Modify: `app/page.tsx` — replace the direct `IntroLoader` wiring from Task 3 with `IntroProvider`

**Interfaces:**
- Consumes: `IntroLoader` (Task 3, exact prop `onComplete: () => void`).
- Produces: `IntroProvider({ children }: { children: ReactNode })` and `useIntro(): boolean`. `Hero` (Task 5) calls `useIntro()` to know when to start its entrance animation.

- [ ] **Step 1: Create the provider**

```tsx
// components/intro/IntroProvider.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { IntroLoader } from "@/components/intro/IntroLoader";

const IntroContext = createContext(false);

export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introDone}>
        {!introDone && <IntroLoader onComplete={() => setIntroDone(true)} />}
        {children}
      </IntroContext.Provider>
    </MotionConfig>
  );
}
```

- [ ] **Step 2: Rewrite `app/page.tsx` to use it**

```tsx
// app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { StructuredData } from "@/components/seo/StructuredData";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Hero } from "@/components/sections/Hero";
import { Areas } from "@/components/sections/Areas";
import { Sobre } from "@/components/sections/Sobre";
import { Advogados } from "@/components/sections/Advogados";
import { Faq } from "@/components/sections/Faq";
import { Contato } from "@/components/sections/Contato";

export default function Home() {
  return (
    <div className="bg-white text-navy">
      <StructuredData />
      <IntroProvider>
        <Navbar />
        <Hero />
        <Areas />
        <Sobre />
        <Advogados />
        <Faq />
        <Contato />
        <Footer />
        <WhatsAppButton />
      </IntroProvider>
    </div>
  );
}
```

This removes the Task 3 `IntroLoader` import/render and the `console.log` callback — `IntroProvider` now owns rendering `IntroLoader`.

- [ ] **Step 3: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 4: Verify the loader still runs end-to-end through the provider**

Run `pnpm run dev`, wait for it, then reuse the same three-scenario script from Task 3 Step 3 (sequence / skip / reduced-motion) unchanged — it doesn't reference any implementation detail that moved, only the public page behavior. Expected results are identical to Task 3. Stop the server after (`lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`).

- [ ] **Step 5: Commit**

```bash
git add components/intro/IntroProvider.tsx app/page.tsx
git commit -m "feat: add IntroProvider context and wire it into the page"
```

---

### Task 5: `Reveal` / `RevealItem` — reusable scroll-reveal components

**Files:**
- Create: `components/motion/Reveal.tsx`

**Interfaces:**
- Produces: `Reveal({ children, className?, delay?, stagger? })` and `RevealItem({ children, className? })`, plus the exported `revealItemVariants`. Tasks 6–10 (Areas, Sobre, Advogados, Faq, Contato) and Task 11 (WhatsAppButton pulse styling reference, not variants) consume `Reveal`/`RevealItem` by these exact names.

- [ ] **Step 1: Create the component**

```tsx
// components/motion/Reveal.tsx
"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  stagger = false,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={stagger ? containerVariants : revealItemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={stagger ? undefined : { duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
};

export function RevealItem({ children, className }: RevealItemProps) {
  return (
    <motion.div className={className} variants={revealItemVariants}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. (No visual check yet — nothing uses `Reveal` until Task 6.)

- [ ] **Step 3: Commit**

```bash
git add components/motion/Reveal.tsx
git commit -m "feat: add Reveal/RevealItem scroll-reveal components"
```

---

### Task 6: Hero entrance, float shapes, gold line draw

**Files:**
- Modify: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `useIntro()` from `components/intro/IntroProvider` (Task 4).

- [ ] **Step 1: Rewrite the component**

```tsx
// components/sections/Hero.tsx
"use client";

import { motion, type Variants } from "motion/react";
import { whatsappLink } from "@/lib/content";
import { useIntro } from "@/components/intro/IntroProvider";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  const introDone = useIntro();

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:pb-[100px] lg:pt-[140px]"
    >
      <motion.div
        className="pointer-events-none absolute -right-[60px] -top-[60px] hidden h-[260px] w-[260px] rotate-[12deg] border border-gold/35 sm:block"
        animate={{ y: [0, -14, 0], rotate: [12, 16, 12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 right-[140px] hidden h-[90px] w-[90px] bg-gold/15 sm:block"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-gold to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px]">
        <motion.div
          className="max-w-[720px]"
          variants={container}
          initial="hidden"
          animate={introDone ? "visible" : "hidden"}
        >
          <motion.div
            variants={item}
            className="mb-6 flex items-center gap-3 sm:mb-7"
          >
            <motion.span
              className="h-px bg-gold"
              initial={{ width: 0 }}
              animate={introDone ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            />
            <span className="text-xs font-semibold tracking-[0.24em] text-text-gold-soft">
              ADVOCACIA
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="mb-5 text-[32px] font-bold leading-[1.2] text-white sm:mb-[26px] sm:text-[40px] lg:text-[52px] lg:leading-[1.15]"
          >
            Orientação jurídica objetiva em Previdenciário, Tributário e
            Civil.
          </motion.h1>
          <motion.p
            variants={item}
            className="mb-8 max-w-[560px] text-base font-light leading-[1.7] text-text-soft sm:mb-10 sm:text-[17px]"
          >
            Três áreas, três advogados responsáveis. Cada caso é conduzido
            diretamente por quem responde por aquela área — do primeiro
            contato à solução.
          </motion.p>
          <motion.div
            variants={item}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener"
              className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-center text-sm font-semibold tracking-[0.02em] text-white transition-all hover:-translate-y-0.5 hover:bg-gold-dark"
            >
              Falar no WhatsApp
            </a>
            <a
              href="#areas"
              className="inline-block rounded-[3px] border border-white/30 px-[30px] py-4 text-center text-sm font-semibold text-white transition-colors hover:border-gold hover:text-text-gold-soft"
            >
              Conhecer as áreas
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 sm:flex">
        <motion.span
          className="h-[34px] w-px bg-white/40"
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
```

Note the `<span className="h-px w-16 bg-gold" />` from the previous version is gone — it's replaced by the animated `motion.span` whose width is driven by `introDone`, so no static `w-16` class remains on it.

- [ ] **Step 2: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 3: Verify the hero entrance and float loops visually**

Run `pnpm run dev`, wait for it, then:

```bash
cat > /tmp/check-hero.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.click('button[aria-label="Pular introdução"]');
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/hero-mid-entrance.png" });
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/hero-settled.png" });
console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-hero.mjs
```

Expected: `ERRORS: []`. `/tmp/hero-mid-entrance.png` shows the hero content partway through its stagger (some lines faded in, others not yet, or the gold line partially drawn). `/tmp/hero-settled.png` shows everything fully visible — title, paragraph, both buttons, gold line at full 64px width. Stop the server after (`lsof -ti:3000 -sTCP:LISTEN | xargs -r kill`).

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "feat: animate Hero entrance, float shapes, and gold line draw"
```

---

### Task 7: Areas section reveal

**Files:**
- Modify: `components/sections/Areas.tsx`

**Interfaces:**
- Consumes: `Reveal`, `RevealItem` (Task 5).

- [ ] **Step 1: Replace the whole file**

```tsx
// components/sections/Areas.tsx
import { Shield, Receipt, Scale } from "lucide-react";
import { areas, type Area } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

const icons = {
  shield: Shield,
  receipt: Receipt,
  scale: Scale,
} as const;

const iconColors: Record<Area["icon"], string> = {
  shield: "text-gold",
  receipt: "text-navy",
  scale: "text-gold",
};

function AreaIcon({ icon }: { icon: Area["icon"] }) {
  const Icon = icons[icon];
  return (
    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-cream">
      <Icon
        className={iconColors[icon]}
        size={24}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}

function AreaCard({ area }: { area: Area }) {
  return (
    <div className="rounded-[4px] border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-[0_16px_40px_rgba(60,63,78,0.08)] sm:p-10 sm:px-8">
      <AreaIcon icon={area.icon} />
      <span className="text-[11px] font-bold tracking-[0.18em] text-muted">
        {area.tag}
      </span>
      <h3 className="mb-4 mt-2.5 text-xl font-bold sm:text-[22px]">
        {area.title}
      </h3>
      <p className="mb-5 text-sm leading-[1.7] text-muted sm:text-[15px]">
        {area.description}
      </p>
      <div className="border-t border-line pt-[18px] text-[13px] font-semibold text-navy">
        {area.lawyer}
      </div>
    </div>
  );
}

export function Areas() {
  return (
    <section
      id="areas"
      className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <span className="text-xs font-bold tracking-[0.24em] text-gold">
          ÁREAS DE ATUAÇÃO
        </span>
        <h2 className="mt-3.5 max-w-[620px] text-[28px] font-bold leading-[1.25] sm:text-4xl">
          Cada advogado responde diretamente por sua área de atuação.
        </h2>
      </Reveal>
      <Reveal
        stagger
        className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3"
      >
        {areas.map((area) => (
          <RevealItem key={area.tag}>
            <AreaCard area={area} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 3: Verify the reveal triggers on scroll**

Run `pnpm run dev`, wait for it, then:

```bash
cat > /tmp/check-areas.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.click('button[aria-label="Pular introdução"]');
await page.waitForTimeout(300);
await page.locator("#areas").scrollIntoViewIfNeeded();
await page.screenshot({ path: "/tmp/areas-mid-reveal.png" });
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/areas-revealed.png" });
console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-areas.mjs
```

Expected: `ERRORS: []`. `/tmp/areas-mid-reveal.png` (taken right as the section enters view) shows the cards not yet fully visible or mid-stagger. `/tmp/areas-revealed.png` shows all 3 cards fully visible with icons intact (regression check: the lucide icons from the earlier phase must still render). Stop the server after.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Areas.tsx
git commit -m "feat: add scroll reveal to Areas section"
```

---

### Task 8: Sobre section reveal

**Files:**
- Modify: `components/sections/Sobre.tsx`

**Interfaces:**
- Consumes: `Reveal`, `RevealItem` (Task 5).

- [ ] **Step 1: Wrap the two columns**

```tsx
// components/sections/Sobre.tsx
import { values, type Value } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function ValueItem({ value }: { value: Value }) {
  return (
    <div className="flex items-start gap-5">
      <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full border border-[#d8c9a6] text-[13px] font-bold text-gold">
        {value.n}
      </span>
      <div>
        <h4 className="mb-1.5 text-base font-bold">{value.title}</h4>
        <p className="text-sm leading-[1.6] text-muted">
          {value.description}
        </p>
      </div>
    </div>
  );
}

export function Sobre() {
  return (
    <section
      id="escritorio"
      className="bg-cream px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-18">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.24em] text-gold">
            O ESCRITÓRIO
          </span>
          <h2 className="mb-6 mt-3.5 text-[26px] font-bold leading-[1.3] sm:text-[34px]">
            Uma estrutura, três áreas de atuação.
          </h2>
          <p className="mb-5 text-base leading-[1.8] text-muted-dark">
            O Dantas Gimenez &amp; Machado reúne advocacia previdenciária,
            tributária e civil sob uma mesma estrutura. Cada advogado conduz
            diretamente os casos de sua área, com atendimento técnico em
            todas as etapas do processo.
          </p>
          <p className="text-base leading-[1.8] text-muted-dark">
            O primeiro contato já é direcionado ao advogado responsável pela
            área correspondente ao caso.
          </p>
        </Reveal>
        <Reveal stagger className="flex flex-col gap-7">
          {values.map((value) => (
            <RevealItem key={value.n}>
              <ValueItem value={value} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 3: Verify visually**

Reuse the Task 7 script pattern, swapping `#areas` for `#escritorio` and the output filenames for `/tmp/sobre-mid-reveal.png` / `/tmp/sobre-revealed.png`. Expected: `ERRORS: []`, both text column and the 4 numbered values render correctly revealed.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Sobre.tsx
git commit -m "feat: add scroll reveal to Sobre section"
```

---

### Task 9: Advogados section reveal

**Files:**
- Modify: `components/sections/Advogados.tsx`

**Interfaces:**
- Consumes: `Reveal`, `RevealItem` (Task 5).

- [ ] **Step 1: Wrap the heading and the card grid**

```tsx
// components/sections/Advogados.tsx
import Image from "next/image";
import { lawyers, type Lawyer } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div>
      {lawyer.photoSrc ? (
        <div className="relative h-80 w-full overflow-hidden rounded-[3px]">
          <Image
            src={lawyer.photoSrc}
            alt={lawyer.name}
            fill
            sizes="(min-width: 1180px) 372px, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <ImagePlaceholder label={lawyer.photoLabel} className="h-80 w-full" />
      )}
      <div className="pt-[22px]">
        <h3 className="mb-1 text-[19px] font-bold">{lawyer.name}</h3>
        <span className="text-[13px] font-semibold tracking-[0.04em] text-gold">
          {lawyer.area}
        </span>
        <p className="my-3.5 text-sm leading-[1.7] text-muted">
          {lawyer.bio}
        </p>
        <span className="text-xs tracking-[0.03em] text-muted-light">
          {lawyer.oab}
        </span>
      </div>
    </div>
  );
}

export function Advogados() {
  return (
    <section
      id="advogados"
      className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <Reveal className="mx-auto max-w-[1180px]">
        <span className="text-xs font-bold tracking-[0.24em] text-gold">
          EQUIPE
        </span>
        <h2 className="mt-3.5 max-w-[620px] text-[28px] font-bold leading-[1.25] sm:text-4xl">
          Advogados responsáveis por área.
        </h2>
      </Reveal>
      <Reveal
        stagger
        className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
      >
        {lawyers.map((lawyer) => (
          <RevealItem key={lawyer.name}>
            <LawyerCard lawyer={lawyer} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 3: Verify visually**

Reuse the Task 7 script pattern against `#advogados`, output files `/tmp/advogados-mid-reveal.png` / `/tmp/advogados-revealed.png`. Expected: `ERRORS: []`; the Deborah and Vinícius photos (real images, not placeholders) still render inside their `RevealItem` wrapper — this is the regression to watch for, since `next/image`'s `fill` layout depends on its parent having a defined size, and `RevealItem` is a plain `motion.div` (block-level, no intrinsic size constraint) — confirm the photos are not stretched, collapsed, or missing in the screenshot.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Advogados.tsx
git commit -m "feat: add scroll reveal to Advogados section"
```

---

### Task 10: Faq and Contato section reveals

**Files:**
- Modify: `components/sections/Faq.tsx`
- Modify: `components/sections/Contato.tsx`

**Interfaces:**
- Consumes: `Reveal`, `RevealItem` (Task 5).

- [ ] **Step 1: Wrap Faq's heading and question list**

```tsx
// components/sections/Faq.tsx
"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-cream px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <div className="mx-auto max-w-[780px]">
        <Reveal className="mb-10 text-center sm:mb-14">
          <span className="text-xs font-bold tracking-[0.24em] text-gold">
            PERGUNTAS FREQUENTES
          </span>
          <h2 className="mt-3.5 text-[26px] font-bold sm:text-[34px]">
            Dúvidas comuns
          </h2>
        </Reveal>
        <Reveal stagger>
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <RevealItem
                key={faq.question}
                className="border-b border-line-soft"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-5 px-1 py-6 text-left"
                >
                  <h4 className="m-0 text-base font-semibold">
                    {faq.question}
                  </h4>
                  <span className="relative h-[22px] w-[22px] flex-shrink-0">
                    <span className="absolute left-0 top-1/2 h-0.5 w-[22px] -translate-y-1/2 bg-navy" />
                    <span
                      className={`absolute left-1/2 top-0 h-[22px] w-0.5 -translate-x-1/2 bg-navy transition-opacity duration-[250ms] ${
                        open ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height] duration-[400ms] ease-in-out"
                  style={{ maxHeight: open ? "240px" : "0px" }}
                >
                  <p className="mx-1 mb-6 text-[15px] leading-[1.75] text-muted">
                    {faq.answer}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wrap Contato's content block**

```tsx
// components/sections/Contato.tsx
import { contact, whatsappLink } from "@/lib/content";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";

export function Contato() {
  return (
    <section
      id="contato"
      className="bg-navy px-5 py-16 sm:px-8 sm:py-24 lg:py-[120px]"
    >
      <Reveal className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="text-xs font-bold tracking-[0.24em] text-gold">
            LOCALIZAÇÃO E CONTATO
          </span>
          <h2 className="mb-7 mt-3.5 text-[26px] font-bold leading-[1.3] text-white sm:text-[32px]">
            Atendimento presencial e online.
          </h2>
          <div className="mb-9 flex flex-col gap-[18px]">
            <div className="text-[15px] leading-[1.7] text-text-soft">
              {contact.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
            <div className="text-[15px] text-text-soft">
              {contact.phone} · {contact.email}
            </div>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener"
            className="inline-block rounded-[3px] bg-gold px-[30px] py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
          >
            Falar no WhatsApp
          </a>
        </div>
        <ImagePlaceholder
          label="mapa — inserir localização"
          rounded
          className="h-80 w-full"
        />
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 4: Verify both sections visually, and that the FAQ accordion still works**

Run `pnpm run dev`, wait for it, then:

```bash
cat > /tmp/check-faq-contato.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.click('button[aria-label="Pular introdução"]');
await page.waitForTimeout(300);

await page.locator("#faq").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const faqButtons = await page.locator("#faq button").all();
await faqButtons[1].click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/faq-revealed-and-toggled.png" });

await page.locator("#contato").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/contato-revealed.png" });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-faq-contato.mjs
```

Expected: `ERRORS: []`. `/tmp/faq-revealed-and-toggled.png` shows all 4 questions visible (revealed) with the 2nd question's answer expanded (the accordion still works after wrapping items in `RevealItem`). `/tmp/contato-revealed.png` shows the address/phone/CTA and the map placeholder both visible together. Stop the server after.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Faq.tsx components/sections/Contato.tsx
git commit -m "feat: add scroll reveal to Faq and Contato sections"
```

---

### Task 11: WhatsApp button pulse ring

**Files:**
- Modify: `components/ui/WhatsAppButton.tsx`

**Interfaces:**
- None consumed beyond `motion/react`'s `motion` export. This is the last component task — nothing later depends on it.

- [ ] **Step 1: Restructure the component**

```tsx
// components/ui/WhatsAppButton.tsx
"use client";

import { motion } from "motion/react";
import { whatsappLink } from "@/lib/content";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gold"
        animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener"
        aria-label="Falar no WhatsApp"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg font-bold text-white transition-colors hover:bg-gold-dark sm:h-14 sm:w-14 sm:text-xl"
      >
        W
      </a>
    </div>
  );
}
```

Note this file needs `"use client"` now (it didn't before) because it uses `motion.span`.

- [ ] **Step 2: Typecheck and build**

Run: `pnpm exec tsc --noEmit && pnpm run build`
Expected: no errors.

- [ ] **Step 3: Verify the pulse ring renders and the button still links out correctly**

Run `pnpm run dev`, wait for it, then:

```bash
cat > /tmp/check-whatsapp.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.click('button[aria-label="Pular introdução"]');
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/whatsapp-pulse-1.png" });
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/whatsapp-pulse-2.png" });
const href = await page.getAttribute('a[aria-label="Falar no WhatsApp"]', "href");
console.log("HREF:", href);
console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-whatsapp.mjs
```

Expected: `ERRORS: []`. `HREF` starts with `https://wa.me/5567900000000`. Comparing `/tmp/whatsapp-pulse-1.png` and `/tmp/whatsapp-pulse-2.png`, the gold ring around the button should be at a visibly different size/opacity between the two captures (proves the loop is animating, not static). Stop the server after.

- [ ] **Step 4: Commit**

```bash
git add components/ui/WhatsAppButton.tsx
git commit -m "feat: add pulse ring animation to WhatsApp button"
```

---

### Task 12: Full-site regression pass (mobile + desktop + reduced motion)

**Files:** none (verification only).

**Interfaces:** none — this task exercises the finished feature end-to-end.

- [ ] **Step 1: Lint, typecheck, and build the whole project**

Run:
```bash
pnpm exec eslint app components lib
pnpm exec tsc --noEmit
pnpm run build
```
Expected: all three succeed with zero errors/warnings from `app`, `components`, or `lib` (the `example/` reference folder is expected to still have its own pre-existing lint noise, unrelated to this work — ignore it).

- [ ] **Step 2: Desktop pass — full scroll, every section, console clean**

Run `pnpm run dev`, wait for it, then:

```bash
cat > /tmp/check-full-desktop.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2200); // let the full intro play out, no skip this time
await page.screenshot({ path: "/tmp/full-desktop-hero.png" });

for (const id of ["areas", "escritorio", "advogados", "faq", "contato"]) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/full-desktop-${id}.png` });
}

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-full-desktop.mjs
```

Expected: `ERRORS: []`. Read each of the 6 screenshots and confirm: the intro fully completed (hero visible, no overlay) in the first one, and every section below is fully revealed (no elements stuck at `opacity: 0`) in the rest.

- [ ] **Step 3: Mobile pass — same sections, 390×844 viewport, plus the hamburger menu**

```bash
cat > /tmp/check-full-mobile.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.click('button[aria-label="Pular introdução"]');
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/full-mobile-hero.png" });

await page.click('button[aria-label="Abrir menu"]');
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/full-mobile-menu.png" });
await page.click('button[aria-label="Fechar menu"]');
await page.waitForTimeout(300);

for (const id of ["areas", "escritorio", "advogados", "faq", "contato"]) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/tmp/full-mobile-${id}.png` });
}

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-full-mobile.mjs
```

Expected: `ERRORS: []`. Every screenshot shows correctly stacked, fully revealed single-column content; the hamburger menu still opens/closes over the (now-animated) hero without visual glitches.

- [ ] **Step 4: `prefers-reduced-motion` pass — confirm the whole page is usable near-instantly**

```bash
cat > /tmp/check-full-reduced.mjs <<'EOF'
import { chromium } from "/home/cristian/workspaces/giselle-hage/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ args: ["--no-sandbox"], executablePath: "/usr/bin/chromium-browser" });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.emulateMedia({ reducedMotion: "reduce" });
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/full-reduced-hero.png" });
await page.locator("#advogados").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/full-reduced-advogados.png" });

console.log("ERRORS:", JSON.stringify(errors));
await browser.close();
EOF
node /tmp/check-full-reduced.mjs
```

Expected: `ERRORS: []`. `/tmp/full-reduced-hero.png` (only 400ms after load) already shows the hero fully visible, no overlay, no mid-draw icon. `/tmp/full-reduced-advogados.png` (scrolled to right after) shows the lawyer cards already visible — content should not be stuck invisible waiting on a transform-based animation that `MotionConfig reducedMotion="user"` was supposed to simplify away.

- [ ] **Step 5: Stop the dev server**

```bash
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
```

- [ ] **Step 6: Commit (only if Steps 1–4 required any fixes)**

If everything passed with no code changes needed, there's nothing to commit — this task was pure verification. If you had to fix something to get a clean pass, commit that fix with a message describing what regressed and why.

---

## Post-plan cleanup

None of these tasks touch `docs/superpowers/specs/2026-08-16-motion-animations-design.md` — leave it as the historical record of the design decisions. No follow-up work is implied beyond what's listed above; the "Fora de escopo" section of the spec (parallax, scroll-pin, session-based intro gating) stays out of scope unless the client asks for it in a future round.
