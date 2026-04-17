#!/usr/bin/env node
/**
 * Install GoodVibes instructions for GitHub Copilot.
 *
 * Usage: node plugins/goodvibes/scripts/install-copilot.js
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PLUGIN_ROOT = join(__dirname, '..');
const PROJECT_ROOT = process.cwd();
const GITHUB_DIR = join(PROJECT_ROOT, '.github');
const INSTRUCTIONS_DIR = join(GITHUB_DIR, 'instructions');

const COPILOT_INSTRUCTIONS_FILE = join(GITHUB_DIR, 'copilot-instructions.md');
const GOODVIBES_INSTRUCTIONS_FILE = join(
  INSTRUCTIONS_DIR,
  'goodvibes.instructions.md'
);

const PROMPT_TEMPLATE_DIR = join(PLUGIN_ROOT, 'templates', 'prompt');
const PROMPT_FILES = [
  'UPGRADE-NOTIFICATIONS.md',
  'PRIMARY-GOALS.md',
  'CORE-PRINCIPLES.md',
  'SUBAGENT-PROTOCOL.md',
  'PRECISION-MASTERY.md',
  'GATHER-PLAN-APPLY.md',
  'SKILLS.md',
];

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function loadPromptSection(filename) {
  const fullPath = join(PROMPT_TEMPLATE_DIR, filename);
  if (!existsSync(fullPath)) {
    return '';
  }

  return readFileSync(fullPath, 'utf-8').trim();
}

function buildGoodVibesInstructionFile() {
  const sections = PROMPT_FILES.map((filename) => {
    const content = loadPromptSection(filename);
    if (!content) {
      return '';
    }

    return `## ${filename.replace('.md', '')}\n\n${content}`;
  }).filter(Boolean);

  return `---
applyTo: "**"
---

# GoodVibes Copilot Instructions

Use these instructions when working in this repository with GitHub Copilot.

${sections.join('\n\n---\n\n')}
`;
}

function buildCopilotInstructionsFile() {
  return `# GoodVibes + GitHub Copilot

This repository uses GoodVibes instruction files for Copilot.

- Follow the rules in \`./instructions/goodvibes.instructions.md\`.
- Prefer precision-focused, batched, minimal-output operations.
- Keep behavior consistent with the GoodVibes orchestration model.
`;
}

function main() {
  console.info('Installing GoodVibes GitHub Copilot instructions...\n');

  ensureDir(GITHUB_DIR);
  ensureDir(INSTRUCTIONS_DIR);

  writeFileSync(
    GOODVIBES_INSTRUCTIONS_FILE,
    buildGoodVibesInstructionFile(),
    'utf-8'
  );
  writeFileSync(
    COPILOT_INSTRUCTIONS_FILE,
    buildCopilotInstructionsFile(),
    'utf-8'
  );

  console.info(`Installed ${GOODVIBES_INSTRUCTIONS_FILE}`);
  console.info(`Installed ${COPILOT_INSTRUCTIONS_FILE}`);
  console.info(
    '\nDone! Restart your Copilot-enabled client to reload instructions.'
  );
}

main();
