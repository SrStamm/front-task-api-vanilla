# README refresh: bilingual (EN/ES) + screenshots

## Objective
Replace the stale Spanish-only README with a professional, job-hunting-ready
bilingual README set: `README.md` (English, primary) and `README.es.md`
(Spanish), covering all sections the user requested; preserve the current one
as `README_OLD.md`; capture real app screenshots.

## Why
User wants the project presentable when companies review it during job
searches. Current README (written for an older vanilla-JS version) is stale:
mentions `js/config.js`, npm-only flow, no env-var docs, no architecture
diagram, no tests section.

## Scope
- IN: repo-root `README.md` (EN), `README.es.md` (ES), `README_OLD.md`
  (rename of current `README.md`), `docs/screenshots/*.png`.
- OUT: any app source change, PR creation, push, changes inside
  `front-tasks/` source, reading `.env` (denied; only var names from source).

## Constraints
- Artifacts: `README.md` in English, `README.es.md` in neutral Spanish;
  cross-link each other at the top. Old content preserved verbatim in
  `README_OLD.md` (git mv).
- Env vars documented from source usage only: `VITE_URL` (REST API base URL),
  `VITE_URL_WS` (WebSocket base URL). Never read or expose `.env` values.
- Demo: https://front-task-api-vanilla.vercel.app/dashboard/tasks —
  credentials `test` / `123456` work on deployed AND local (user confirmed).
- Verification commands: `pnpm lint`, `pnpm build` (no test runner configured;
  README must state this honestly in its Tests section).
- Architecture diagram: Mermaid, derived from the real `src/` structure.
- Screenshot paths (prescribed, Playwright captures in parallel):
  `docs/screenshots/login.png`, `dashboard.png`, `tasks-kanban.png`,
  `chat.png` (relative links from repo root).
- Conventional commits, one work unit per task. Do NOT stage untracked
  `.atl/`, `.codegraph/`, `front-tasks/pnpm-lock.yaml`,
  `front-tasks/pnpm-workspace.yaml`.
- Delivery strategy: `ask-on-risk` (default); forecast ≈ 350–400 authored
  lines (two READMEs). No PR requested yet — delivery is the user's decision.

## Tasks
- [ ] T1: Playwright screenshots → `docs/screenshots/` (login, dashboard,
      tasks-kanban, chat) — PARTIAL: `login.png` captured from deployed;
      other 3 blocked: `test`/`123456` now rejected by API
      (`mirko-project.pp.ua` → HTTP 400 "Password incorrect"; user exists,
      wrong password). Awaiting current credentials from user.
- [x] T2: `git mv README.md README_OLD.md` + write `README.md` (English)
- [x] T3: write `README.es.md` (Spanish neutral)
- [ ] T4: verify + work-unit commits — PARTIAL: `pnpm build` PASS;
      `pnpm lint` reports 27 pre-existing problems (same count recorded as
      base in prior feature doc — docs introduce none); all 11 sections
      present in both READMEs; `[MIT](LICENSE)` links removed (no LICENSE
      file exists). README commit done; screenshot commit pending T1.

## Progress
- Branch created: `docs/readme-refresh` (from `master`).
- T2/T3 done and structurally read back: 184 lines each, 11 sections,
  Mermaid diagram grounded in real src/, env vars documented as names only
  (`VITE_URL`, `VITE_URL_WS`), no stale `js/config.js` references.
- T1 partial: 1/4 screenshots; background dev server started by the capture
  agent on :5174 was killed; user's own :5173 instance untouched.
- Demo credentials `test`/`123456` documented in both READMEs — REJECTED by
  backend now; both READMEs may need update once user clarifies (keep or
  rotate demo creds).

## Next step
Await current password for `test` → re-run Playwright capture for the 3
missing screenshots → commit `docs/screenshots/` → close T1/T4.
