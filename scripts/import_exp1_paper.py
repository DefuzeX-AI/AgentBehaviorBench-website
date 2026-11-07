"""Import Table 13 from the supplied paper; derive scores from first-hit counts."""
import argparse
import json
from pathlib import Path
import re

import fitz

parser = argparse.ArgumentParser()
parser.add_argument('paper', type=Path)
args = parser.parse_args()
with fitz.open(args.paper) as pdf:
    page_number, text = next((i + 1, p.get_text()) for i, p in enumerate(pdf)
                             if 'Table 13. Per-issue failure detection results.' in p.get_text())
pattern = r'(?m)^(\d+)\n([\w-]+)\n#(\d+)\n(No hit|Hit \(\d+\))\n(No hit|Hit \(\d+\))'
def first_hit(value):
    return int(re.search(r'\d+', value).group()) if value.startswith('Hit') else None

issues = sorted([{'id': int(i), 'agent': agent, 'issue': int(issue),
                  'firstHit': {'codex': first_hit(codex), 'claude-code': first_hit(claude)}}
                 for i, agent, issue, codex, claude in re.findall(pattern, text)], key=lambda r: r['id'])
if [r['id'] for r in issues] != list(range(1, 44)):
    raise ValueError('Expected all 43 unique Table 13 rows; inspect the paper layout.')
for key, expected in [('codex', [4, 5, 7, 9, 13]), ('claude-code', [5, 6, 7, 7, 7])]:
    actual = [sum(r['firstHit'][key] is not None and r['firstHit'][key] <= k for r in issues) for k in [1, 5, 10, 20, 50]]
    if actual != expected:
        raise ValueError(f'Unexpected detection counts for {key}: {actual}')
data = {
    'title': 'Behavioural Failure Detection',
    'experiment': 'Experiment 1',
    'description': 'Testing agents generate test conversations from high-level task descriptions, without access to the original issue report, failure symptoms, or reproduction steps.',
    'metricDescription': 'Detection@k is the percentage of issues whose reported failure is triggered within k test executions, as verified by an independent failure oracle. Higher is better.',
    'budgets': [1, 5, 10, 20, 50],
    'rankingBudget': 50,
    'source': {'document': args.paper.name, 'table': 'Table 13', 'page': page_number},
    'systems': [{'id': 'codex', 'name': 'Codex', 'model': 'Astra 6'},
                {'id': 'claude-code', 'name': 'Claude Code', 'model': 'Opus 5.5'}],
    'issues': issues,
}
target = Path(__file__).resolve().parents[1] / 'src/data/experiment1.json'
target.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(issues)} issues across {len(set(i["agent"] for i in issues))} agents.')
for system in data['systems']:
    print(system['name'], [sum(i['firstHit'][system['id']] is not None and i['firstHit'][system['id']] <= k for i in issues) for k in data['budgets']])
