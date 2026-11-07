# Registry data

`registry-agents.json` is generated from `AgentBehaviorBench/resources/registry.toml`
and the registered Agent units. Page components import this JSON; they do not
embed Agent records or totals.

- Include all registered entries, including disabled entries. Unregistered directories are listed separately in the export.
- ID is the numeric Agent directory prefix; preserve gaps and sort numerically.
- Commit is `[source].revision` from `agent.toml`: the recorded imported version, not the first upstream commit or a Git-history reconstruction. Cross-check GitHub provenance when available.
- Count one failure for each immediate `ground_truth/*/runs` directory. Do not count run attempts or infer failure verdicts. This follows the requested directory-based definition.
- Language is inferred from pinned source files, local implementation descriptions, or upstream package metadata. `agent-languages.json` caches supplementary evidence at the specific commit. Unknown is intentional when evidence is unavailable; runtime tool installations alone are not language evidence. Easy Code's JavaScript label describes its distributed bundle.
- Domain classifications are individually reviewed in `agent-domains.json`, keyed by agent ID and registered commit. Each has an editorial primary domain, rationale, source references, and any scope/version caveat. They are not generated from agent-name keywords or the paper's failure taxonomy. Re-exporting preserves these reviews only while the commit matches; new or changed revisions are explicitly unverified.
- Domain review on 2026-11-07 covered all 130 registered agents: 52 local README copies, 76 pinned upstream READMEs, one current upstream README (EasyCode), and one local-profile-only record (OpenChatBI; its public repository returned 404). Profiles were consulted for each registered integration. README content hashes are retained for traceability; current upstream features are not assumed to exist at the pinned revision.
- Domain counts use one primary label per agent. Specialized products inside broader frameworks (for example, Mastra Code and Deep Agents Code) are classified by the registered product. Broad personal assistants remain general-purpose. The notes explain differences between project scope and the restricted ABB deployment.

Regenerate from the workspace root:

```powershell
AgentBehaviorBench/.venv/Scripts/python.exe website/scripts/export_registry.py
```

Python 3.11+ can run the exporter directly; Python 3.10 needs `tomli` (already
available in the benchmark environment). To fetch public pinned upstream metadata
for unresolved languages, run `website/scripts/resolve_languages.py` with that
interpreter, then rerun the exporter. No network is needed for the normal export.
