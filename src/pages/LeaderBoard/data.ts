import experiment from '../../data/experiment1.json'

export { experiment }

export type SystemId = keyof (typeof experiment.issues)[number]['firstHit']

export function detectedCount(systemId: string, budget: number) {
  return experiment.issues.filter((issue) => {
    const firstHit = issue.firstHit[systemId as SystemId]
    return firstHit != null && firstHit <= budget
  }).length
}

export function detectionRate(systemId: string, budget: number) {
  return (100 * detectedCount(systemId, budget) / experiment.issues.length).toFixed(2)
}
