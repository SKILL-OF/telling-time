#!/usr/bin/env node

// A UserPromptSubmit hook. Consume the event payload so stdin is drained,
// then inject only the current clock reading—no transcript content is read.
process.stdin.resume();

const now = new Date();
const pacificDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  dateStyle: "full",
  timeStyle: "medium",
}).format(now);
const pacificZone = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  timeZoneName: "short",
})
  .formatToParts(now)
  .find((part) => part.type === "timeZoneName")?.value ?? "Pacific";
const pacific = `${pacificDate} ${pacificZone}`;

process.stdout.write(`${JSON.stringify({
  continue: true,
  hookSpecificOutput: {
    hookEventName: "UserPromptSubmit",
    additionalContext: `Live clock: ${pacific} (UTC ${now.toISOString()}). Use this reading for any statement about current time, schedules, or deadlines.`,
  },
})}\n`);
