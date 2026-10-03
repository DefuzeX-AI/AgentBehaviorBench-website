"""Export only public Agent metadata from a committed ABB revision."""
import argparse
import json
from pathlib import Path, PurePosixPath
import subprocess
from urllib.parse import urlparse

try:
    import tomllib
except ImportError:
    try:
        import tomli as tomllib
    except ImportError:
        raise SystemExit("Use Python 3.11+ or install tomli: python -m pip install tomli")

ROOT = Path(__file__).resolve().parents[1]


def git(repo, *args):
    result = subprocess.run(["git", "-C", str(repo), *args], capture_output=True)
    if result.returncode:
        raise ValueError("Unable to read the requested committed ABB source")
    return result.stdout.decode("utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=ROOT.parent / "AgentBehaviorBench")
    parser.add_argument("--ref", default="HEAD")
    args = parser.parse_args()
    repo = args.repo.resolve()
    revision = git(repo, "rev-parse", "--verify", f"{args.ref}^{{commit}}").strip()
    registry = tomllib.loads(git(repo, "show", f"{revision}:resources/registry.toml"))
    agents, ids = [], set()
    for entry in registry["agents"]:
        agent_id = entry["agent_id"]
        if agent_id in ids:
            raise ValueError("Duplicate Agent ID in registry")
        ids.add(agent_id)
        path = PurePosixPath(entry["path"])
        if path.is_absolute() or ".." in path.parts or path.parts[:2] != ("resources", "agents"):
            raise ValueError("Agent path must be inside resources/agents")
        manifest = tomllib.loads(git(repo, "show", f"{revision}:{path}/agent.toml"))
        if manifest["agent_id"] != agent_id or manifest["framework"] != entry["framework"]:
            raise ValueError("Agent manifest does not match its registry entry")
        source = manifest.get("source", {})
        source_url = source.get("repository", entry.get("source", ""))
        parsed = urlparse(source_url)
        # Never export local source paths, runtime settings, env names or credentials.
        is_public = parsed.scheme == "https" and parsed.netloc == "github.com" and len(parsed.path.strip("/").split("/")) == 2 and not parsed.query and not parsed.fragment
        source_url = source_url.rstrip("/") if is_public else None
        agents.append({
            "id": agent_id,
            "displayName": manifest.get("display_name", agent_id),
            "framework": entry["framework"],
            "sourceUrl": source_url,
            "sourceLabel": parsed.path.strip("/") if is_public else None,
            "path": str(path),
            "sourceRevision": source.get("revision"),
        })
    agents.sort(key=lambda agent: agent["path"])
    data = {
        "source": {"repository": "https://github.com/DefuzeX-AI/AgentBehaviorBench", "revision": revision},
        "agents": agents,
    }
    output = ROOT / "src" / "data" / "agents.json"
    output.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Exported {len(agents)} agents from ABB {revision[:8]}")


if __name__ == "__main__":
    main()
