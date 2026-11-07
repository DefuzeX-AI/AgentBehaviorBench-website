# AgentBehviorBench Web

Vite + React (JavaScript) + Tailwind CSS + Redux Toolkit.

```sh
npm install
npm run dev
```

Build: `npm run build`. Lint: `npm run lint`.

Navigation uses React Router with real links and browser history. `/` opens Leaderboards; `/leaderboards` redirects to `/`. Page URLs and sidebar groups live in `src/data/navigation.json`. Each page sets its own document title.

The build pre-renders every page to its own HTML file, then hydrates React in the browser. Nested URLs work directly on static hosting, and their initial HTML includes page content. Hidden navigation entries are excluded from the sitemap and marked noindex. Legacy URLs have redirect pages.

GitHub Pages deployment targets https://agentbehaviorbench.com/. In the repository settings, choose Pages → Source → GitHub Actions and set Custom domain to agentbehaviorbench.com. The workflow builds and deploys on pushes to main; only dist is published. Local development and deployment use `/`; the deployment workflow sets SITE_BASE=/ and SITE_ORIGIN=https://agentbehaviorbench.com. If the domain or repository path changes, update these environment variables together.

Theme tokens live in `src/index.css` using Tailwind's `@theme`: `bg-primary`, `text-primary-foreground`, `bg-background`, `text-foreground`, `text-muted`, and `border-border`. Use `font-heading` / `font-serif` for Times New Roman headings and `font-sans` for Arial body text. System fallback fonts are included; no font download is required.
