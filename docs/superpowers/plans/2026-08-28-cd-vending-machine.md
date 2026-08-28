# SadFlower CD Vending Machine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new SadFlower desktop icon and window containing a responsive, functional 2.5D CD vending-machine demo with album selection, a deterministic dispense sequence, delivery, reset, motion preferences, and accessible controls.

**Architecture:** Keep the feature front-only for this slice. A pure CommonJS state module and local catalogue drive small React presentation components inside an existing `react-rnd` Windows 95 shell; Sass and original SVG assets provide the 2.5D visual without Three.js, PixiJS, WebGL, Strapi, or runtime Blender files.

**Tech Stack:** Next.js Pages Router, React 18, `react-rnd`, Sass, 98.css, Node built-in test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-28-cd-vending-machine-design.md`

## Global Constraints

- Work only on front branch `feat/cd-vending-machine`; keep the matching back branch unchanged.
- Preserve the existing checkout on `fix/whoami` and its uncommitted `WhoAmI` change.
- Do not add Strapi, S3, player, download, profile, authentication, payment, Three.js, PixiJS, WebGL, or runtime `.blend` behavior.
- Use six clearly labelled local demo discs; later Strapi data must be able to replace the data module without changing the visual components.
- Audio starts only after visitor interaction and never blocks dispensing.
- Normal dispense duration is about 3 seconds; reduced-motion completion is nearly immediate.
- The delivered disc remains in the tray until explicit reset.
- Reuse existing desktop icon, Windows 95 frame, `react-rnd`, z-index, Sass, and `98.css` conventions.
- Desktop default is approximately 760×680; mobile controls remain usable with 44×44 CSS-pixel targets.
- Every timer and generated audio resource is cleaned up when the feature unmounts.

---

## File Map

### Create

- `components/system32/applications/CdVendingMachine/vendingMachineData.js` — six-item local demo catalogue.
- `components/system32/applications/CdVendingMachine/vendingMachineState.js` — pure state machine and messages.
- `components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs` — Node state-transition tests.
- `components/system32/applications/CdVendingMachine/machineAudio.js` — guarded Web Audio feedback.
- `components/system32/applications/CdVendingMachine/MachineDisplay.js` — accessible LED display.
- `components/system32/applications/CdVendingMachine/AlbumSlot.js` — accessible selectable disc slot.
- `components/system32/applications/CdVendingMachine/CdVendingMachine.js` — interaction controller and machine composition.
- `components/system32/windows/CdVendingMachine/cdVendingMachineWindow.js` — draggable/resizable Windows shell.
- `styles/system32/windows/CdVendingMachine/cd-vending-machine.sass` — responsive 2.5D appearance and animation.
- `public/CdVendingMachine/icon.svg` — original retro desktop icon.
- `public/CdVendingMachine/generic-disc.svg` — local demo disc/cover fallback.
- `public/CdVendingMachine/ASSET-SOURCES.md` — asset provenance and CC0 Blender source reference.

### Modify

- `pages/index.js` — icon, open state, active-window identity, and window mount.
- `pages/_app.js` — global feature Sass import.
- `tests/sadflower.visual.spec.ts` — desktop/mobile interaction smoke tests.

---

### Task 1: Pure catalogue and vending state machine

**Files:**

- Create: `components/system32/applications/CdVendingMachine/vendingMachineData.js`
- Create: `components/system32/applications/CdVendingMachine/vendingMachineState.js`
- Create: `components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs`

**Interfaces:**

- Produces: `DEMO_ALBUMS: Album[]`, where `Album` has `id`, `slotCode`, `title`, `artist`, `cover`, `accentColor`, and `machineMessage` string fields.
- Produces: `INITIAL_MACHINE_STATE`, `MACHINE_PHASES`, and `transitionMachine(state, event)`.
- State shape: `{ phase, selectedAlbumId, deliveredAlbumId, message }`.
- Events: `{ type: 'SELECT', albumId }`, `{ type: 'OBTAIN' }`, `{ type: 'COMPLETE' }`, `{ type: 'RESET' }`, `{ type: 'FAIL' }`.

- [ ] **Step 1: Write the failing state tests**

```js
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  INITIAL_MACHINE_STATE,
  MACHINE_PHASES,
  transitionMachine,
} = require('./vendingMachineState');
const { DEMO_ALBUMS } = require('./vendingMachineData');

