# Julius Skills

Two personal agent skills for now: Caveman base and UI Craft.

This repo is shaped by two things:

- **Caveman** - 70k-star token compression without technical loss. Small mouth, big brain.
- **UI craft** - accessible, performant interfaces with strong aesthetic direction, not generic AI slop.

Point is control. Agents should be terse when talking and precise when building interfaces.

## Quickstart

Install with `skills.sh`:

```bash
npx skills@latest add JuliusBrussee/skills
```

Pick the skills you want for Claude Code, Codex, Gemini, Cursor, Windsurf, Cline, Copilot, or any agent supported by the installer.

For the canonical Caveman installer, use:

```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

## Why These Skills Exist

Most agent output fails in two boring ways: too many words, or UI that looks like every other generated demo.

This repo keeps two fixes close:

1. **Speak less, say more.** Caveman cuts output tokens while preserving exact commands, code, errors, and technical meaning.
2. **Build interfaces with taste.** UI Craft starts from accessibility, performance, typography, spatial rhythm, color roles, and concrete interaction states.

## Skills

### `caveman`

Ultra-compressed communication mode. Cuts token usage by dropping filler, hedging, pleasantries, and excess grammar while keeping technical accuracy intact.

Use when you want:

- shorter agent replies
- less token waste
- exact code, command, error, and API preservation
- persistent terse style until user exits with "normal mode"

### `ui-craft`

Implementation guide for high-quality UI. Synthesizes accessibility, performance, typography, layout, color systems, motion, interaction states, and component craft.

Use when building:

- frontend components
- landing pages
- dashboards
- design systems
- polished app flows
- accessibility fixes
- UI review passes

## UI Craft Standard

If a repo has `DESIGN.md`, it wins. Otherwise UI work should still have a point of view:

- Accessibility first: contrast, keyboard navigation, focus states, semantics.
- Performance before decoration: stable layout, lazy assets, transform-only motion.
- Typography matters: readable type scale, sane line length, tabular numbers for data.
- Layout uses stable spatial rules: 4/8px spacing, responsive constraints, no overlap.
- Components have complete states: hover, focus, active, disabled, loading, empty, error.
- Avoid generic defaults: no faceless hero, no purple-blue gradient template, no stock-looking polish.

## Caveman Ecosystem

This repo sits next to broader Julius agent stack:

| Repo | What |
|---|---|
| [caveman](https://github.com/JuliusBrussee/caveman) | Output compression for agents. |
| [caveman-code](https://github.com/JuliusBrussee/caveman-code) | Terminal coding agent built around token efficiency. |
| [cavemem](https://github.com/JuliusBrussee/cavemem) | Cross-agent memory. |
| [cavekit](https://github.com/JuliusBrussee/cavekit) | Spec-driven build loop. |
| [cavegemma](https://github.com/JuliusBrussee/finetune-caveman) | Fine-tuned model experiments for terse agent output. |

## Skill Reference

Run:

```bash
node scripts/list-skills.mjs
```

Verify frontmatter:

```bash
node scripts/verify-skills.mjs
```

## Contributing

Skills should be:

- Small enough to read quickly.
- Triggered by clear user intent.
- Progressive: load only the extra files needed.
- Specific about workflow and validation.
- Free of repo-specific assumptions unless the skill says so.

## License

MIT.
