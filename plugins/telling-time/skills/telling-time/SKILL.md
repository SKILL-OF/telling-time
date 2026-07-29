---
name: telling-time
description: Supplies current UTC and America/Los_Angeles time through a Codex UserPromptSubmit hook. Use its injected clock context whenever a task depends on the current time, schedule, deadline, or elapsed duration.
---

Use the live clock context emitted by this plugin's hook. Do not infer the
current wall-clock time from an automation cadence, message timestamp, or an
earlier turn. If the hook is absent or stale, state that limitation and use an
explicit time source before making a time-sensitive decision.

Install note, verified 2026-07-22 on Codex Desktop for Windows: the hook
surfaced in the Hooks UI when registered directly in `~/.codex/hooks.json` as a
user-level `UserPromptSubmit` hook. Enabling the local plugin marketplace entry
alone did not surface the hook in that run. Do not tell users to restart by
default; first check whether the Hooks UI has refreshed and whether the hook
needs trust review.