test('catalogue exposes six unique stable slots', () => {
  assert.equal(DEMO_ALBUMS.length, 6);
  assert.equal(new Set(DEMO_ALBUMS.map(({ id }) => id)).size, 6);
  assert.equal(new Set(DEMO_ALBUMS.map(({ slotCode }) => slotCode)).size, 6);
});

test('selection stores a stable album id and can be replaced', () => {
  const first = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-01' });
  const second = transitionMachine(first, { type: 'SELECT', albumId: 'demo-02' });
  assert.equal(second.phase, MACHINE_PHASES.SELECTED);
  assert.equal(second.selectedAlbumId, 'demo-02');
});

test('obtain without selection stays safe and requests a disc', () => {
  const state = transitionMachine(INITIAL_MACHINE_STATE, { type: 'OBTAIN' });
  assert.equal(state.phase, MACHINE_PHASES.IDLE);
  assert.equal(state.message, 'SELECT DISC');
});

test('selected disc travels through dispensing to delivered', () => {
  const selected = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-03' });
  const dispensing = transitionMachine(selected, { type: 'OBTAIN' });
  const delivered = transitionMachine(dispensing, { type: 'COMPLETE' });
  assert.equal(dispensing.phase, MACHINE_PHASES.DISPENSING);
  assert.equal(delivered.phase, MACHINE_PHASES.DELIVERED);
  assert.equal(delivered.deliveredAlbumId, 'demo-03');
});

