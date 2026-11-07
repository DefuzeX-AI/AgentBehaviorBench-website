"""Export existing open-coding annotations; never infer new issue labels.

Run with ../AgentBehaviorBench/.venv/Scripts/python.exe scripts/export_agent_failures.py.
Requires openpyxl. Source workbooks are read-only.
"""
import csv
import json
import re
from pathlib import Path

import openpyxl

WEBSITE = Path(__file__).resolve().parents[1]
ROOT = WEBSITE.parent
SOURCE = ROOT / '发到paper的数据/open_coding'


def rows(workbook, sheet):
    return list(workbook[sheet].values)


def key(value):
    return str(value).strip().casefold()


def main():
    analysis = openpyxl.load_workbook(SOURCE / 'section3-analysis.xlsx', read_only=True, data_only=True)
    severity = openpyxl.load_workbook(SOURCE / 'severity.xlsx', read_only=True, data_only=True)
    inventory = {key(row[0]): row for row in rows(analysis, 'Issue inventory')[1:] if row[0]}
    registry = json.loads((WEBSITE / 'src/data/registry-agents.json').read_text(encoding='utf-8'))
    agents = {key(agent['repository'].removeprefix('https://github.com/').rstrip('/')): agent
              for agent in registry['agents'] if agent.get('repository')}
    issues = {}
    for issue_key, row in inventory.items():
        agent = agents[key(row[2])]
        number = int(row[0].rsplit('#', 1)[1])
        issues[issue_key] = {
            'id': row[0], 'number': number, 'agent': agent['agent'],
            'agentOrder': agent['registryOrder'], 'repository': row[2],
            'title': row[3], 'url': row[5], 'tags': {}, 'annotationNotes': {},
        }

    taxonomy = [{'id': row[0], 'label': row[1], 'definition': row[3]}
                for row in rows(analysis, 'Failure taxonomy')[1:] if row[0]]
    for row in rows(analysis, 'Issue classification')[1:]:
        if row[0]:
            issue = issues[key(row[0])]
            issue['tags']['failureType'] = [value.strip() for value in row[1].split(';')]
            issue['annotationNotes']['failureType'] = {'reason': row[5], 'review': row[7]}

    severity_rows = rows(severity, 'severity')[2:]
    severity_labels = [{'id': str(row[1]), 'label': row[0], 'definition': row[3]}
                       for row in severity_rows if row[0] and row[2] is None and isinstance(row[1], (int, float))]
    for row in severity_rows:
        if row[0] and key(row[0]) in issues:
            issue = issues[key(row[0])]
            issue['tags']['severity'] = [str(row[1])]
            issue['annotationNotes']['severity'] = {'reason': row[3]}

    dimensions = [
        {'key': 'failureType', 'label': 'Failure Type', 'multiple': True, 'labels': taxonomy},
        {'key': 'severity', 'label': 'Severity', 'multiple': False, 'labels': severity_labels},
    ]
    for dimension, sheet, pattern in (
        ('executionStage', 'Execution stage', r'S\d+'),
        ('observableOutcome', 'Observable outcome', r'O\d+'),
        ('failureScope', 'Failure scope', r'F\d+'),
    ):
        records = rows(severity, sheet)[2:]
        labels = [{'id': row[9], 'label': row[10], 'definition': row[11]}
                  for row in records if len(row) > 11 and re.fullmatch(pattern, str(row[9]))]
        for row in records:
            if row[0] and key(row[0]) in issues:
                issue = issues[key(row[0])]
                issue['tags'].setdefault(dimension, []).append(row[1])
                issue['annotationNotes'].setdefault(dimension, []).append({'label': row[1], 'reason': row[3]})
        dimensions.append({'key': dimension, 'label': sheet.title(), 'multiple': dimension != 'failureScope', 'labels': labels})

    # Reconcile with reference runs and the separately exported reviewed taxonomy.
    ground_truth = set()
    for file in (ROOT / 'AgentBehaviorBench/resources/agents').glob('*/ground_truth/issue_*/verify.case.json'):
        if (file.parent / 'runs').is_dir():
            report = json.loads(file.read_text(encoding='utf-8-sig'))['issue']
            ground_truth.add(key(f"{report['repository']}#{report['number']}"))
    assert set(issues) == ground_truth, 'Open coding and issues with runs do not match'
    with (SOURCE / 'reviewed_figures/reviewed_failure_type_distribution_issue_labels.csv').open(encoding='utf-8-sig', newline='') as stream:
        reviewed = {key(row['Issue ID']): set(row['Type IDs'].split(';')) for row in csv.DictReader(stream)}
    assert set(reviewed) == set(issues)
    for issue_key, issue in issues.items():
        assert set(issue['tags']['failureType']) == reviewed[issue_key]
        for dimension in dimensions:
            assigned = issue['tags'][dimension['key']]
            allowed = {label['id'] for label in dimension['labels']}
            assert assigned and set(assigned) <= allowed, (issue_key, dimension['key'])
            assert len(assigned) == len(set(assigned)), 'Duplicate assignment'
            assert dimension['multiple'] or len(assigned) == 1
    for dimension in dimensions:
        for label in dimension['labels']:
            label['count'] = sum(label['id'] in issue['tags'][dimension['key']] for issue in issues.values())
    document = {
        'title': 'Agent Failures',
        'description': 'Issue-derived behavioural failures, annotated across five dimensions. Each row links to the original report; tags preserve the existing open-coding assignments.',
        'codingNote': 'Failure type, execution stage, and observable outcome can have multiple tags. Severity and failure scope have one tag per issue. These are research annotations: severity, observable outcome, and failure scope remain preliminary; taxonomy review does not establish independent human consensus.',
        'sources': ['open_coding/section3-analysis.xlsx', 'open_coding/severity.xlsx'],
        'dimensions': dimensions,
        'issues': sorted(issues.values(), key=lambda issue: (issue['agentOrder'], issue['number'])),
    }
    serialized = json.dumps(document, ensure_ascii=False, indent=2) + '\n'
    if re.search(r'[\u3400-\u9fff]', serialized):
        raise ValueError('Website data must be English. Translate the source workbook text before exporting; the existing website data has not been overwritten.')
    (WEBSITE / 'src/data/agent-failures.json').write_text(serialized, encoding='utf-8')
    print(f"Exported {len(issues)} issues across {len(set(issue['agent'] for issue in issues.values()))} agents; all five dimensions validated.")
    for dimension in dimensions:
        print(dimension['label'], ':', sum(label['count'] for label in dimension['labels']), 'assignments')


if __name__ == '__main__':
    main()
