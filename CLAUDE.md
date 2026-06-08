# Repository Instructions

## Purpose

This repo publishes two Julius Brussee agent skills for now: `caveman` and `ui-craft`. Treat it as an installable skill collection, not a product website.

## Editing Rules

- Keep skill files in `skills/<skill-name>/SKILL.md`.
- Every skill needs YAML frontmatter with `name` and `description`.
- Keep descriptions action-oriented. They should say when the skill triggers and what workflow it provides.
- Use progressive disclosure. Put long references in `references/` and link them from `SKILL.md`.
- Do not add generated build artifacts.
- Do not vendor third-party plugin caches.

## Voice

Repo copy may be concise, but skill bodies should stay clear enough for agents to follow. Caveman branding belongs in Caveman skills and public-facing README sections, not every skill.

## Quality Bar

Before committing:

```bash
node scripts/verify-skills.mjs
node scripts/list-skills.mjs
```

For `ui-craft` changes, preserve priorities:

- accessibility
- performance
- typography
- layout and spatial design
- color semantics
- motion and interaction
- polish

## Agent Skills

### Issue Tracker

Issues live in GitHub Issues for `JuliusBrussee/skills` once repo is published.

### Triage Labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

### Domain Docs

Single-context repo. Use `CONTEXT.md` and `docs/adr/`.
