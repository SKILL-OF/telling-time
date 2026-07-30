---
name: telling-time
description: Supplies current UTC and America/Los_Angeles time through a Codex UserPromptSubmit hook. Use its injected clock context whenever a task depends on the current time, schedule, deadline, or elapsed duration.
---

## Activation status

This hook is verified to fire only under **Codex Desktop, with the hook
registered directly in the user-level `~/.codex/hooks.json`** (confirmed
2026-07-22 on Windows). It is **not verified** under any of these, and should
not be assumed active there:

- Codex with only the local plugin marketplace entry enabled (`config.toml`)
  — tested 2026-07-22 and the hook did **not** appear in the Hooks UI that way.
- Claude Code, or any other harness — this skill has not been ported or
  tested outside Codex. `plugins/telling-time/hooks/hooks.json` happens to use
  the same `{hooks: {UserPromptSubmit: [...]}}` shape Claude Code plugins use,
  but that structural similarity has not been exercised as a real Claude Code
  install; treat it as untested, not as evidence of cross-harness support.

If you are an agent running under a harness/install path not listed above as
verified, assume this hook is **not** injecting live time into your context.
Use the live clock context only when you can confirm you're on the verified
path (check the harness's own hook/settings UI for a registered
`UserPromptSubmit` entry from this plugin). Otherwise state that limitation
explicitly and use another explicit time source before making a
time-sensitive decision — do not infer wall-clock time from an automation
cadence, message timestamp, or an earlier turn.
