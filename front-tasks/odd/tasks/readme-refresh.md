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
- [x] T1: Playwright screenshots → `docs/screenshots/` — all 4 captured
      (1440×900, deployed app): login, dashboard (Grupos), tasks-kanban
      (task `testear` in progress), chat (5 messages). Creds turned out to
      be `test`/`test` (old `123456` was stale).
- [x] T2: `git mv README.md README_OLD.md` + write `README.md` (English)
- [x] T3: write `README.es.md` (Spanish neutral)
- [x] T4: verify + work-unit commits — `pnpm build` PASS; `pnpm lint` 27
      pre-existing base problems (docs add none); all 11 sections present
      in both READMEs; demo creds corrected to `test`/`test` in both;
      `[MIT](LICENSE)` links removed (no LICENSE file exists).
- [ ] T5 (iteration 2, user feedback): rework Mermaid diagram (REST solid
      vs WS dashed flows, TanStack Query + useChatSocket responsibilities
      legible, keep key-pieces table); add "Technical decisions" section
      (3 bullets: TanStack Query, feature folders, WS hook); backend
      prerequisite paragraph + link to backend README in Installation;
      honesty fix: frontend has NO notification UI (only `group_message`
      chat events are handled; task-assignment events not surfaced) —
      fix the "Instant notifications" claim in both READMEs + add to
      Known limitations; clarify VITE_URL_WS is a full URL incl. path.
- [ ] T6: GIF demo — pending user decision on scenario (no notification
      UI exists; honest option = live chat exchange via local front,
      two users test/test1).

## Progress
- Branch `docs/readme-refresh` from `master`.
- Commit 1 `b4cc616`: bilingual READMEs + README_OLD preservation + this doc.
- Commit 2 `bc36412`: screenshots + demo-credential correction.
- PR #61 MERGED into master as `bec20f2` (user opened it).
- Iteration 2 branch `docs/readme-iteration2` from master: T5 done
  (honesty fix: notifications bullet deleted EN/ES, diagram WS node
  "chat messages", limitation #4 added; diagram reworked — REST solid
  edge 8, WS dashed linkStyle 12, TanStack/useChatSocket responsibility
  labels, ChatPage→useChat path; Technical decisions section 4 bullets;
  backend README link in Installation; VITE_URL_WS full-URL note;
  extra honesty fix: key-pieces Realtime row "chat is the only
  subscriber today"). Both READMEs 197 lines, 12 mirrored sections.
- T6 done: `docs/screenshots/chat-demo.gif` — 960×600, 8.6s, 10fps,
  0.90 MB; WS live evidence: wire-to-pixel 0.19s (dry-run measured),
  Enviar-enabled gate passed; two users test/test1 on local vite :5199
  against remote API. GIF row added to Screenshots tables both files.
- Verified: `pnpm build` PASS; `pnpm lint` = 27 pre-existing base
  problems (unchanged); greps clean (no "instant notification" claims);
  GIF file valid GIF89a. User's TaskModal WIP never staged.

## Next step
Work-unit commit on `docs/readme-iteration2`, then user decides
push/PR. Demo data enrichment + screenshot refresh deferred by user.
