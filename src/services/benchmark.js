import * as data from '../data/benchmark.js';
import agentDirectory from '../data/agents.json';

// UI depends on this boundary. Swap these functions for fetch() when an API exists.
export async function getLeaderboard() { return data.leaderboard; }
export async function getCases() { return data.cases; }
export async function getMethodology() { return data.methodology; }
export async function getAbout() { return data.about; }
export async function getAgents() { return agentDirectory.agents; }
export const agentDirectorySource = agentDirectory.source;
