# Cinematic Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the supplied cinematic videos and scroll-driven GSAP motion into the homepage without compromising accessibility or readability.

**Architecture:** A reusable client `CinematicVideo` component owns browser-safe muted playback and static fallbacks. `CinematicScroll` owns scoped GSAP/ScrollTrigger effects for marked homepage elements, while each section only declares semantic markers and layout. It wraps Hero through Contato so the hero video belongs to the same scoped animation root. The hero keeps its opening GSAP scene but replaces the abstract background with the supplied video.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, GSAP 3, ScrollTrigger, Motion One reduced-motion hook.

**Spec:** `docs/superpowers/specs/2026-08-17-cinematic-scroll-design.md`

## Global Constraints

- Use `/hero.mp4`, `/escritorio.mp4`, and `/cta.mp4` from `public/` without changing their binary files.
- Set `muted`, `defaultMuted`, `playsInline`, `loop`, `preload="metadata"`, and imperative `volume = 0` on every video.
- Do not pin, lock, or hijack user scrolling.
- Register ScrollTrigger only from client components and clean it through `gsap.context(...).revert()`.
- Disable GSAP scroll animations and perpetual video animation in `prefers-reduced-motion: reduce` and simplify mobile behavior below `768px`.
- Preserve readable text over all footage using navy scrims and image fallbacks.

---

### Task 1: Reusable muted video primitive

**Files:**
- Create: `components/motion/CinematicVideo.tsx`
- Test: `pnpm lint`, `pnpm exec tsc --noEmit`

**Interfaces:**
- Produces: `CinematicVideo({ src, className, posterClassName, priority }: CinematicVideoProps)`.
- Consumes: a public asset path such as `"/hero.mp4"` and a CSS class for the `<video>` surface.

- [ ] **Step 1: Verify the public video assets exist**

Run: `find public -maxdepth 1 -type f -name '*.mp4' -printf '%f %k KB\n'`

Expected: `hero.mp4`, `escritorio.mp4`, and `cta.mp4` are listed.

- [ ] **Step 2: Create the failing type-check target**

Create a temporary import of `CinematicVideo` in the first consuming component before the component exists, then run:

Run: `pnpm exec tsc --noEmit`

Expected: TypeScript reports that `@/components/motion/CinematicVideo` cannot be resolved.

- [ ] **Step 3: Implement the component**

Create a client component with the following behavior:

```tsx
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  void video.play().catch(() => undefined);
}, []);

return <video ref={videoRef} muted defaultMuted playsInline loop preload="metadata" />;
```

Render an opaque navy fallback layer beneath the video so content never depends on load success.

- [ ] **Step 4: Verify the primitive compiles**

Run: `pnpm lint && pnpm exec tsc --noEmit`

Expected: both commands exit `0`.

- [ ] **Step 5: Commit the primitive**

```bash
git add components/motion/CinematicVideo.tsx
git commit -m "feat: add muted cinematic video primitive"
```

### Task 2: Hero video and opening choreography

**Files:**
- Modify: `components/sections/Hero.tsx`
- Modify: `components/hero/CinematicBackdrop.tsx`
- Test: `pnpm lint`, `pnpm exec tsc --noEmit`

**Interfaces:**
- Consumes: `CinematicVideo` from Task 1 with `src="/hero.mp4"` and `priority`.
- Produces: a hero video layer marked `data-cinematic="hero-video"` for Task 4.

- [ ] **Step 1: Add a failing consumer import**

Import `CinematicVideo` from the planned module in `Hero.tsx`, then run:

Run: `pnpm exec tsc --noEmit`

Expected: fail until Task 1 has created the module, or pass when executing after Task 1.

- [ ] **Step 2: Place the hero video below overlays**

Render `CinematicVideo` as the first child of the hero section and place a navy-to-transparent gradient layer over it. Keep `CinematicBackdrop` above the video and below content. Add `data-cinematic="hero-video"` to the video wrapper.

- [ ] **Step 3: Retain a static reduced-motion scene**

Pass the reduced-motion state to the backdrop so its entrance and perpetual particles remain disabled. Do not reduce heading opacity or hide content in this mode.

- [ ] **Step 4: Verify hero compilation**

Run: `pnpm lint && pnpm exec tsc --noEmit`

Expected: both commands exit `0`.

- [ ] **Step 5: Commit the hero scene**

```bash
git add components/sections/Hero.tsx components/hero/CinematicBackdrop.tsx
git commit -m "feat: add cinematic hero video"
```

### Task 3: Office and contact video compositions

**Files:**
- Modify: `components/sections/Sobre.tsx`
- Modify: `components/sections/Contato.tsx`
- Test: `pnpm lint`, `pnpm exec tsc --noEmit`

