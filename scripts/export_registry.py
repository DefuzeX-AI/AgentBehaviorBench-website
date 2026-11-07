"""Export the local benchmark registry to the website's data directory."""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import zipfile

try:
    import tomllib
except ModuleNotFoundError:
    import tomli as tomllib

WEBSITE = Path(__file__).resolve().parents[1]
EXTENSIONS = {'.py': 'Python', '.ts': 'TypeScript', '.tsx': 'TypeScript',
              '.js': 'JavaScript', '.jsx': 'JavaScript', '.rs': 'Rust',
              '.go': 'Go', '.zig': 'Zig', '.kt': 'Kotlin', '.java': 'Java'}
EXCLUDED = {'node_modules', '.git', '.venv', 'venv', 'vendor', 'dist', 'build',
            'tests', 'test', 'docs', 'examples', '__pycache__', '.pnpm-store'}


def read_toml(path):
    return tomllib.loads(path.read_text(encoding='utf-8-sig'))


def language_from_files(files):
    sizes = Counter()
    for name, size in files:
        path = Path(name)
        if not EXCLUDED.intersection(path.parts) and path.suffix in EXTENSIONS:
            sizes[EXTENSIONS[path.suffix]] += size
    return sizes.most_common(1)[0][0] if sizes else None


def detect_language(root, unit, manifest):
    source = manifest['source']
    key = hashlib.sha256((source['repository'] + '\n' + source['revision']).encode()).hexdigest()
    archive = root / 'cache/sources' / f'{key}.zip'
    if archive.exists():
        with zipfile.ZipFile(archive) as zipped:
            language = language_from_files((i.filename, i.file_size) for i in zipped.infolist())
        if language:
            return language, f'{archive.relative_to(root).as_posix()} (largest source language by bytes)'
    files = []
    for directory, dirs, names in os.walk(unit / 'agent'):
        dirs[:] = [d for d in dirs if d not in EXCLUDED and not d.startswith('.')]
        for name in names:
            path = Path(directory) / name
            if path.suffix in EXTENSIONS:
                files.append((str(path.relative_to(unit / 'agent')), path.stat().st_size))
    language = language_from_files(files)
    if language:
        return language, f'{unit.relative_to(root).as_posix()}/agent (largest source language by bytes)'
    # Installation artifacts are not necessarily written in the upstream language.
    # Use only explicit implementation descriptions, not installed runtime tools.
    profile = (unit / 'requirement.md').read_text(encoding='utf-8-sig')
    for language in ['Rust', 'Go', 'Zig', 'Kotlin', 'TypeScript', 'Python']:
        if re.search(rf'\b{language} (?:AI |coding |terminal |binary |clean-room |core|agent|CLI)', profile):
            return language, f'{unit.relative_to(root).as_posix()}/requirement.md (implementation description)'
    return None, None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--benchmark', type=Path, default=WEBSITE.parent / 'AgentBehaviorBench')
    args = parser.parse_args()
    root = args.benchmark.resolve()
    registry = read_toml(root / 'resources/registry.toml')['agents']
    overrides_path = WEBSITE / 'src/data/agent-languages.json'
    overrides = json.loads(overrides_path.read_text()) if overrides_path.exists() else {}
    domains_path = WEBSITE / 'src/data/agent-domains.json'
    domains = json.loads(domains_path.read_text(encoding='utf-8')) if domains_path.exists() else {'agents': {}}
    rows = []
    for position, entry in enumerate(registry, 1):
        unit = root / entry['path']
        manifest = read_toml(unit / 'agent.toml')
        revision = manifest['source']['revision']
        provenance_path = unit / 'source-manifest.json'
        provenance = json.loads(provenance_path.read_text(encoding='utf-8-sig')) if provenance_path.exists() else {}
        if provenance.get('source_type') == 'github' and provenance.get('revision', revision) != revision:
            raise ValueError(f'Conflicting source revisions: {entry["agent_id"]}')
        failures = sorted(p.parent.name for p in (unit / 'ground_truth').glob('*/runs') if p.is_dir())
        language, evidence = detect_language(root, unit, manifest)
        if entry['agent_id'] in overrides and overrides[entry['agent_id']].get('commit') == revision:
            language = overrides[entry['agent_id']]['language']
            evidence = overrides[entry['agent_id']]['evidence']
        domain = domains['agents'].get(entry['agent_id'], {})
        if domain.get('commit') != revision:
            domain = {}
        rows.append({
            'id': int(unit.name.split('-', 1)[0]), 'registryOrder': position,
            'agent': entry['agent_id'], 'commit': revision,
            'repository': manifest['source']['repository'],
            'failureCount': len(failures), 'failureIssues': failures,
            'language': language, 'languageEvidence': evidence,
            'integration': entry['framework'],
            'sourcePath': entry['path'],
            'domain': domain.get('domain', 'Unverified'),
            'domainReason': domain.get('reason', 'Domain review is not available for this registered revision.'),
            'domainSources': domain.get('sources', []),
            'domainNote': domain.get('note', ''),
        })
    rows.sort(key=lambda row: row['id'])
    registered = {Path(e['path']).name for e in registry}
    data = {
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'source': 'AgentBehaviorBench/resources/registry.toml',
        'failureDefinition': 'One ground_truth issue containing a runs directory counts once, regardless of run count or verdict.',
        'commitDefinition': 'Pinned imported revision from agent.toml, cross-checked with source-manifest.json where present; not the repository first commit.',
        'domainDefinition': domains.get('method', ''),
        'domainReviewedOn': domains.get('reviewedOn'),
        'unregisteredDirectories': sorted(p.name for p in (root / 'resources/agents').iterdir() if p.is_dir() and p.name not in registered),
        'summary': {'agents': len(rows), 'failures': sum(r['failureCount'] for r in rows),
                    'agentsWithFailures': sum(r['failureCount'] > 0 for r in rows)},
        'agents': rows,
    }
    target = WEBSITE / 'src/data/registry-agents.json'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(data['summary']))
    print('Unresolved languages:', ', '.join(r['agent'] for r in rows if not r['language']))


if __name__ == '__main__':
    main()
