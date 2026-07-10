# MyWork.exe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Windows XP desktop icon that opens a dense 90s/2000s faux-browser portfolio and a quick quote/booking form.

**Architecture:** Extend the existing desktop orchestration in `pages/index.js` with one icon, one window component, and one local state flow. Keep service data and form state inside the MyWork window; submit through a small Next API proxy to Strapi so browser code never needs a token or CORS configuration.

**Tech Stack:** Next.js 14, React 18, `98.css`, `react-rnd`, Sass, Playwright visual tests.

## Global Constraints

- Preserve existing XP/98.css visual language and responsive window behavior.
- Use existing Windows95 icon asset `Programs/Web-document program.ico`.
- Canonical service codes: `developer.fullstack-web`, `developer.application`, `developer.game`, `developer.frontend-audit`, `musician.author-composer-performer`, `musician.soundtrack`, `musician.mix-mastering`, `musician.music-audit`.
- POST payload uses `kind`, `serviceCode`, `name`, `email`, optional `phone`, `preferredDate`, `message`, `consent: true`, optional honeypot `website`.
- Add UUID `Idempotency-Key`; expose only success reference/state/timestamp.
- Gracefully show API unavailable state until Strapi branch is merged and `MYWORK_SERVICE_CATALOG` is configured.

---

### Task 1: Add typed service catalog and pure form helpers

**Files:**
- Create: `components/system32/windows/MyWork/myWorkData.js`
- Create: `components/system32/windows/MyWork/myWorkData.test.js`

- [ ] Define the eight service cards with category, label, description, examples, `serviceCode`, and allowed `kind` values.
- [ ] Export `buildRequestPayload(form, service)` and `isFormValid(form)`; normalize trimmed values and always set `consent: true` only after checkbox acceptance.
- [ ] Run `node --test components/system32/windows/MyWork/myWorkData.test.js` and keep it green.

### Task 2: Add Next API proxy

**Files:**
- Create: `pages/api/my-work/requests.js`
- Modify: `.env.example`

- [ ] Read Strapi base from `STRAPI_API_URL` or `NEXT_PUBLIC_STRAPI_API_URL`; reject missing configuration with HTTP 503.
- [ ] Forward JSON body and UUID `Idempotency-Key`, then relay Strapi status/body without exposing server-only headers.
- [ ] Enforce POST-only and preserve concise error shape for 422/409/429/500.

### Task 3: Build MyWork.exe window

**Files:**
- Create: `components/system32/windows/MyWork/mywork.js`
- Create: `styles/system32/windows/MyWork/mywork.sass`

- [ ] Reuse `react-rnd`, `useZIndex`, 98.css title/status bars, and mobile full-screen behavior from Articles/WhoAmI.
- [ ] Render browser chrome, address bar, tabs, category switcher, dense service cards, portfolio examples, and inline quote/booking section.
- [ ] Keep service selection and active tab local; form submits through `/api/my-work/requests` with generated idempotency UUID and loading/success/error states.
- [ ] Disable submit until required fields and consent are valid; show API unavailable state without crashing.

### Task 4: Wire desktop icon and tests

**Files:**
- Modify: `pages/index.js`
- Modify: `tests/sadflower.visual.spec.ts`

- [ ] Add `isMyWorkOpen`, `MyWork` click case, icon, and conditional window render following existing icons.
- [ ] Add visual smoke coverage for icon visibility, opening `MyWork.exe`, selecting a service, and seeing the quote form.
- [ ] Run `npm run lint`, `npm run build`, and `npm run test:visual` when the test server is available.

### Task 5: Review and commit

- [ ] Run `git diff --check` and inspect responsive styles and Next Image paths.
- [ ] Commit implementation as `feat: add MyWork portfolio desktop app`.
