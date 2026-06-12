# Context

## Domain

This repository is a public skill collection for AI coding agents. For now it publishes `caveman`, `interface-kit`, `grill-me`, `loop-factory`, `junior-to-senior`, `fuck-slop`, and `context-canary`.

## Maintainer Identity

Julius Brussee is the creator of Caveman and related agent tooling. Repo voice can reference token efficiency, terse agent communication, and interface craft.

## Core Concepts

- **Skill** - installable instruction directory, usually `SKILL.md` plus optional references or scripts.
- **Caveman** - communication compression style that removes filler while preserving technical detail.
- **Interface Kit** - implementation discipline for accessible, performant, visually specific interfaces.
- **Grill Me** - calibrated interview workflow that assesses knowledge and desired pressure before challenging a plan.
- **Loop Factory** - spec-driven agent loop; tasks are markdown specs that move through inbox → active → archive and pass a review gate before counting as done.
- **F*ck Slop** - scan → rewrite-by-meaning → re-scan loop that strips AI-writing tells from text; mechanical regex detection because the tells are emergent habits the rewriting model can't see in itself.
- **Context Canary** - per-turn first-line signal (name + turn counter + self-check) that dies visibly when context degrades, paired with a checkpoint-and-reset trip protocol.
- **Progressive disclosure** - agents read the smallest useful context first, then load linked references only as needed.

## Repository Shape

- `skills/` contains installable skill directories.
- `scripts/` contains repo maintenance helpers.
- `docs/adr/` records structural decisions.

## Public Positioning

This repo should feel adjacent to Matt Pocock's skills repo in format, but should not copy its wording or identity. Position Julius around Caveman, taste-driven UI engineering, and calibrated critique.
