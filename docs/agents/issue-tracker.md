# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One effort per directory: `.scratch/<effort-slug>/`
- The wayfinder map is `.scratch/<effort-slug>/map.md`
- Tickets are `.scratch/<effort-slug>/issues/NN-<slug>.md`, numbered from `01`
- `Status:` line: `open` / `claimed` / `resolved`
- `Type:` line: `research` / `grilling` / `prototype` / `task`
- `Blocked by: NN, NN` line when dependencies exist
- Answers appended under `## Answer` heading on resolution

## Wayfinding operations

- **Map**: `.scratch/<effort>/map.md`
- **Frontier**: open + unblocked + unclaimed tickets in `.scratch/<effort>/issues/`
- **Claim**: set `Status: claimed` before starting any work
- **Resolve**: append answer under `## Answer`, set `Status: resolved`, add one-line gist + link to map's Decisions-so-far
