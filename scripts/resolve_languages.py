"""Cache upstream language evidence at the registered revision (public files only)."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'src/data'


def resolve(row):
    repo = row['repository'].removeprefix('https://github.com/').removesuffix('.git')
    base = f'https://raw.githubusercontent.com/{repo}/{row["commit"]}/'
    candidates = [('pyproject.toml', 'Python'), ('setup.py', 'Python'),
                  ('Cargo.toml', 'Rust'), ('go.mod', 'Go'),
                  ('tsconfig.json', 'TypeScript'), ('package.json', 'JavaScript'),
                  ('build.zig', 'Zig'), ('requirements.txt', 'Python')]
    if row['integration'] == 'acp':
        candidates.sort(key=lambda item: item[0] not in ('Cargo.toml', 'tsconfig.json', 'go.mod'))
    for path, language in candidates:
        url = base + path
        try:
            with urlopen(Request(url, headers={'User-Agent': 'AgentBehaviorBench-registry-export'}), timeout=12) as response:
                content = response.read(500_000).decode('utf-8')
            if path == 'package.json':
                package = json.loads(content)
                if 'typescript' in package.get('devDependencies', {}) or 'typescript' in package.get('dependencies', {}):
                    language = 'TypeScript'
                elif not any(key in package for key in ('main', 'bin', 'scripts')):
                    continue
            return row['agent'], {'language': language, 'commit': row['commit'], 'evidence': url}
        except (HTTPError, URLError, TimeoutError, ValueError):
            continue
    return row['agent'], None


if __name__ == '__main__':
    rows = json.loads((DATA / 'registry-agents.json').read_text(encoding='utf-8'))['agents']
    target = DATA / 'agent-languages.json'
    cached = json.loads(target.read_text()) if target.exists() else {}
    pending = [r for r in rows if not r['language']]
    with ThreadPoolExecutor(max_workers=10) as pool:
        for agent, result in pool.map(resolve, pending):
            if result:
                cached[agent] = result
            print(agent, result['language'] if result else 'Unknown', flush=True)
    target.write_text(json.dumps(cached, indent=2) + '\n', encoding='utf-8')
