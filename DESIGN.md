---
name: Antosan Virtual Waiting Room
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#035d43'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a765a'
  on-tertiary-container: '#aefad7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#a6f2cf'
  tertiary-fixed-dim: '#8bd6b4'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-base:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  code-metric:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  code-metric-mobile:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  space-4xl: 6rem
  layout-margin-mobile: 1rem
  layout-margin-tablet: 2rem
  layout-margin-desktop: 3rem
  container-max-width: 768px
---

## Brand & Style

The design system establishes a high-trust, mission-critical interface for high-traffic queuing infrastructure. In virtual waiting rooms, users frequently face anxiety, uncertainty, and latency frustration. The brand philosophy counters this through **Architectural Serenity** combined with **Enterprise SaaS Rigor**: an experience characterized by absolute calm, structural equilibrium, transparency, and precision.

### Personality & Emotional Response
- **Unflappable Stability:** Visuals project uninterrupted technical resilience. Interfaces communicate real-time throughput without jitter or sensory noise.
- **Architectural Clarity:** Layouts draw from modernist architectural principles-measured proportions, structured planes, deliberate air, and honest materials.
- **Controlled Reassurance:** Interactions avoid patronizing microcopy or gamified distractions. Progress is communicated with mathematical honesty and quiet confidence.

### Visual Style
The design system employs a refined synthesis of **Minimalism** and **Tonal Precision**. It replaces theatrical shadows with subtle boundary shifts, crisp hair-thin borders, and layered planar surfaces over a warm, tactile ground (`#FFFBF2`). Interfaces feel grounded, purposeful, and distinctly engineered rather than generic.

## Colors

The palette is constrained to enforce clinical authority, visual calmness, and WCAG AAA/AA accessibility compliance. Every color role is defined to eliminate ambiguity during high-stress user waiting states.

### Core Swatches
- **Primary (`#0F766E` - Deep Teal):** Used for primary CTAs, active operational indicators, hero progress indicators, and prominent anchor typography. Conveys stability, technical gravity, and structural cohesion.
- **Secondary / Accent (`#14B8A6` - Turquoise):** Used for interactive focus rings, active step highlights, live dynamic meters, and secondary accents.
- **Light Accent / Tint (`#A7F3D0` - Mint):** Used exclusively for soft operational badges, success banners, dynamic wait-time reductions, and active bar track highlights.
- **Neutral / Body (`#475569` - Slate Gray):** Reserved for secondary labels, body narrative, transactional timestamps, and instructional text.
- **Background / Canvas (`#FFFBF2` - Warm Ivory):** The foundational substrate. Replaces clinical sterile whites with an organic, ocular-resting warmth that reduces perceived screen glare during extended hold times.
- **High-Contrast Dark (`#0F172A` - Deep Slate):** Core display typography, queue position digits, and high-priority technical readouts.

### Structural & Border Tokens
- **Surface Elevation Base:** `#FFFBF2` (Canvas)
- **Surface Elevation Tier 1:** `#FFFFFF` (Elevated queue containment modules)
- **Surface Elevation Muted:** `#F8F6ED` (Recessed metadata wells and track bases)
- **Border Default:** `#E2E8F0` (Card boundaries, panel dividers)
- **Border Strong / Muted Trim:** `#CBD5E1` (Input fields, focused interactive separators)

### Semantic Rules
- Color is never used as the sole conveyor of queue updates. Numerical values and directional iconography always accompany state changes.
- Destructive actions and critical system timeouts inherit deep slate with amber/crimson telemetry sparingly, ensuring zero deviation from the teal-slate axis during normal queue progression.

## Typography

The typographical pairing reinforces technical governance and precision legibility.

### Hierarchy & Pairings
- **Headings (`Space Grotesk`):** Delivers clean, architectural proportion with geometric balance. Used for primary state announcements, header locks, and queue milestones.
- **Body (`Hanken Grotesk`):** Highly legible, humanistic sans-serif tuned for extended digital readability. Used for explanatory messages, system status notes, and guidelines.
- **Metrics & Technical Indicators (`JetBrains Mono`):** Fixed-width clarity for dynamic numbers (e.g., position numbers, queue IDs, estimated wait countdowns, server timestamps). Monospace figures eliminate optical layout shifts as numerical values recalculate.

### Typesetting Directives
- **Zero Decorative Styling:** Never employ underlines, stylized display fonts, or italics in informational states.
- **Strict Case Rules:** Monospace indicators (`label-mono`) default to uppercase with `0.04em` tracking for telemetry attributes (`QUEUE_ID`, `EST_ARRIVAL`, `LATENCY_OK`).

## Layout & Spacing

Virtual waiting rooms require concentrated cognitive focus. The layout uses a **Centralized Structural Monolith** approach anchored within a responsive container.

### Layout Model
- **Core Canvas Structure:** A single, centered container capped at `768px` for focused desktop presentation, ensuring user gaze remains centered without scanning broad monitor horizons.
- **Vertical Spacing Rhythm:** Strictly enforced 8pt increment base (`0.5rem`, `1rem`, `1.5rem`, `2rem`, `3rem`). Stack gaps between system status indicators and progress tracks prioritize consistent vertical momentum.

