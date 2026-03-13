## AGENTS Handoff: CSS Parity Recovery

This document is the execution handoff for any incoming AI agent to continue parity restoration in /Users/shakeelmohamed/work/git/shakeelmohamed.github.io.

### Mission
Restore visual parity with existing Playwright baselines. Do not update baselines to hide regressions.

### Canonical References
1. Primary truth: checked-in Playwright baselines in the current repository.
2. Differential anchor commit: 7fa31688cef7.
3. Approved artifact source: /Users/shakeelmohamed/work/git/sm_backup.
4. Live site is secondary reference only when baselines are ambiguous.

### Key User Constraints
1. Pixel-identical parity target.
2. Baselines remain authoritative.
3. Post-migration was never totally perfect, so prioritize fastest high-impact recovery.
4. Prefer minimal script changes and avoid unnecessary workflow additions.
5. Do not revert unrelated user changes.

### Verified Artifact Inventory
1. /Users/shakeelmohamed/work/git/sm_backup/src/styles.css exists.
2. /Users/shakeelmohamed/work/git/sm_backup/docs/dist/tailwind.css exists.
3. /Users/shakeelmohamed/work/git/sm_backup/tests/visual/visual.pages.spec.js-snapshots exists.
4. /Users/shakeelmohamed/work/git/sm_backup/tests/visual/visual.posts.spec.js-snapshots exists.
5. /Users/shakeelmohamed/work/git/sm_backup/tests/visual/visual.projects.spec.js-snapshots exists.

### Current Problem State
1. Representative home snapshot is vertically inflated versus baseline.
2. Representative post snapshot is vertically inflated versus baseline.
3. Prior attempt to emulate full prose behavior in local post-content worsened diffs and was reverted.
4. Shared semantic listing classes and shared shell spacing are the most likely remaining high-impact regressions.

### High-Probability Regression Surfaces
1. Home and listing block classes in src/styles.css and src/_includes/blocks.pug.
2. Post wrapper spacing in src/styles.css and src/_includes/layouts/post.pug.
3. Shared header and footer spacing in src/styles.css and src/_includes/layouts/base.pug.

### Execution Strategy
1. Compare current output against anchor artifacts before new edits.
2. Isolate drift across three layers.
3. Layer A: CSS rule drift between current compiled CSS and backup compiled CSS.
4. Layer B: Generated HTML drift on home and one representative post.
5. Layer C: Computed layout drift on the same pages.
6. Apply smallest shared fixes first, not page-specific patches.
7. If drift is broad and semantic mapping is unstable, perform narrow rollback on affected surfaces only.

### Representative Pages for Fast Iteration
1. Home page snapshot key: home--42099b4a.
2. Post snapshot key: posts__2013-09-20-summer-with-splunk.

### Suggested File Focus Order
1. /Users/shakeelmohamed/work/git/shakeelmohamed.github.io/src/styles.css
2. /Users/shakeelmohamed/work/git/shakeelmohamed.github.io/src/_includes/blocks.pug
3. /Users/shakeelmohamed/work/git/shakeelmohamed.github.io/src/index.pug
4. /Users/shakeelmohamed/work/git/shakeelmohamed.github.io/src/_includes/layouts/post.pug
5. /Users/shakeelmohamed/work/git/shakeelmohamed.github.io/src/_includes/layouts/base.pug

### Verification Gates
1. Gate 1: Focused visual tests for representative home and post pages must match baselines.
2. Gate 2: Broader visual suite should pass except known unstable pages.
3. Gate 3: No syntax or build errors.
4. Gate 4: No baseline updates.

### Known Unstable Pages
1. Mark Rothko pages.
2. Midjourney pages.

### Decision Rule: Patch vs Rollback
1. Choose patch when 3 to 10 selectors explain most vertical growth across both representative pages.
2. Choose narrow rollback when regressions span multiple unrelated semantic blocks and cannot be stabilized in one pass.
3. Never perform broad rollback across the repository without explicit user approval.

### Out of Scope During Recovery
1. Architecture cleanup.
2. CSS modernization not required for parity.
3. Refactoring for style preferences.

### Completion Criteria
1. Representative home and post visual checks are green.
2. Full visual pass is green except known unstable pages.
3. User confirms parity is restored.

### First Commands for Incoming Agent
1. Verify diff scope from 7fa31688cef7 to HEAD for css, pug, and tests/visual files.
2. Compare current compiled CSS against /Users/shakeelmohamed/work/git/sm_backup/docs/dist/tailwind.css.
3. Compare generated home and representative post HTML against corresponding backup docs output.
4. Apply minimal shared selector fixes.
5. Re-run representative visual tests.
6. Expand to full visual suite.
