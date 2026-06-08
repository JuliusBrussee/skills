# ADR 0001: Publish Initial Skills As Installable Directories

## Status

Accepted.

## Context

The repo needs to publish only `caveman` and `ui-craft` for now, work with `skills.sh` style installers, and remain easy to inspect on GitHub.

## Decision

Store every skill under `skills/<skill-name>/SKILL.md`, with optional local `README.md`, `references/`, `scripts/`, or assets inside that skill directory.

Keep repo-level docs small:

- `README.md` explains positioning and quickstart.
- `CLAUDE.md` and `AGENTS.md` guide coding agents.
- `CONTEXT.md` defines domain language.
- `scripts/verify-skills.mjs` validates frontmatter.

## Consequences

Skill directories stay portable. Repo remains compatible with common skill installers. Long reference material lives next to the skill that uses it.