**Interfaces:**
- Consumes: `CinematicVideo` from Task 1.
- Produces: `[data-cinematic="office-frame"]`, `[data-cinematic="office-video"]`, `[data-cinematic="contact-section"]`, and `[data-cinematic="contact-video"]` markers for Task 4.

- [ ] **Step 1: Convert video-owning sections to client components**

Add `"use client"` only to `Sobre.tsx` and `Contato.tsx`, then import `CinematicVideo`. Do not move content data or navigation links into client state.

- [ ] **Step 2: Add the office visual frame**

In `Sobre`, preserve the existing copy and values but introduce a responsive video frame with `src="/escritorio.mp4"`, an antique-gold border/edge, a navy gradient overlay, and the office markers. On desktop it occupies the visual column; on mobile it follows the explanatory paragraphs before the values.

- [ ] **Step 3: Turn contact into a video-backed CTA**

In `Contato`, replace `ImagePlaceholder` with a full-section `CinematicVideo` using `src="/cta.mp4"`. Place a navy scrim above the video and retain the contact content in a relative high-z-index container. Add the contact markers.

- [ ] **Step 4: Verify section composition compiles**

Run: `pnpm lint && pnpm exec tsc --noEmit`

Expected: both commands exit `0`.

- [ ] **Step 5: Commit the video sections**

```bash
git add components/sections/Sobre.tsx components/sections/Contato.tsx
git commit -m "feat: add office and contact video scenes"
```

### Task 4: Scoped ScrollTrigger choreography

**Files:**
- Create: `components/motion/CinematicScroll.tsx`
- Modify: `app/page.tsx`
- Modify: `components/sections/Areas.tsx`
- Modify: `components/sections/Sobre.tsx`
- Modify: `components/sections/Advogados.tsx`
- Modify: `components/sections/Faq.tsx`
- Modify: `components/sections/Contato.tsx`
- Test: `pnpm lint`, `pnpm exec tsc --noEmit`

**Interfaces:**
- Produces: `CinematicScroll({ children }: { children: ReactNode })`.
- Consumes: `data-cinematic` markers declared by Tasks 2–3 and this task.

- [ ] **Step 1: Add section markers**

Mark the Areas grid, office values, lawyer image surfaces, FAQ list, and contact CTA using stable `data-cinematic` values. Do not target generated Motion class names.

- [ ] **Step 2: Implement a client wrapper**

Create `CinematicScroll` with a local root ref, `useReducedMotion`, and a `useLayoutEffect`. Register `ScrollTrigger` inside the effect. Return early for reduced motion and for `window.matchMedia("(max-width: 767px)").matches`.

```tsx
const context = gsap.context(() => {
  gsap.to("[data-cinematic='hero-video']", {
    yPercent: 8,
    opacity: 0.48,
    ease: "none",
    scrollTrigger: { trigger: "#topo", start: "top top", end: "bottom top", scrub: true },
  });
}, root);

return () => context.revert();
```

Apply equivalent subtle, non-pinned effects for the office mask/video, lawyer photographs, FAQ list outline, and contact video/CTA.

- [ ] **Step 3: Wrap homepage content**

In `app/page.tsx`, render Hero through Contato inside `CinematicScroll`. Leave Navbar, Footer, and WhatsAppButton structurally unchanged.

- [ ] **Step 4: Verify all animation modules compile**

Run: `pnpm lint && pnpm exec tsc --noEmit`

Expected: both commands exit `0`.

- [ ] **Step 5: Commit scroll choreography**

```bash
git add app/page.tsx components/motion/CinematicScroll.tsx components/sections
git commit -m "feat: add cinematic scroll choreography"
```

### Task 5: Browser validation and graceful degradation

**Files:**
- Modify only if validation reveals a defect: files from Tasks 1–4.
- Test: browser desktop/mobile/reduced-motion check; `pnpm lint`; `pnpm exec tsc --noEmit`; `pnpm build` when Google Fonts is reachable.

- [ ] **Step 1: Start the existing development server and load the homepage**

Run: `pnpm dev`

Expected: browser loads the hero and no console errors appear.

- [ ] **Step 2: Validate desktop behavior**

At a desktop viewport, confirm all three videos load muted, the hero remains legible, the office frame masks into view, lawyer images subtly parallax, FAQ stays clickable, and contact brightens toward its CTA.

- [ ] **Step 3: Validate mobile and reduced-motion behavior**

At a mobile viewport and with `prefers-reduced-motion: reduce`, confirm content is immediately visible, video audio never plays, no scroll-linked transforms run, and no controls are shown.

- [ ] **Step 4: Run static verification**

Run: `pnpm lint && pnpm exec tsc --noEmit && git diff --check`

Expected: all checks exit `0` with no whitespace errors.

- [ ] **Step 5: Run the production build when font network access is available**

Run: `pnpm build`

Expected: successful production build. If it fails before compilation because `next/font` cannot reach Google Fonts, record that external network blocker separately from application validation.
