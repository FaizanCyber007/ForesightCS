# ForesightCS — Full Premium Overhaul Plan

## Current state (verified, not assumed)
- **Build is BROKEN**: `components/features/rule-builder-form.tsx:254` → `next build` fails with a JSX parse error. `npm run lint` → 1 error + 3 warnings.
- The 3D is locked in a 420px box in the hero only; `OrbitControls` + `autoRotate` fight cursor tracking; it does **not** follow scroll or cursor across the page.
- No mobile navigation (links/buttons are `hidden md:flex` with zero fallback).
- No reusable `Select`/`Textarea`/`Skeleton` (raw elements with duplicated inline classes).
- Auth pages have no Navbar/back-path. Table rows aren't keyboard-accessible (`router.push` on click).

All decisions confirmed: **(1)** fixed ambient full-viewport 3D layer on marketing routes, invisible on the dashboard; **(2)** full overhaul including proactive CS features.

---

## Phase A — Stabilize the build
- **Rewrite `components/features/rule-builder-form.tsx`** end-to-end with correct JSX nesting, using a shared `<Field>` wrapper, the new `<Select>` primitive, and a driven `operators`/`metrics` array (eliminates the fragile inline `<option value=">">`). Zod behavior unchanged.
- Remove unused imports flagged by lint (`ArrowRight` in pricing, `GlassCard` in navbar, unused `form` in contact).

## Phase B — Design-system primitives (`components/ui/`)
- **`select.tsx`** — styled `<select>` matching the `Input` design (glass, focus ring, dark options).
- **`textarea.tsx`** — styled textarea for the contact form.
- **`skeleton.tsx`** — shimmer skeleton base; rebuild `loading.tsx` files to use it (matching exact data shapes).
- **`tabs.tsx`** — accessible tabs (for Customer 360 sections / dashboard).
- **`toast.tsx`** — lightweight local toast (AnimatePresence) for rule-builder "Saved" + contact "Sent".
- **`command-palette.tsx`** — ⌘K palette (search accounts → jump to Customer 360, quick nav). Wired into `dashboard-header.tsx` (the non-functional "⌘K" hint becomes real).
- Update `components/ui/index.ts` barrel.

## Phase C — The headline feature: ambient 3D scene
- **New `components/features/scene-3d.tsx`** (replaces `hero-3d.tsx`):
  - `'use client'`, fixed `inset-0 z-0 pointer-events-none` container behind marketing content.
  - Global `pointermove` + `scroll` listeners → normalized cursor (−1..1) + scroll-progress (0..1) stored in refs (R3F's built-in `pointer` won't fire since canvas is `pointer-events-none`).
  - In `useFrame`: lerp orb rotation/position toward cursor; drive rotation.y + distortion amount from scroll-progress (the orb visibly "scrolls/morphs" as you move down the page).
  - Premium object: glowing distorted icosahedron core + wireframe shell + particle field (emerald/violet brand glow).
  - Perf: `dpr={[1,1.5]}`, `gl={{ antialias, powerPreference:'high-performance' }}`, lazy client mount, `Suspense` fallback `null`.
  - `prefers-reduced-motion` → static, no rotation.
- Landing hero redesigned to let the ambient 3D show through (transparent/glass hero panel instead of an opaque boxed canvas). The 3D lives in the **shared marketing layout**, so it appears behind landing, pricing, contact, login, register — **not** the dashboard.

## Phase D — Route structure + shared layout + mobile nav
- Introduce route group **`app/(marketing)/`** with **`layout.tsx`** that renders `<Navbar/>` + `<Scene3D/>` (ambient) + `{children}` + `<Footer/>`; content sits at `relative z-10`.
- Move `page.tsx` (landing), `pricing/`, `contact/`, `login/`, `register/` into `(marketing)/`. Auth pages now get the Navbar (fixes the dead-end back-path).
- `app/dashboard/layout.tsx` stays as-is (sidebar shell, **no 3D**) — ambient layer simply isn't rendered there.
- **Mobile nav**: make `Navbar` a client component with a hamburger (`< md`); animated Framer Motion drawer with nav links + auth buttons. Mobile users regain full navigation.

## Phase E — Accessibility & UI/UX polish (all screens)
- **Customer table**: replace `onClick → router.push` with a real `<Link>` on the account cell (keyboard + screen-reader navigable); keep row hover affordance.
- Consistent focus-visible rings on every Select/Input/Textarea/button; aria-labels on icon buttons.
- **Modal**: add focus-trap + initial focus on open (currently Escape-only).
- Use the loaded `JetBrains Mono` for numeric metrics (MRR, scores, %) — the "data terminal" feel (Vercel/Stripe). Currently the font is loaded but unused.
- Normalize spacing/radii/eyebrow labels across sections; lighten small `text-zinc-500` copy where contrast is borderline.
- Dashboard header logout: replace `window.location.href` with `router.push('/')`.
- `prefers-reduced-motion` already handled in most motion components — audit and complete it.

## Phase F — Proactive CS features (industry-standard add-ons)
Grounded in Gainsight/ChurnZero/Vitally/Planhat patterns:
- **Health Score Gauge + Breakdown** on Customer 360: radial gauge + contributing-factor bars (product adoption, support load, billing, engagement). The signature CS feature.
- **Portfolio Signal Feed** on the dashboard: live cross-account timeline of churn signals / save-play triggers.
- **Command Palette (⌘K)** — real account search + jump-to-360 (Phase B component, wired here).
- **Playbook runner** with statuses on Customer 360 (upgrade the static task list to stateful with toggles + progress).
- Extend `data/mock-data.json` + `services/api.ts` with: per-customer score factors, portfolio signal feed, playbooks. Server Components fetch; loading skeletons match shapes.

## Phase G — Verify
- `npm run lint` clean (0 errors), `npm run build` passes, manual responsiveness/a11y sanity pass. Report results faithfully.

---

### Files touched (summary)
**New:** `components/ui/{select,textarea,skeleton,tabs,toast,command-palette}.tsx`, `components/features/scene-3d.tsx`, `app/(marketing)/layout.tsx`.
**Rewritten:** `components/features/rule-builder-form.tsx`.
**Modified:** `hero-3d.tsx` (removed/replaced), `navbar.tsx` (client + mobile), `dashboard-header.tsx` (⌘K + router logout), `customer-table.tsx` (a11y link), `customer-360.tsx` (gauge + playbooks), `dashboard/page.tsx` (signal feed), `ui/index.ts`, `globals.css`, `layout.tsx`, loading/error files, `data/mock-data.json`, `services/api.ts`, route moves into `(marketing)/`.

### Out of scope
- No backend (mock services remain). No auth/session system (still simulated). No i18n. No unit-test framework added (relying on build + lint as the gate).
