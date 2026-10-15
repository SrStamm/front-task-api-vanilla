# UI: modal actions kebab, card hover, sidebar selectors

## Objective
Fix three UI issues approved by the user: (a) soften the dark hover on cards,
(b) remove the redundant ▼ chevron from sidebar selectors when a selection
exists, (c) replace the centered Edit/Delete footer buttons in modals with a
kebab (⋮) menu in the header.

## Why
User feedback: card hover looks too dark; sidebar buttons repeat the chevron
even with a name; modal footer buttons look bad and destructive actions sit
too close to the main flow.

## Scope
- IN: `Card.css` hover, `GroupSelector`/`ProjectSelector` labels, kebab menu
  in `GroupModal` + `ProjectModal`.
- OUT: kanban drag optimistic update (data-layer change, separate branch).

## Constraints
- Plain CSS (no Tailwind). React 18. Icons via `react-icons`.
- Verification: `pnpm lint` and `pnpm build` (no test runner configured).
- Conventional commits, one work unit per task.

## Tasks
- [x] T1: Soften `.card:hover` in `Card.css` (shadow, lift, scoped transition)
- [x] T2: Selectors show raw name when selected, `Placeholder ▼` only when empty
- [x] T3: Kebab (⋮) menu replaces Edit/Delete footer in GroupModal + ProjectModal
- [x] T4: `pnpm lint` + `pnpm build` pass
- [x] T5: Fix pre-existing modal stacking bug in GroupsPage (update modal painted behind detail modal)

## Progress
- T1 done: Card.css hover shadow 24/48 0.25 → 12/24 0.12, lift -4px, transition scoped.
- T2 done: `▼` moved into Sidebar placeholder ("Grupo ▼"/"Proyecto ▼"); selectors render `text` as-is.
- T3 done: new `KebabMenu` common component; GroupModal + ProjectModal headers now title + kebab (admin only); footer actions removed; `Modal` `modalActions` optional. Writer verified: build PASS; eslint clean on touched files (27 lint problems pre-existing, proven identical via stash).
- T5 done (user-reported): all `.modal-backdrop` share z-index 1000, DOM order decides stacking. In GroupsPage `GroupCreateUpdateModal` rendered BEFORE `GroupViewModal`, so Editar opened the update modal behind the detail modal (double backdrop → near-black screen). Fixed by moving `GroupCreateUpdateModal` after the detail-modal block, still outside the `selectedGroup` conditional so "+" create works with no selection. Mirrors the working order in ProjectsPage.

## Next step
Work-unit commits (T1, T2, T3, T5) + RDD assessments.