test('reset clears selection and invalid events preserve state', () => {
  const selected = transitionMachine(INITIAL_MACHINE_STATE, { type: 'SELECT', albumId: 'demo-04' });
  assert.deepEqual(transitionMachine(selected, { type: 'UNKNOWN' }), selected);
  assert.deepEqual(transitionMachine(selected, { type: 'RESET' }), INITIAL_MACHINE_STATE);
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run:

```text
node --test components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
```

Expected: FAIL with `Cannot find module './vendingMachineState'`.

- [ ] **Step 3: Create the six-item catalogue**

```js
'use strict';

const DEMO_ALBUMS = Array.from({ length: 6 }, (_, index) => {
  const number = index + 1;
  const row = index < 3 ? 'A' : 'B';
  const column = (index % 3) + 1;
  const colors = ['#e65454', '#efb74d', '#7bcf8f', '#5e9ee6', '#a77ae8', '#e77fb4'];
  return {
    id: `demo-0${number}`,
    slotCode: `${row}${column}`,
    title: `DEMO DISC 0${number}`,
    artist: 'SADFLOWER ARCHIVE',
    cover: '/CdVendingMachine/generic-disc.svg',
    accentColor: colors[index],
    machineMessage: `DISC ${row}${column} READY`,
  };
});

module.exports = { DEMO_ALBUMS };
```

- [ ] **Step 4: Implement the minimal pure transition function**

```js
'use strict';

const MACHINE_PHASES = Object.freeze({
  IDLE: 'idle',
  SELECTED: 'selected',
  DISPENSING: 'dispensing',
  DELIVERED: 'delivered',
  ERROR: 'error',
});

const INITIAL_MACHINE_STATE = Object.freeze({
  phase: MACHINE_PHASES.IDLE,
  selectedAlbumId: null,
  deliveredAlbumId: null,
  message: 'SELECT DISC',
});

function transitionMachine(state, event) {
  if (!event || typeof event.type !== 'string') return state;
  if (event.type === 'RESET') return INITIAL_MACHINE_STATE;
  if (event.type === 'FAIL') return { ...state, phase: MACHINE_PHASES.ERROR, message: 'SERVICE' };
  if (event.type === 'SELECT' && state.phase !== MACHINE_PHASES.DISPENSING) {
    if (!event.albumId) return state;
    return { phase: MACHINE_PHASES.SELECTED, selectedAlbumId: event.albumId, deliveredAlbumId: null, message: 'DISC READY' };
  }
  if (event.type === 'OBTAIN') {
    if (!state.selectedAlbumId) return { ...state, message: 'SELECT DISC' };
    if (state.phase !== MACHINE_PHASES.SELECTED) return state;
    return { ...state, phase: MACHINE_PHASES.DISPENSING, message: 'DISPENSING' };
  }
  if (event.type === 'COMPLETE' && state.phase === MACHINE_PHASES.DISPENSING) {
    return { ...state, phase: MACHINE_PHASES.DELIVERED, deliveredAlbumId: state.selectedAlbumId, message: 'TAKE DISC' };
  }
  return state;
}

module.exports = { INITIAL_MACHINE_STATE, MACHINE_PHASES, transitionMachine };
```

- [ ] **Step 5: Run focused tests**

Run:

```text
node --test components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
```

Expected: 5 tests pass, 0 fail.

- [ ] **Step 6: Commit the pure model**

```text
git add components/system32/applications/CdVendingMachine/vendingMachineData.js components/system32/applications/CdVendingMachine/vendingMachineState.js components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
git commit -m "feat: add CD vending state model"
```

---

### Task 2: Original icon, generic disc, and asset provenance

**Files:**

- Create: `public/CdVendingMachine/icon.svg`
- Create: `public/CdVendingMachine/generic-disc.svg`
- Create: `public/CdVendingMachine/ASSET-SOURCES.md`

**Interfaces:**

- Produces: `/CdVendingMachine/icon.svg` for the desktop icon.
- Produces: `/CdVendingMachine/generic-disc.svg` for every demo cover and broken-image fallback.

- [ ] **Step 1: Create a 32×32 retro vending-machine icon**

Use a hand-authored SVG with a transparent canvas, dark outline, teal-grey cabinet, six bright disc windows, red display, keypad, and delivery tray. Required root and accessibility-independent structure:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <path fill="#111" d="M5 1h22v30H5z"/>
  <path fill="#808b8b" d="M7 3h18v26H7z"/>
  <path fill="#1a2225" d="M8 5h12v15H8z"/>
  <path fill="#f05b46" d="M21 5h3v4h-3z"/>
  <path fill="#f6d365" d="M9 7h3v3H9zm4 0h3v3h-3zm4 0h2v3h-2z"/>
  <path fill="#6ed6d1" d="M9 12h3v3H9zm4 0h3v3h-3zm4 0h2v3h-2z"/>
  <path fill="#c0c0c0" d="M21 11h3v6h-3z"/>
  <path fill="#101010" d="M10 23h10v4H10z"/>
  <path fill="#4b5558" d="M11 24h8v1h-8z"/>
  <path fill="#fff" d="M7 3h1v25H7z" opacity=".55"/>
</svg>
```

- [ ] **Step 2: Create the generic demo-disc SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <defs>
    <radialGradient id="disc" cx="45%" cy="40%">
      <stop offset="0" stop-color="#f2f2f2"/>
      <stop offset=".42" stop-color="#73d3cc"/>
      <stop offset=".7" stop-color="#af72c8"/>
      <stop offset="1" stop-color="#20252a"/>
    </radialGradient>
  </defs>
  <rect width="320" height="320" fill="#101417"/>
  <path d="M0 40h320M0 112h320M0 236h320" stroke="#536066" stroke-width="3" opacity=".45"/>
  <circle cx="160" cy="154" r="112" fill="url(#disc)" stroke="#050607" stroke-width="10"/>
  <circle cx="160" cy="154" r="28" fill="#101417" stroke="#d8d8d8" stroke-width="7"/>
  <text x="160" y="285" text-anchor="middle" fill="#f05b46" font-family="monospace" font-size="25" font-weight="700">SADFLOWER</text>
  <text x="160" y="311" text-anchor="middle" fill="#c9d0d2" font-family="monospace" font-size="15">DEMO DISC</text>
</svg>
```

- [ ] **Step 3: Record provenance**

Write `ASSET-SOURCES.md` with these exact facts:

```markdown
# CD Vending Machine asset sources

- `icon.svg`: original SadFlower project artwork created for this feature.
- `generic-disc.svg`: original SadFlower project artwork created for this feature.
- Visual source reference: `Vending machine.blend` by GameDevWannabe, downloaded from https://blendswap.com/blend/26402 on 2026-08-28, declared CC0 on the source page.
- The Blender source is not distributed in the web bundle. The current functional slice uses an original CSS/SVG 2.5D composition until dedicated Blender renders replace the layer assets.
- `vending-machine.webp` from FreeGameSprites is not used by this feature.
```

- [ ] **Step 4: Inspect both SVGs**

Open both files through the local image viewer. Expected: sharp silhouettes at original size, transparent outer background, no missing linked resources.

- [ ] **Step 5: Commit assets**

```text
git add public/CdVendingMachine
git commit -m "feat: add CD vending visual assets"
```

---

### Task 3: Accessible machine components and generated feedback audio

**Files:**

- Create: `components/system32/applications/CdVendingMachine/machineAudio.js`
- Create: `components/system32/applications/CdVendingMachine/MachineDisplay.js`
- Create: `components/system32/applications/CdVendingMachine/AlbumSlot.js`
- Create: `components/system32/applications/CdVendingMachine/CdVendingMachine.js`
- Create: `styles/system32/windows/CdVendingMachine/cd-vending-machine.sass`

**Interfaces:**

- Consumes: `DEMO_ALBUMS`, `INITIAL_MACHINE_STATE`, `MACHINE_PHASES`, `transitionMachine` from Task 1.
- Consumes: `/CdVendingMachine/generic-disc.svg` from Task 2.
- Produces: `CdVendingMachine({ albums = DEMO_ALBUMS })`.
- Produces: `stopMachineAudio()` and `playMachineSound(kind, muted)` where `kind` is `select`, `obtain`, `deliver`, or `reset`.

- [ ] **Step 1: Add guarded Web Audio feedback**

```js
let activeContext = null;

function stopMachineAudio() {
  if (activeContext && activeContext.state !== 'closed') activeContext.close().catch(() => {});
  activeContext = null;
}

async function playMachineSound(kind, muted) {
  if (muted || typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  try {
    stopMachineAudio();
    const context = new AudioContext();
    activeContext = context;
    if (context.state === 'suspended') await context.resume();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    gain.connect(context.destination);
    const frequencies = { select: 620, obtain: 95, deliver: 180, reset: 420 };
    const oscillator = context.createOscillator();
    oscillator.type = kind === 'obtain' ? 'sawtooth' : 'square';
    oscillator.frequency.setValueAtTime(frequencies[kind] || 300, context.currentTime);
    if (kind === 'deliver') oscillator.frequency.exponentialRampToValueAtTime(90, context.currentTime + 0.12);
    oscillator.connect(gain);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    oscillator.addEventListener('ended', stopMachineAudio, { once: true });
  } catch {
    stopMachineAudio();
  }
}

module.exports = { playMachineSound, stopMachineAudio };
```

- [ ] **Step 2: Add the LED live region**

```jsx
export default function MachineDisplay({ message, phase }) {
  return (
    <output className="cd-machine-display" data-phase={phase} aria-live="polite" aria-atomic="true">
      {message}
    </output>
  );
}
```

- [ ] **Step 3: Add an accessible album slot**

```jsx
import Image from 'next/image';

export default function AlbumSlot({ album, selected, disabled, onSelect }) {
  const label = `${album.slotCode} — ${album.title} par ${album.artist}`;
  return (
    <button
      type="button"
      className={`cd-album-slot${selected ? ' is-selected' : ''}`}
      style={{ '--disc-accent': album.accentColor }}
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(album)}
    >
      <span className="cd-slot-code">{album.slotCode}</span>
      <span className="cd-cover-frame">
        <Image
          src={album.cover}
          alt=""
          width={180}
          height={180}
          aria-hidden="true"
          onError={(event) => { event.currentTarget.src = '/CdVendingMachine/generic-disc.svg'; }}
        />
        <span className="cd-cover-title">{album.title}</span>
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Implement the interaction controller**

In `CdVendingMachine.js`:

- use `useReducer(transitionMachine, INITIAL_MACHINE_STATE)`;
- derive `selectedAlbum` and `deliveredAlbum` by stable ID;
- detect `prefers-reduced-motion` inside an effect;
- store the completion timeout in a ref and clear it on unmount/reset;
- dispatch `SELECT`, then play `select`;
- dispatch `OBTAIN`, play `obtain`, and schedule `COMPLETE` after 2,800 ms or 80 ms for reduced motion;
- play `deliver` when the state first reaches `delivered`;
- expose a mute toggle with `aria-pressed`;
- disable slot and obtain controls during `dispensing`;
- render a machine shell, glass, two rows of three `AlbumSlot` buttons, control panel, `MachineDisplay`, obtain control, decorative coin slot, tray, delivered disc, mute control, and reset control;
- show `MACHINE EMPTY` and disable obtaining when `albums.length === 0`.

Use this controller skeleton so selection-specific messages and cleanup remain consistent with the Playwright contract:

```jsx
const [state, dispatch] = useReducer(transitionMachine, INITIAL_MACHINE_STATE);
const [muted, setMuted] = useState(false);
const [reducedMotion, setReducedMotion] = useState(false);
const timerRef = useRef(null);
const deliveredRef = useRef(null);
const selectedAlbum = albums.find(({ id }) => id === state.selectedAlbumId) || null;
const deliveredAlbum = albums.find(({ id }) => id === state.deliveredAlbumId) || null;
const displayMessage = albums.length === 0
  ? 'MACHINE EMPTY'
  : state.phase === MACHINE_PHASES.SELECTED && selectedAlbum
    ? selectedAlbum.machineMessage
    : state.message;

useEffect(() => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => setReducedMotion(query.matches);
  update();
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
}, []);

useEffect(() => () => {
  window.clearTimeout(timerRef.current);
  stopMachineAudio();
}, []);

useEffect(() => {
  if (state.phase === MACHINE_PHASES.DELIVERED && deliveredRef.current !== state.deliveredAlbumId) {
    deliveredRef.current = state.deliveredAlbumId;
    playMachineSound('deliver', muted);
  }
}, [state.phase, state.deliveredAlbumId, muted]);

const obtain = () => {
  if (!selectedAlbum || state.phase !== MACHINE_PHASES.SELECTED) return dispatch({ type: 'OBTAIN' });
  dispatch({ type: 'OBTAIN' });
  playMachineSound('obtain', muted);
  timerRef.current = window.setTimeout(() => dispatch({ type: 'COMPLETE' }), reducedMotion ? 80 : 2800);
};

const reset = () => {
  window.clearTimeout(timerRef.current);
  deliveredRef.current = null;
  dispatch({ type: 'RESET' });
  playMachineSound('reset', muted);
};
```

The root must be:

```jsx
<section className="cd-vending-machine" data-phase={state.phase} aria-label="Distributeur de CD SadFlower">
```

- [ ] **Step 5: Build the 2.5D Sass composition**

Implement these class groups in `cd-vending-machine.sass`:

```text
.cd-vending-window
.cd-vending-body
.cd-vending-machine
.cd-machine-cabinet
.cd-machine-glass
.cd-machine-rack
.cd-album-slot
.cd-machine-controls
.cd-machine-display
.cd-obtain-button
.cd-delivery-tray
.cd-delivered-disc
.cd-machine-status
```

Use layered gradients, inset/outset shadows, a pseudo-element glass reflection, dark steel, dirty teal-grey, red LED text, and a 3-column rack. Use `transform` and `opacity` only for the delivery animation. Add `:focus-visible`, an outline plus physical displacement for selected slots, `min-height: 44px` for action controls, a max-width 600 px mobile layout, and `@media (prefers-reduced-motion: reduce)` rules that remove flicker, shake, and long transitions.

Start from these exact layout contracts and extend them only with decorative rules:

```sass
.cd-vending-body
  overflow: auto !important
  background: #171b1d !important

.cd-vending-machine
  --machine-steel: #566164
  display: grid
  grid-template-columns: minmax(0, 1fr) 150px
  gap: 14px
  min-height: 560px
  padding: 22px
  color: #eef2ef
  background: linear-gradient(110deg, #30383a, var(--machine-steel) 45%, #202729)
  border: 8px ridge #899395

.cd-machine-rack
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 12px

.cd-obtain-button, .cd-machine-status button
  min-height: 44px

.cd-delivered-disc
  transform: translateY(0)
  opacity: 1

@media (max-width: 600px)
  .cd-vending-machine
    grid-template-columns: 1fr
    min-height: 0
    padding: 12px

@media (prefers-reduced-motion: reduce)
  .cd-vending-machine *, .cd-vending-machine *::before, .cd-vending-machine *::after
    animation-duration: .01ms !important
    transition-duration: .01ms !important
```

- [ ] **Step 6: Run lint and state tests**

Run:

```text
node --test components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
npm run lint
```

Expected: state tests pass; lint exits 0 with no new feature warnings.

- [ ] **Step 7: Commit the functional machine**

```text
git add components/system32/applications/CdVendingMachine styles/system32/windows/CdVendingMachine
git commit -m "feat: build functional CD vending machine"
```

---

### Task 4: SadFlower window and desktop integration

**Files:**

- Create: `components/system32/windows/CdVendingMachine/cdVendingMachineWindow.js`
- Modify: `pages/index.js`
- Modify: `pages/_app.js`
- Modify: `tests/sadflower.visual.spec.ts`

**Interfaces:**

- Consumes: `CdVendingMachine` from Task 3.
- Produces: `CdVendingMachineWindow({ closeWindow })`.
- Produces: desktop icon accessible name `SadFlowerDiscs.exe` and dialog accessible name `SadFlowerDiscs.exe`.

- [ ] **Step 1: Write the failing Playwright interaction test**

Append:

```ts
test("SadFlowerDiscs opens and completes a dispense cycle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("version", "1.2.0");
    localStorage.setItem("hasVisited", "true");
    localStorage.setItem("sadflower-privacy-v1", '{"analytics":false,"externalMedia":false}');
  });
  await page.goto("/");
  await page.getByAltText("SadFlowerDiscs.exe").click();
  const dialog = page.getByRole("dialog", { name: "SadFlowerDiscs.exe" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /A1 — DEMO DISC 01/ }).click();
  await expect(dialog.getByText("DISC A1 READY")).toBeVisible();
  await dialog.getByRole("button", { name: "OBTENIR" }).click();
  await expect(dialog.getByText("DISPENSING")).toBeVisible();
  await expect(dialog.getByText("TAKE DISC")).toBeVisible();
  await expect(dialog.locator(".cd-delivered-disc")).toBeVisible();
  await dialog.getByRole("button", { name: "RESET" }).click();
  await expect(dialog.getByText("SELECT DISC")).toBeVisible();
});
```

- [ ] **Step 2: Run the new test and verify the missing icon failure**

Run:

```text
npx playwright test tests/sadflower.visual.spec.ts --project=chromium --grep "SadFlowerDiscs opens"
```

Expected: FAIL because `SadFlowerDiscs.exe` does not exist.

- [ ] **Step 3: Implement the window shell**

Create a `react-rnd` window from this structure:

```jsx
import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useZIndex } from '@/components/Tools/ZIndexContext';
import CdVendingMachine from '@/components/system32/applications/CdVendingMachine/CdVendingMachine';

