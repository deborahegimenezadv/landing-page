# Cinematic Scroll Design

## Goal

Transform the homepage motion language into a restrained cinematic experience for Dantas Gimenez & Machado: abstract golden light, depth, and scroll-led scene changes that retain legal-site clarity and accessibility.

## Visual Direction

Use the selected **Ouro atmosférico** direction: dark navy/graphite imagery, antique-gold volumetric light, drifting dust, and generous negative space for content. Do not use literal legal iconography, people, courtrooms, gavels, scales, logos inside footage, or visible video audio controls.

## Video Roles

### Hero — `/hero.mp4`

The hero video is a muted, looping, inline background. A navy-to-transparent overlay preserves contrast behind the heading; the existing particulate/light layer remains above it. The video is mildly translated and darkened through the opening scroll range, producing camera-like depth without controlling the user’s scroll.

### Escritório — `/escritorio.mp4`

The office section gains a dedicated visual frame in its second column. The video is muted and inline with a dark gradient/antique-gold edge treatment. A scroll-triggered clip-path reveal exposes the frame, followed by a subtle parallax on the video. The values retain their semantic ordering and become content alongside the video rather than overlays on it.

### Contato — `/cta.mp4`

The contact video replaces the map placeholder as a full-section background. Content is raised above a navy scrim; the video brightens and shifts slightly as the section enters. The contact details and WhatsApp CTA always maintain the existing contrast and touch target dimensions.

## Motion System

GSAP and `ScrollTrigger` provide all new scroll-linked motion. Register triggers only in client components and scope them with `gsap.context`, returning `context.revert()` on unmount. Do not pin sections or hijack scrolling.

- Areas: use existing reveal pattern, enhanced only by a single gold progress line across its card grid.
- Escritório: mask reveal and video parallax; stagger the three value rows.
- Advogados: move imagery subtly against the scroll direction and reveal textual metadata with a mask.
- FAQ: retain interaction-first behavior; animate only the section heading and accordion outline entrance.
- Contato: fade the video/overlay from dark to lit and reveal CTA once.

## Accessibility and Performance

All videos use `muted`, `defaultMuted`, `playsInline`, `preload="metadata"`, and an imperative `volume = 0` fallback before playback. They do not autoplay audio. Each video has a background-color/gradient fallback and is hidden on small viewports only where layout needs it; no content depends on video playback.

For `prefers-reduced-motion: reduce`, no ScrollTrigger instances or perpetual GSAP loops run. Videos remain muted and visually static at their poster/first frame, all content is immediately visible, and decorative layers do not animate.

On mobile, do not apply parallax or clip-path reveals. The hero retains a static dim video background; the office frame remains a static image/video surface; contact remains legible over a static scrim.

## Validation

Run ESLint and TypeScript checks. Run a production build when font network access is available. Validate in browser at desktop and mobile widths: no console errors, no unmuted audio, reduced-motion has no continuous movement, headings remain readable, and every video failure still presents readable content.
