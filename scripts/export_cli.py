"""Export the installed checkout's argparse reference without executing commands.

Run from website: ../AgentBehaviorBench/.venv/Scripts/python.exe scripts/export_cli.py
"""
import argparse
import json
import sys
from pathlib import Path

WEBSITE = Path(__file__).resolve().parents[1]
BACKEND = WEBSITE.parent / 'AgentBehaviorBench'
sys.path.insert(0, str(BACKEND))
from agentbench.cli.main import build_parser


def display(value):
    if value is None or value == argparse.SUPPRESS:
        return '—'
    if isinstance(value, Path):
        try:
            relative = value.relative_to(BACKEND)
            return '<checkout>' + ('/' + relative.as_posix() if relative.parts else '')
        except ValueError:
            return '<path>'
    return str(value).lower() if isinstance(value, bool) else str(value)


def export(parser, path=(), summary='', inherited=()):
    parameters = []
    children = []
    for action in parser._actions:
        if isinstance(action, argparse._SubParsersAction):
            helps = {item.dest: item.help for item in action._choices_actions}
            children.extend((name, child, helps.get(name, '')) for name, child in action.choices.items())
            continue
        if action.help == argparse.SUPPRESS:
            continue
        formatter = parser._get_formatter()
        parameters.append({
            'name': ', '.join(action.option_strings) or action.dest,
            'kind': 'Option' if action.option_strings else 'Positional',
            'value': 'flag' if action.nargs == 0 else display(action.metavar or getattr(action.type, '__name__', 'string')),
            'required': bool(action.required),
            'default': display(action.default),
            'description': formatter._expand_help(action) if action.help else '',
            'choices': [str(item) for item in action.choices] if action.choices else [],
            'scope': 'agentbench ' + ' '.join(path),
        })
    rows = []
    if path:
        rows.append({
            'id': '-'.join(path), 'command': 'agentbench ' + ' '.join(path),
            'group': path[0], 'kind': 'Group' if children else 'Command',
            'description': summary or parser.description or 'JSON API operation: ' + path[-1] + '.',
            'usage': parser.format_usage().removeprefix('usage: ').strip(),
            'parameters': [*inherited, *parameters],
            'subcommands': ['-'.join((*path, name)) for name, _, _ in children],
        })
    parent_parameters = (*inherited, *(p for p in parameters if p['name'] != '-h, --help'))
    for name, child, help_text in children:
        rows.extend(export(child, (*path, name), help_text, parent_parameters))
    return rows


if __name__ == '__main__':
    entries = export(build_parser())
    descriptions = json.loads((WEBSITE / 'src/data/cli-descriptions.json').read_text(encoding='utf-8'))
    for entry in entries:
        entry['description'] = descriptions.get(entry['command'], entry['description'])
    commands = [entry for entry in entries if entry['kind'] == 'Command']
    groups = [{'id': 'general', 'label': 'General', 'description': 'Execution, evaluation, recovery, and result management.'}]
    for entry in entries:
        if entry['kind'] == 'Group':
            groups.append({'id': entry['id'], 'label': entry['command'].removeprefix('agentbench '), 'description': entry['description']})
    for command in commands:
        parent = command['command'].split()[1:-1]
        command['group'] = '-'.join(parent) if parent else 'general'
    groups = [group for group in groups if any(command['group'] == group['id'] for command in commands)]
    groups.sort(key=lambda group: group['id'] == 'api')
    document = {
        'title': 'CLI Reference',
        'introduction': 'Browse agentbench commands by category. Search by command, argument, or description; select a command to inspect its usage and parameters. JSON API commands are listed in a separate category.',
        'note': 'Generated from the ABB CLI parser. Options inherited from a parent command must appear before its subcommand. A dash means no default or description is specified by the CLI.',
        'commands': commands,
        'groups': groups,
    }
    (WEBSITE / 'src/data/cli-documentation.json').write_text(json.dumps(document, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Exported {len(commands)} commands in {len(groups)} categories.')
