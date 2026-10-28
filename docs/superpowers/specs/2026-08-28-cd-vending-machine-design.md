# SadFlower CD Vending Machine — First Functional Slice

## Goal

Add a new SadFlower desktop application that opens a functional CD vending-machine window. This first slice proves the desktop integration and the complete selection-to-dispense interaction while keeping catalogue persistence, playback, downloads, accounts, and commerce out of scope.

The experience must feel native to SadFlower OS: Windows 95 window chrome around a worn physical machine, restrained glitches, mechanical feedback, and no generic modern storefront UI.

## Repository and Branch Isolation

Both repositories use the same branch name:

- front: `feat/cd-vending-machine` based on `origin/master`;
- back: `feat/cd-vending-machine` based on `origin/main`.

Implementation runs in isolated worktrees under the shared `_SADFLOWER_SITE/.worktrees` directory. The existing front checkout remains on `fix/whoami`, including its uncommitted `WhoAmI` change. The back branch remains intentionally unchanged in this first slice.

## First-Slice Scope

### Included

- A new desktop icon with an original SadFlower vending-machine icon asset.
- A single open/close state wired into `pages/index.js`.
- A draggable and resizable `react-rnd` window using the existing Windows 95 frame, z-index context, title bar, close control, and status bar conventions.
- A responsive front-facing 2.5D vending machine.
- Six local demo CD slots defined in a focused data module.
- Album selection by clicking a cover.
- A machine display that shows idle, selected, dispensing, delivered, and error messages.
- An `OBTENIR` control that runs one deterministic dispense sequence.
- A visible CD drop into the delivery tray, followed by a reset control.
- Mechanical feedback using small, locally hosted, licence-compatible assets where available; the experience remains understandable while muted.
- Mobile layout and `prefers-reduced-motion` behavior.
- Focused tests for the state transition logic.

### Excluded

- Strapi catalogue content types and API calls.
- S3 audio or image storage.
- CD player window, streaming, and downloads.
- User collections, authentication gates, profile persistence, and `localStorage` migration.
- Payment or external commerce.
- Runtime Three.js, PixiJS, WebGL, or a `.blend` file delivered to browsers.
- Complex random jams or multi-step easter eggs.

## Visual Asset Strategy

The downloaded `Vending machine.blend` file is a CC0 Blender 2.90 source asset. Its object names confirm separate machine, door, delivery, button/coin, camera, lights, and array-driven candy objects. It is suitable as the source for a SadFlower conversion.

The browser must not load that Blender file. A current Blender installation will be used on a preserved copy to:

1. remove the snack products;
2. create a reusable jewel-case shape;
3. adapt rows, labels, display, and delivery tray;
4. apply SadFlower-specific worn metal, grime, light, and sticker treatments;
5. render optimized transparent layers for the browser.

Expected web layers are the machine shell, dark interior, shelves/spirals, glass reflection, lighting overlays, tray states, and generic CD case. Album covers remain independent HTML image elements so later Strapi data can replace the local demo data without regenerating the machine art.

If final Blender renders are not yet available during implementation, the component uses a deliberately labelled temporary CSS/asset composition with the same dimensions and layer contract. It must not present the unrelated 256×256 FreeGameSprites preview as final SadFlower art.

## Front-End Structure

Create a focused application directory:

```text
components/system32/applications/CdVendingMachine/
  CdVendingMachine.js
  MachineDisplay.js
  AlbumSlot.js
  vendingMachineData.js
  vendingMachineState.js
  vendingMachineState.test.cjs
```

Create the window wrapper and feature styles:

```text
components/system32/windows/CdVendingMachine/
  cdVendingMachineWindow.js

styles/system32/windows/CdVendingMachine/
  cd-vending-machine.sass
```

Place original or licence-compatible web assets under:

```text
public/CdVendingMachine/
```

The window wrapper owns `react-rnd`, responsive dimensions, z-index, title bar, close action, and status bar. The application component owns interaction state. Data, transition rules, and presentational subcomponents remain separate so the later Strapi integration does not require rewriting the visual machine.

## Desktop Integration

`pages/index.js` adds:

