---
name: telling-time
description: Supplies current UTC and America/Los_Angeles time through a Codex UserPromptSubmit hook, and a real wall-clock + measured-duration line around every individual tool call via a Claude Code PreToolUse/PostToolUse hook pair. Use its injected clock context whenever a task depends on the current time, schedule, deadline, or elapsed duration.
---

## Why the PreToolUse/PostToolUse pair exists

Real incident, 2026-09-24: an agent narrated an entire multi-hour incident
as "tonight," purely from the emotional/pattern shape of the conversation
(crisis language, deploy-fix-deploy cycles), without ever once checking
real wall-clock time. It was 3:37 PM; the session had started before 11 AM.
The agent, asked directly, confirmed the actual gap: it has no ambient,
continuously-updating sense of elapsed time at all -- only what it
explicitly queries, or what happens to already be present in something it
read (a timestamp in a log line, a notification). The `UserPromptSubmit`
hook below only refreshes at user-turn boundaries, which is coarser than
the actual gap -- an agent can run many tool calls, and real elapsed time,
inside a single turn with no fresh clock reading anywhere in that span.

The `tool-clock-pre.mjs` / `tool-clock-post.mjs` pair closes that
finer-grained gap: `PreToolUse` records a real epoch timestamp keyed by
session id + tool name (a small per-session JSON file in the OS temp dir,
push/pop stack so concurrent/nested calls for the same tool name don't
collide), and `PostToolUse` matches it, computes a real elapsed duration,
and prints a plain `[clock] <wall time> — <tool> took <duration>` line to
stdout so it surfaces as visible hook output in the transcript.

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

## The Claude Code PreToolUse/PostToolUse pair — real, verified status

Verified 2026-09-24: `tool-clock-pre.mjs` and `tool-clock-post.mjs`, wired
into `hooks.json`'s `PreToolUse`/`PostToolUse` arrays, run and produce a
correct real-wall-clock + real-duration line when smoke-tested standalone
with synthetic stdin JSON (`{"session_id":"...","tool_name":"..."}` piped
into each script directly). **Not yet verified as actually firing inside a
live Claude Code session** — Claude Code hook config changes are read at
session start, and this was installed mid-session; the next fresh session
start is the real test. If you are the agent who does that first real
session-start test, update this section with the actual result (a real
`[clock] ...` line appearing as hook output after a real tool call, or its
absence) rather than assuming it worked because the standalone smoke test
passed. A hook that works when piped fake JSON directly is not proof it's
correctly wired into the harness's real invocation path.