export default function CdVendingMachineWindow({ closeWindow }) {
  const { bringToFront, handleClose } = useZIndex();
  const [zIndex, setZIndex] = useState(1);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const close = () => { handleClose(); closeWindow(); };
  const desktopPosition = typeof window === 'undefined'
    ? { x: 0, y: 0 }
    : { x: Math.max(8, (window.innerWidth - 760) / 2), y: Math.max(8, (window.innerHeight - 680) / 2) };
  return (
    <Rnd
      className="window cd-vending-window"
      role="dialog"
      aria-label="SadFlowerDiscs.exe"
      style={{ zIndex }}
      default={{ ...desktopPosition, width: 760, height: 680 }}
      minWidth={360}
      minHeight={520}
      disableDragging={mobile}
      enableResizing={!mobile}
      size={mobile ? { width: 'calc(100vw - 8px)', height: 'calc(100dvh - 48px)' } : undefined}
      position={mobile ? { x: 4, y: 4 } : undefined}
      onMouseDown={() => setZIndex(bringToFront())}
    >
      <div className="title-bar">
        <div className="title-bar-text">SadFlowerDiscs.exe</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" disabled />
          <button aria-label="Maximize" disabled />
          <button aria-label="Close" onClick={close} />
        </div>
      </div>
      <div className="window-body cd-vending-body"><CdVendingMachine /></div>
      <div className="status-bar"><p className="status-bar-field">CD BUS: READY</p><p className="status-bar-field">LOCAL DEMO</p></div>
    </Rnd>
  );
}
```

Then ensure it:

- calls `useZIndex()` for `bringToFront` and `handleClose`;
- starts at z-index 1 and updates it on pointer interaction;
- uses desktop default `{ width: 760, height: 680 }` centered in the viewport;
- uses `minWidth={360}` and `minHeight={520}`;
- switches to viewport-safe fixed sizing and disables dragging on screens at or below 600 px;
- wraps the window in `role="dialog"` and `aria-label="SadFlowerDiscs.exe"`;
- uses the existing `.window`, `.title-bar`, `.window-body`, and `.status-bar` structure;
- renders only a working Close button; Minimize and Maximize remain disabled and labelled;
- calls both `handleClose()` and the provided `closeWindow()` when closed.

- [ ] **Step 4: Wire the desktop icon and window**

Modify `pages/index.js` to import `CdVendingMachineWindow`, add `isCdVendingMachineOpen`, prioritize `cdVendingMachine` in `activeWindow`, handle the `CdVendingMachine` icon name, add this icon after `MyWork.exe`, and render the window inside the existing `isClient` block:

```jsx
<Icon
  title="SadFlowerDiscs.exe"
  iconPath="/CdVendingMachine/icon.svg"
  onClick={() => handleIconClick("CdVendingMachine")}