- `isCdVendingMachineOpen` state;
- a `CdVendingMachine` case in `handleIconClick`;
- a `SadFlowerDiscs.exe` desktop icon;
- conditional rendering of the new window;
- `cdVendingMachine` participation in the current active-window value.

`pages/_app.js` imports the feature Sass file. The existing icon, window, desktop, z-index, and `98.css` systems are reused.

This slice does not redesign the global taskbar. The open window follows the existing app behavior rather than adding a new task button system that the rest of SadFlower does not yet implement.

## Interaction Model

The machine uses this explicit state model:

```text
idle
  select album -> selected

selected
  select another album -> selected
  press OBTENIR -> dispensing

dispensing
  sequence completes -> delivered

delivered
  press RESET -> idle

any interactive state
  recoverable runtime failure -> error

error
  press RESET -> idle
```

While dispensing, album slots and the obtain button are disabled. Timers are stored and cleared on unmount so closing the window cannot update an unmounted component. The sequence lasts approximately 3 seconds in normal motion mode and completes immediately or nearly immediately under reduced motion.

The delivered CD remains visible in the tray until reset. No player, download, or external link opens in this slice.

## Demo Data Contract

Each local demo album exposes only fields the future public catalogue can provide:

```js
{
  id,
  slotCode,
  title,
  artist,
  cover,
  accentColor,
  machineMessage
}
```

The UI must not depend on array position for identity. Slot codes are unique and stable. Missing covers render a local generic CD fallback.

## Audio and Motion

Audio begins only after a visitor interaction. Effects are short and local. A mute control is visible inside the application, and failure to play audio never blocks the visual sequence.

Animation uses CSS transforms and opacity. No continuous rendering loop is introduced. When the application closes, all timers and audio are stopped. `prefers-reduced-motion: reduce` removes shake, flicker, and long travel while preserving state changes.

## Responsive and Accessibility Requirements

- Desktop default: approximately 760×680, centered, resizable, and draggable.
- Minimum desktop size: large enough to keep the controls and tray usable.
- Mobile: fixed viewport-safe window behavior matching existing SadFlower conventions, single-column controls, and touch targets of at least 44×44 CSS pixels.
- Album slots are real buttons with accessible names containing slot code, title, and artist.
- The machine display uses an appropriate live region for selection and delivery status.
- Color is never the only selected-state indicator.
- All controls work with keyboard focus and activation.
- Decorative layers use empty alternative text or CSS backgrounds.

## Error Handling

The local data path should normally be deterministic. Defensive behavior covers:

- missing or empty demo data: display `MACHINE EMPTY` and disable obtaining;
- broken cover asset: render the generic CD fallback;
- attempted obtain without selection: remain idle/selected-safe and display `SELECT DISC`;
- audio playback rejection: continue silently;
- timer or unexpected runtime failure: enter `error`, display `SERVICE`, and allow reset.

Fake glitches must not look identical to actual errors. This first slice uses visual flicker as atmosphere but does not simulate a blocking jam.

## Testing and Verification

### Focused automated tests

- Selecting an album enters `selected` and stores its stable ID.
- Selecting another album replaces the prior selection.
- Obtaining without a selection is rejected safely.
- Obtaining a selected album enters `dispensing`.
- Completing the sequence enters `delivered` for the same album.
- Reset clears the selection and returns to `idle`.
- Invalid events do not create impossible states.

### Repository verification

Run from the front worktree:

```text
npm run lint
npm run build
npm run test:visual
```

The visual smoke test is required when its development-server and Playwright prerequisites are available. Manually verify opening, closing, dragging, resizing, keyboard selection, muted operation, reduced motion, mobile layout, dispense lockout, delivery, and reset.

The back worktree receives no code in this slice. Its branch exists to preserve the agreed cross-repository naming. A back build is required only when the later Strapi phase begins; the current baseline installation has been observed hanging before the `strapi` executable becomes available and must not be misreported as a feature regression.

## Later Phases

The component boundaries intentionally support, but do not implement:

1. Strapi `album` content type and repeatable `track` component;
2. public S3-backed covers, full tracks, and download files;
3. a separate SadFlower CD Player window;
4. public and authenticated-exclusive content;
5. automatic user collection persistence;
6. external sales or payment flows;
7. richer deterministic easter eggs.

These phases require their own approved design updates before implementation.
