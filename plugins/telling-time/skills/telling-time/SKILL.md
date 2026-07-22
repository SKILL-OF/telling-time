---
name: telling-time
description: Supplies current UTC and America/Los_Angeles time through a Codex UserPromptSubmit hook. Use its injected clock context whenever a task depends on the current time, schedule, deadline, or elapsed duration.
---

Use the live clock context emitted by this plugin's hook. Do not infer the
current wall-clock time from an automation cadence, message timestamp, or an
earlier turn. If the hook is absent or stale, state that limitation and use an
explicit time source before making a time-sensitive decision.
