import { checkbox } from '@inquirer/prompts';
import fs from 'fs-extra';
import chalk from 'chalk';

export async function initAction() {
  console.log(chalk.blue.bold('\n🚀 Welcome to Gantry: Setting up your AI Harness\n'));

  const tools = await checkbox({
    message: 'Select the AI tools used in this project:',
    choices: [
      { name: 'Cursor', value: 'cursor' },
      { name: 'Antigravity (Gemini)', value: 'antigravity' },
      { name: 'Claude Code', value: 'claude-code' }
    ],
  });

  const selectedSkills = await checkbox({
    message: 'Which skills/constraints do you want to inject?',
    choices: [
      { name: 'Architecture Guard (Layer enforcement)', value: 'arch' },
      { name: 'TDD Back-pressure (Forces testing)', value: 'tdd' },
      { name: 'Context Compactor (Prevents rot)', value: 'compact' }
    ],
  });

  for (const tool of tools) {
    if (tool === 'cursor') {
      await fs.ensureDir('.cursor');
      await fs.writeFile('.cursorrules', '# Gantry generated rules\n');
      console.log(chalk.green('  ✔ Created .cursor/ structure'));
    }
    if (tool === 'antigravity') {
      await fs.ensureDir('.gemini');
      console.log(chalk.green('  ✔ Created .gemini/ structure'));
    }
    if (tool === 'claude-code') {
      await fs.ensureDir('.claude');
      console.log(chalk.green('  ✔ Created .claude/ structure'));
    }
  }

  await fs.ensureDir('.gantry');
  await fs.writeJson('.gantry/harness.json', { tools, selectedSkills });
  
  console.log(chalk.blue.bold('\n✅ Harness initialized! Gantry is standing by.\n'));
}
