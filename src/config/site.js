// Replace public wording here once the site's content is decided.
export const site = {
  name: 'Agent Behaviour Bench',
  header: 'Benchmark Overview',
  footer: 'Agent Behaviour Bench',
};

export const navigationGroups = [
  { id: 'leaderboards', items: [
    { path: '/', label: 'Leaderboards', eyebrow: 'RANKINGS', title: 'Leaderboards' },
  ] },
  { id: 'benchmark', label: 'Benchmark', items: [
    { path: '/agents', label: 'Agent Behaviour Bench', eyebrow: 'BENCHMARK', title: 'Agent Behaviour Bench' },
  ] },
  { id: 'about', label: 'About', items: [
    { path: '/paper', label: 'Paper', eyebrow: 'ABOUT', title: 'Paper' },
    { path: '/how-to-start', label: 'How to start', eyebrow: 'ABOUT', title: 'How to start' },
  ] },
];

export const navigation = navigationGroups.flatMap((group) => group.items);

// Keep existing direct links usable without adding them to the sidebar.
export const pageMetadata = [
  ...navigation,
  { path: '/cases', label: 'Cases', eyebrow: 'CASES', title: 'Cases' },
  { path: '/methodology', label: 'Methodology', eyebrow: 'METHODOLOGY', title: 'Methodology' },
  { path: '/about', label: 'About', eyebrow: 'ABOUT', title: 'About' },
];

export const leaderboardColumns = [
  { key: 'rank', label: 'Rank' },
  { key: 'model', label: 'Model' },
  { key: 'score', label: 'Score' },
  { key: 'cost', label: 'Cost' },
  { key: 'date', label: 'Date' },
];

export const emptyContent = {
  agents: { title: 'No agents available', description: 'Registered agents will appear here.' },
  leaderboard: { title: 'No results yet', description: 'Benchmark results will appear here.' },
  cases: { title: 'No cases yet', description: 'Cases and behavioral evidence will appear here.' },
  methodology: { title: 'Methodology coming soon', description: 'Evaluation procedures, metrics, and criteria will be documented here.' },
  about: { title: 'About coming soon', description: 'Project background and information will appear here.' },
  paper: { title: 'Paper coming soon', description: 'The benchmark paper will be available here.' },
  howToStart: { title: 'Getting started guide coming soon', description: 'Setup instructions will be available here.' },
};
