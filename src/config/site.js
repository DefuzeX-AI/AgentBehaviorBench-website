// Replace public wording here once the site's content is decided.
export const site = {
  name: 'AgentBehaviorBench',
  shortName: 'ABB',
  section: 'BENCHMARK',
  header: 'Benchmark Overview',
  footer: 'AgentBehaviorBench',
};

export const navigation = [
  { path: '/', label: 'Leaderboard', eyebrow: 'LEADERBOARD', title: 'Leaderboard' },
  { path: '/agents', label: 'Agents', eyebrow: 'AGENT DIRECTORY', title: 'Agents' },
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
};