### Breakpoints & Adaptive Reflow
- **Desktop (>= 1024px):** 768px centered vessel with vertical centering (`min-height: 80vh`), surrounded by generous Warm Ivory `#FFFBF2` margins. Primary queue indicators sit in a 2-column tabular grid.
- **Tablet (768px – 1023px):** Fluid centered block with `2rem` side gutters. Diagnostic metrics stack cleanly from 4-across to 2-across.
- **Mobile (< 768px):** Full-bleed containment card with `1rem` edge margins. Metric tiles reflow into a linear vertical cascade. Action buttons stretch to full container width for thumb comfort.

## Elevation & Depth

To convey solidity and avoid distracting superficialities, this design system rejects noisy drop shadows and iridescent glass blurs. Depth is produced via **Tonal Planes and Crisp Outlines**.

### Elevation Hierarchy
- **Level 0 (Canvas):** `#FFFBF2` Warm Ivory field. Unbounded, grounding base.
- **Level 1 (Card / Shell Container):** `#FFFFFF` pure white surface framed by a 1px solid border of `#E2E8F0`. Provides unmistakable structural boundary.
- **Level 2 (Recessed Telemetry Wells):** `#F8F6ED` (Warm Ivory mixed down with 4% Slate tint) inset with an inner 1px border of `#E2E8F0`. Establishes carved physical containers for progress bars and metric values.
- **Level 3 (Modal / Security Overlays):** `#FFFFFF` paired with an ultra-subtle ambient shade: `box-shadow: 0 16px 32px -8px rgba(15, 23, 42, 0.08)`. Outlined by 1px solid `#CBD5E1`.

### Optical Boundary Rules
- Every contrast boundary must be reinforced by a 1px solid line (`#E2E8F0` or `#CBD5E1`).
- Shadows, when mandated for accessibility focus rings, use pure teal glow rings: `box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.25)` instead of fuzzy blurs.

## Shapes

The interface embraces a **Soft Architectural (Level 1)** geometry. Corner radii are deliberately restrained to preserve an engineered, stable presence that honors technical infrastructure.

### Curvature Tokens
- **Micro Radii (`rounded-sm` - 2px):** Badges, system chips, tick marks, and internal progress bar indicators.
- **Standard Radii (`rounded` - 4px / 0.25rem):** Action buttons, technical input fields, code blocks, and operational tooltips.
- **Container Radii (`rounded-lg` - 8px / 0.5rem):** Queue presentation cards, informational alert blocks, and session dialog boxes.
- **Strict Avoidance:** No circular pill buttons (`rounded-full`) are permitted, except for 6px status indicator dots. Strict rectangularity with subtle softenings conveys industrial resilience.

## Components

### Buttons
- **Primary Action Button:**
  - Background: `#0F766E` (Deep Teal).
  - Typography: `Hanken Grotesk`, 14px, weight 600, color `#FFFFFF`.
  - Border: 1px solid `#0F766E`.
  - Height & Padding: 44px height, `0.75rem 1.5rem` padding, radius `4px`.
  - States: Hover (`#0D6861`), Active (`#0A524C`), Focus (`box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.3)`).
- **Secondary / Ghost Button:**
  - Background: Transparent.
  - Typography: `Hanken Grotesk`, 14px, weight 500, color `#0F766E`.
  - Border: 1px solid `#CBD5E1`.
  - States: Hover (Background `#F8F6ED`, Border `#0F766E`).

### Cards & Wells
- **Queue Progress Card:**
  - Background: `#FFFFFF`.
  - Border: 1px solid `#E2E8F0`.
  - Radius: `8px`.
  - Interior Spacing: `2rem` desktop, `1.25rem` mobile.
- **Telemetry Metric Well:**
  - Background: `#F8F6ED`.
  - Border: 1px solid `#E2E8F0`.
  - Radius: `4px`.
  - Padding: `1rem`. Houses label and `JetBrains Mono` value readout.

### Progress Meters & Queue Trackers
- **Track Base:** 8px height, background `#E2E8F0`, radius `2px`.
- **Active Progress Fill:** Solid `#0F766E` with leading head in `#14B8A6`.
- **Pacing Animation:** Smooth linear transition curves (minimum `600ms ease-out`). No erratic jumping or pulsing effects.

### Status Chips & Badges
- **Operational Status Chip:**
  - Background: `#A7F3D0` (Mint) at 35% opacity.
  - Text: `#0F766E` (Deep Teal), `label-mono`, 12px, weight 600.
  - Border: 1px solid rgba(15, 118, 110, 0.2).
  - Left icon: 6px solid `#0F766E` circle.

### Form Inputs & Checkboxes
- **Input Fields:**
  - Background: `#FFFFFF`.
  - Border: 1px solid `#CBD5E1`.
  - Text: `#0F172A`, Placeholder: `#475569`.
  - Focus Ring: 1px solid `#14B8A6`, outer halo `3px rgba(20, 184, 166, 0.2)`.
- **Checkboxes & Radios:**
  - Size: 18x18px.
  - Checkbox border: 1.5px solid `#CBD5E1`, radius `2px`.
  - Checked State: Background `#0F766E`, border `#0F766E`, indicator white check.

### Live Telemetry Row
- Dedicated key-value list for session verification.
- Layout: 2-column grid. Left label in `#475569` (`label-caps`), right value in `#0F172A` (`JetBrains Mono`, 13px). Separated by 1px dotted border `#E2E8F0`.