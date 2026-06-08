# Context

## Domain

This repository is a public skill collection for AI coding agents. For now it publishes only `caveman` and `ui-craft`.

## Maintainer Identity

Julius Brussee is the creator of Caveman and related agent tooling. Repo voice can reference token efficiency, terse agent communication, and UI craft.

## Core Concepts

- **Skill** - installable instruction directory, usually `SKILL.md` plus optional references or scripts.
- **Caveman** - communication compression style that removes filler while preserving technical detail.
- **UI craft** - implementation discipline for accessible, performant, visually specific interfaces.
- **Progressive disclosure** - agents read the smallest useful context first, then load linked references only as needed.

## Repository Shape

- `skills/` contains installable skill directories.
- `scripts/` contains repo maintenance helpers.
- `docs/adr/` records structural decisions.

## Public Positioning

This repo should feel adjacent to Matt Pocock's skills repo in format, but should not copy its wording or identity. Position Julius around Caveman and taste-driven UI engineering.
