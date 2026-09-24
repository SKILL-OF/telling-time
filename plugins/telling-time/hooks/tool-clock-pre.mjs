#!/usr/bin/env node
// PreToolUse hook: records a real wall-clock start time for this tool call,
// keyed by session + tool name, so the matching PostToolUse hook can compute
// a real duration. Fixes a real gap: Claude has no ambient sense of elapsed
// time between tool calls unless it's surfaced explicitly like this.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let data = '';
process.stdin.on('data', (d) => (data += d));
process.stdin.on('end', () => {
	let input = {};
	try {
		input = JSON.parse(data);
	} catch {
		// ignore, use defaults below
	}
	const sessionId = input.session_id || input.sessionId || 'unknown-session';
	const toolName = input.tool_name || input.toolName || 'unknown-tool';
	const stateFile = path.join(os.tmpdir(), `claude-toolclock-${sessionId}.json`);
	let stack = [];
	try {
		stack = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
	} catch {
		stack = [];
	}
	stack.push({ tool: toolName, start: Date.now() });
	try {
		fs.writeFileSync(stateFile, JSON.stringify(stack));
	} catch {
		// non-fatal: worst case, PostToolUse just won't find a match
	}
	process.exit(0);
});