/>
```

```jsx
{isCdVendingMachineOpen && (
  <CdVendingMachineWindow closeWindow={() => setIsCdVendingMachineOpen(false)} />
)}
```

- [ ] **Step 5: Import the Sass file**

Add to `pages/_app.js`:

```js
import "/styles/system32/windows/CdVendingMachine/cd-vending-machine.sass";
```

- [ ] **Step 6: Run focused test, state tests, and lint**

Run:

```text
npx playwright test tests/sadflower.visual.spec.ts --project=chromium --grep "SadFlowerDiscs opens"
node --test components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
npm run lint
```

Expected: all focused checks exit 0 and no new lint warnings originate from `CdVendingMachine` files.

- [ ] **Step 7: Commit desktop integration**

```text
git add components/system32/windows/CdVendingMachine pages/index.js pages/_app.js tests/sadflower.visual.spec.ts
git commit -m "feat: integrate CD vending desktop app"
```

---

### Task 5: Mobile, keyboard, cleanup, and final visual verification

**Files:**

- Modify: `tests/sadflower.visual.spec.ts`
- Modify if a failing check requires it: `components/system32/applications/CdVendingMachine/CdVendingMachine.js`
- Modify if a failing check requires it: `components/system32/windows/CdVendingMachine/cdVendingMachineWindow.js`
- Modify if a failing check requires it: `styles/system32/windows/CdVendingMachine/cd-vending-machine.sass`

**Interfaces:**

- Consumes the complete desktop application from Tasks 1–4.
- Produces verified desktop and mobile behavior without changing public component names.

- [ ] **Step 1: Add the mobile accessibility test**

```ts
test("SadFlowerDiscs remains usable on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile-only vending check.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("version", "1.2.0");
    localStorage.setItem("hasVisited", "true");
    localStorage.setItem("sadflower-privacy-v1", '{"analytics":false,"externalMedia":false}');
  });
  await page.goto("/");
  await page.getByAltText("SadFlowerDiscs.exe").click();
  const dialog = page.getByRole("dialog", { name: "SadFlowerDiscs.exe" });
  const box = await dialog.boundingBox();
  if (!box) throw new Error("SadFlowerDiscs dialog has no mobile bounds.");
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Mobile viewport is unavailable.");
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  await dialog.getByRole("button", { name: /A2 — DEMO DISC 02/ }).focus();
  await page.keyboard.press("Enter");
  await expect(dialog.getByText("DISC A2 READY")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "OBTENIR" })).toBeEnabled();
});
```

- [ ] **Step 2: Run the mobile check**

Run:

```text
npx playwright test tests/sadflower.visual.spec.ts --project=mobile-chrome --grep "SadFlowerDiscs remains"
```

Expected: PASS. If it fails, adjust only the viewport-safe dimensions, overflow, or target sizing covered by the assertion, then rerun until it passes.

- [ ] **Step 3: Run complete verification**

Run:

```text
node --test components/system32/applications/CdVendingMachine/vendingMachineState.test.cjs
npm run lint
npm run build
npm run test:visual
```

Expected:

- state tests: all pass;
- lint: exits 0, historical warnings allowed, no new vending warnings;
- build: exits 0;
- Playwright: existing suite plus both vending tests pass on configured projects, unless a documented environment prerequisite blocks the development server or browser.

- [ ] **Step 4: Inspect rendered desktop and mobile states**

Capture temporary local screenshots for idle, selected, dispensing/delivered, and mobile states. Verify icon recognition, machine readability, no overflow, selected-state outline, tray visibility, and Windows 95 chrome. Do not commit screenshots.

- [ ] **Step 5: Confirm repository scope**

Run:

```text
git status --short
git diff --check origin/master...HEAD
git log --oneline origin/master..HEAD
```

Expected: only the design, plan, front feature files, assets, styles, and tests are present. The matching back worktree remains clean.

- [ ] **Step 6: Commit any final verification fixes**

If Step 2–4 required tracked fixes:

```text
git add components/system32/applications/CdVendingMachine components/system32/windows/CdVendingMachine styles/system32/windows/CdVendingMachine tests/sadflower.visual.spec.ts
git commit -m "fix: polish CD vending responsive behavior"
```

If no tracked fixes were required, do not create an empty commit.
