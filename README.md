# ABB benchmark website scaffold

Independent React + Vite + Tailwind CSS frontend. The existing ABB execution system and local results viewer are separate projects. Public wording, metric definitions, records and API integration can be supplied later. This scaffold contains no fabricated rankings or imported evaluation evidence.

## Run

Use Node.js 22.12+ and npm:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Production build: `npm run build`. Inspect the build locally: `npm run preview`. Serve the generated `dist/` folder with a static host. Hash routes work without server rewrite rules.

## Structure

```text
src/
  app/          App composition and hash route subscription
  components/   Site layout, table, empty/loading/error states
  config/       Site wording, navigation and table columns
  data/         Empty records, ready for supplied content
  hooks/        Async resource lifecycle
  pages/        Leaderboard, cases and reusable prose pages
  services/     Data access boundary, ready to replace with HTTP
  styles.css    Tailwind theme, base styles and reusable component styles
```

Data flows through `data → services → hooks → pages → components`. Pages do not read local evaluation files or make assumptions about backend protocols.

Tailwind is integrated through `@tailwindcss/vite`. The site's `font-sans` theme uses locally bundled DM Sans (400/500/600) with system fallbacks. Body text and navigation use `text-base` (16px); page headings use `text-2xl` (24px); table rows and secondary copy use `text-sm` (14px). Small table headings use `text-xs` (12px). Navigation and table spacing are compact. Shared semantic classes use Tailwind utilities through `@apply`.

## Fill in later

- Edit `src/config/site.js` for the site name, page labels, empty-state wording and leaderboard columns.
- Add records to `src/data/benchmark.js`; each record/section needs a stable `id`. Leaderboard values are display-ready strings or numbers. Column `key` values match record fields.
- Replace `src/services/benchmark.js` functions with API requests when a backend contract is agreed. Each function returns an array; rejection displays the error state. Keep function references stable.
- Add pages through `src/app/App.jsx` and navigation through `src/config/site.js`.
- Case details, evidence playback and public evaluation metrics are future work once their content and requirements are supplied.

Sidebar: **Leaderboards** opens the rankings; **Benchmark** contains **Agent Behaviour Bench** (the current Agent directory); **About** contains **Paper** and **How to start**. The last two pages are placeholders until content is supplied.

Sidebar routes: `#/`, `#/agents`, `#/paper`, `#/how-to-start`. Existing direct links to `#/cases`, `#/methodology` and `#/about` remain usable.

## Agent directory

`src/data/agents.json` is a generated public snapshot of ABB's committed registry and each registered Agent's `agent.toml`. The directory includes every registration and displays its GitHub repository and pinned commit link. Local sources retain their recorded snapshot hash rather than a fabricated Git commit. No local filesystem paths, credentials, runtime environment or local enabled settings are published.

After updating the sibling `AgentBehaviorBench` repository, run:

```sh
npm run sync:agents
npm run build
```

The importer needs Python 3.11+, or Python 3.10 with `tomli` installed (already available in ABB's active environment). To select another checkout or committed revision: `python scripts/sync_agents.py --repo /path/to/AgentBehaviorBench --ref upstream/main`. Exported metadata records the exact commit used.
