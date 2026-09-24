#!/usr/bin/env node
// PostToolUse hook: prints a real wall-clock line with the real duration of
// the tool call that just finished, matched against the PreToolUse hook's
// recorded start time. Plain stdout so it surfaces as visible hook output.
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

	let entry = null;
	for (let i = stack.length - 1; i >= 0; i--) {
		if (stack[i].tool === toolName) {
			entry = stack.splice(i, 1)[0];
			break;
		}
	}
	try {
		fs.writeFileSync(stateFile, JSON.stringify(stack));
	} catch {
		// non-fatal
	}

	const now = new Date();
	const wall = now.toLocaleString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});

	let durText = 'duration unknown (no matching start)';
	if (entry) {
		const ms = Date.now() - entry.start;
		durText = ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
	}

	console.log(`[clock] ${wall} — ${toolName} took ${durText}`);
	process.exit(0);
});
