# telling-time

Inject current wall-clock time into Codex turns through a `UserPromptSubmit`
hook. The hook emits both America/Los_Angeles wall time and UTC, so agents can
answer timing, schedule, deadline, and elapsed-duration questions from a live
clock instead of inference.

## Codex user-hook install

The verified Codex install path is a user-level hook file:

`~/.codex/hooks.json`

On Windows, for this repo cloned at
`C:\Users\victorb\.AWG26\.AO\PlayFieldMultiplier\repos\skill-of-telling-time`,
the hook definition is:

```json
{
  "description": "User-level live clock hook from SKILL-OF/telling-time.",
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"C:\\Users\\victorb\\.AWG26\\.AO\\PlayFieldMultiplier\\repos\\skill-of-telling-time\\plugins\\telling-time\\hooks\\current-time.mjs\"",
            "commandWindows": "node \"C:\\Users\\victorb\\.AWG26\\.AO\\PlayFieldMultiplier\\repos\\skill-of-telling-time\\plugins\\telling-time\\hooks\\current-time.mjs\"",
            "timeout": 5,
            "statusMessage": "Updating live clock"
          }
        ]
      }
    ]
  }
}
```

After the file is written, Codex Desktop's Hooks settings should show a
`UserPromptSubmit` hook under **User config**. In the observed 2026-07-22
Windows Desktop run, the hook appeared in the UI after using `~/.codex/hooks.json`
and did not require a restart. The user still had to review/trust the hook in
the UI before it could run.

## What did not work in that run

Adding the repo as a local plugin marketplace and enabling
`telling-time@skill-of` in `config.toml` did not cause the hook to appear in
the Hooks UI. Keep the plugin packaging, but do not present marketplace
enablement as the verified installation path for this hook until a later test
proves it.

## Validation

Run the hook command directly:

```powershell
node .\plugins\telling-time\hooks\current-time.mjs
```

Expected output is JSON containing `hookSpecificOutput.additionalContext` with
a string beginning `Live clock:`.
