# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page quality-assurance (자동차 품질보증) dashboard: Notion-like databases ("데이터베이스") plus dashboard pages built from widgets. No framework, no build step, no package.json. All UI text and code comments are Korean.

- `index.html` — markup shell **and all CSS** (design tokens on `:root`, dark-mode blocks, every component's styles appended near `.tagpop .pill` rules).
- `app.js` — the whole app (~4.7k lines) in one IIFE, vanilla JS.
- `pages.config.js` — `window.DASHBOARD_CONFIG = {...}`: seed/fallback config used when the data files cannot be read. `samples/pages.config.sample.js` is an older full-sample backup.
- `data/app.json` + `data/registers/<datasetId>.json` — the real data store (see Persistence).
- `files/<datasetId>/…` — copied attachment files referenced by records.
- `.vscode/settings.json` — Live Server `ignoreFiles` for `data/`, `files/`, `*.json`.

## Running and checking

- Open `index.html` directly (file://) or via VS Code Live Server. Writing to `data/` / `files/` uses the File System Access API → Chrome/Edge only; the user connects the dashboard folder once (sidebar "데이터 폴더 연결").
- Syntax check after edits: `node --check app.js`
- There is no test suite. Verification has been done with headless Chrome and an injected script that drives the UI and prints results into the DOM, e.g.:
  ```
  sed 's#</body>#<script src="test.js"></script></body>#' index.html > test.html
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --user-data-dir=<tmp> --virtual-time-budget=8000 --dump-dom "file:///<abs path>/test.html"
  ```
  Under file:// every script is a separate origin, so app errors surface only as "Script error." — serve over http (`python -m http.server`) to see real stacks. Fake `window.showDirectoryPicker` with an in-memory handle to test file writes. Run such experiments on a copy of the folder, not the real `data/`.

## Data model (`cfg`)

`cfg = { appName, owner, pages[], datasets[], navOrder[], migr{}, fileRefs{}, changelog[], trash[] }`

- **Dataset** (register/database): `{ id, name, desc, master?, dateField, titleField, asOfField, fields[], records[], colors?, colW?, views?, tpls?, repeat? }`. `views` = saved list views `{id,name,f(filters),q,sortK,asc,group,hide}`; `tpls` = record templates `{id,name,vals}`; `repeat = {field}` = recurring schedule (a DONE record whose cycle field says 매주/매월/분기/반기/매년/N개월 spawns the next one in `persist()` → `spawnRepeats()`, marking the source `r._rep`). `master: true` = "골라 쓰는 목록" (a pick-list other databases reference); it no longer affects sidebar grouping.
- **Field types**: `text` (`auto: "CL-{YY}-"` auto-numbering), `longtext`, `number`, `date` (`closes: true` = completion date), `select` (`options`, `colors`, `badge: true` = status field), `ref` (`ref: <datasetId>`, relation; multi-value unless `single: true`), `days` (`from`/`to`, either may be `@today`), `file` (array of `{name,path,type,size,at}`), `formula` (`expr` with `{항목 이름}` refs, evaluated by `evalFormula`; renames rewrite exprs via `renameInExpr`), `rollup` (`rel: "<dsId>:<refKey>"`, `agg`, `field`, `where`; cached per `fver` in `rollupOf`). `formula`/`rollup`/`days` are never stored — `recView()` computes them (`calcFields`), and `isNumF` treats them as numbers.
- Record extras: `r._c` = comments `[{at,who,t}]` (also logged to changelog as `kind:"comment"`), `r._rep` = recurring already spawned.
- `dsFields(ds)` (cached via `fver`) presents `ref` fields as `select` with `refType: true` and options = `masterValues(ref)`.
- **Relation values** are `""`, a string, or a string array. Always go through the helpers `vals`, `normVals`, `hasVal`, `swapVal`, and for grouping `gvals` / `gin` (a multi-valued record counts under each value). `valText` flattens values for search/export.
- `DONE = ["완료","승인","종료"]` drives completion logic; `asOf` (기준일) hides later records (`visibleRecs`) and reverts completion (`recView`).
- `migr` flags (`upg1`, `attachReset1`, `fileStore1`) gate one-time migrations in `upgrade()` / `resetAttachOnce()` / store sync — don't remove them.

## Persistence flow

`load()` (localStorage cache `qa-dashboard-config-v3`, else `pages.config.js`) → `render()` → `bootStore()` reads `data/` (fetch over http, or the stored folder handle) and `adopt()`s it.

Every mutation calls `persist()`, which:
1. logs record diffs to `cfg.changelog`;
2. recounts `cfg.fileRefs` (attachments whose count drops to 0 are deleted after a delay; widget images `w.img` under `files/` count too);
3. writes the localStorage cache;
4. calls `scheduleStore()` → `flushStore()` → `writeAll()`. `writeAll()` writes only files whose text changed (`store.written`). It refuses with `ExternalChange` if `app.json` changed on disk, and reloads instead of overwriting.

Writes are deferred while any picker popup is open (`pickerOpen()`). Once a day, before the first write, `autoBackup()` copies `data/` to `backup/YYYY-MM-DD/` (keeps 14; restore from 설정 · 데이터 저장). Inline relation picking saves only when the picker closes (`tp.after`).

**Live Server:** the top of `app.js` wraps `WebSocket` and `createWritable`/`removeEntry` so Live Server "reload" messages within 5 s of the app's own file writes are ignored. Keep this when touching file I/O, and call `markWrite()` for new write paths.

## UI architecture

- **Routing**: hash = page id, `data-<datasetId>` (database list view, `renderDataView`), or `db` (all-databases overview, `renderDbHome`).
- **Popups**: one `#drawer` reused as a modal; `ed.mode` ∈ `record | schema (new DB) | fields (live field editor) | widget | create (새로 만들기) | export (settings) | import (엑셀 붙여넣기·가져오기) | drill (위젯 드릴다운 기록 목록) | report (월간 보고서) | trash (휴지통)`; `renderDrawer()` switches on it. Deletions of records/pages/databases go to `cfg.trash` (30 days, `trashPut`/`restoreTrash`; attachments of trashed items still count in `fileRefCounts`). Record popups support relation navigation history (`ed.hist`) and backlinks.
- **Other overlays**: `#gsearch` (Ctrl+K 전체 검색), `#minipop` (list view 열·묶기·보기 이름, page 내보내기 menu), `#tplmenu`.
- **List view state**: filters `dvfAll` + `dv` (q/sort) + `dvSt(id)` (`view`, `group`, `hide`, `fold`; localStorage `qa-dashboard-dvview`).
- **Drill-down**: chart marks carry `data-drill` JSON (`chartDrill`/`drillA`); clicks open `ed.mode = "drill"` filtered on top of the widget's `src`.
- **Compare mode**: `cmpAt` (sidebar 비교일) → `compareKpis()` re-resolves KPI widgets with `asOf = cmpAt`; shown as a top card + per-KPI line.
- **Layout edit mode**: `lay` state + floating draggable "remote" (`#layBar`, `renderLayBar`/`renderPalette`, categories `WCATS`).
- **Shared popovers**:
  - `#tagpop`: Notion-style option picker, driven by provider objects from `fieldProv` / `groupProv` and selected via `provFor(el)`.
  - `#proppop`: field/property menu.
  - `#dvfpop`: per-field list filters (stored in localStorage).
  - `#ssel`: searchable replacement for `<select>` with ≥8 options.
- **Widgets**:
  - Core renderers live in `W` (kpi, line, bar, hbar, table, tasks, progress, note).
  - Everything newer is registered with `regW(type, { name, desc, def, common, linkable, rows, src, form, resolve | resolveAny, editor, render, exports, table })`, which wires it into `TYPES`, `DEFAULTS`, `COMMON`, `LINKABLE`, `ROWS`, `W`, `EXPORTS` and `widgetRows`.
  - Linked widgets carry `w.src = { ds, agg, field, field2, scale, period, filter[], … }`; `resolveWidget()` computes data, `srcForm()` builds the settings form (grouped by `SRC_GROUPS`), `defaultSrc()` picks defaults.
  - SVG charts use `xChart(w, drawFn)` so they redraw on resize and export to PNG/SVG.
  - New widget types also need a `WIMG[type]` illustration and a `WCATS` category.
- **새로 만들기 templates**:
  - `KINDS` (blank, dataset, tasks, data) + `TPL` entries `{ lv (1 간단 · 2 보통 · 3 고급), sec: "page" | "db", name, tag, desc, pick, needDs, build(ds) | db() }`, sorted by `lv`.
  - Page-layout illustrations come from `KLAYOUT`.
  - DB templates create the dataset, then a status page.

## Conventions

- User-facing wording: say "데이터" / "데이터베이스", never "대장" or "데이터 대장"; the user asked for this to be unified.
- Korean IME safety: when filtering on input, re-render only the result list, never the `<input>` itself, and ignore Enter while `e.isComposing || e.keyCode === 229`.
- Colors only via CSS tokens (`--accent`, `--s1…s4`, `--good/--warn/--crit`, `--t-<color>` / `--t-<color>-i` for tags) so light/dark themes both work.
- `app.js` and `index.html` are large; make targeted edits (exact-string replacements) and re-run `node --check app.js`.
