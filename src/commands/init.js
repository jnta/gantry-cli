import { checkbox, select, Separator } from '@inquirer/prompts';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getSkillsCatalog(dir) {
  const categories = await fs.readdir(dir);
  const catalog = [];

  for (const category of categories) {
    const categoryPath = path.join(dir, category);
    if (!(await fs.stat(categoryPath)).isDirectory()) continue;

    const skills = await fs.readdir(categoryPath);
    const categoryObj = {
      category: category,
      expanded: false,
      skills: []
    };

    for (const skill of skills) {
      const skillPath = path.join(categoryPath, skill, 'skill.json');
      if (await fs.pathExists(skillPath)) {
        const metadata = await fs.readJson(skillPath);
        categoryObj.skills.push({
          id: skill,
          category: category,
          label: metadata.label || skill,
          path: path.join(categoryPath, skill)
        });
      }
    }

    if (categoryObj.skills.length > 0) {
      catalog.push(categoryObj);
    }
  }
  return catalog;
}

async function selectSkillsCollapsible(catalog) {
  let selectedSkills = [];
  let isDone = false;

  while (!isDone) {
    const action = await select({
      message: `Selected: ${selectedSkills.length} skills. Manage your harness:`,
      choices: [
        ...catalog.map(cat => ({
          name: `${cat.expanded ? '📂' : '📁'} ${cat.category.toUpperCase()}`,
          value: cat.category
        })),
        { name: chalk.green('✔ DONE - Generate Harness'), value: 'done' }
      ]
    });

    if (action === 'done') {
      isDone = true;
    } else {
      const category = catalog.find(c => c.category === action);
      
      const skillsInCat = await checkbox({
        message: `Select skills in ${action}:`,
        choices: category.skills.map(s => ({
          name: s.label,
          value: s,
          checked: selectedSkills.some(existing => existing.id === s.id)
        }))
      });

      selectedSkills = [
        ...selectedSkills.filter(s => s.category !== action),
        ...skillsInCat
      ];
    }
  }
  return selectedSkills;
}

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

  const skillsDir = path.join(__dirname, '../skills');
  const catalog = await getSkillsCatalog(skillsDir);

  const selectedSkills = await selectSkillsCollapsible(catalog);

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
