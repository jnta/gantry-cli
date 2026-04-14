import { checkbox, search, Separator } from '@inquirer/prompts';
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

async function gantrySkillPicker(catalog) {
  let selectedSkills = [];
  let isDone = false;

  while (!isDone) {
    // Top-level "Modern" Menu
    const action = await search({
      message: `[${selectedSkills.length} skills active] Manage Harness Skills:`,
      source: async (input) => {
        const categories = catalog.map(cat => ({
          name: `📁 ${cat.category.toUpperCase()}`,
          value: { type: 'category', id: cat.category },
          description: `Contains ${cat.skills.length} skills`
        }));

        const meta = [
          { name: chalk.green.bold('✔ FINALIZE HARNESS'), value: { type: 'done' } },
          { name: chalk.yellow('🔍 Global Search'), value: { type: 'search' } }
        ];

        const all = [...categories, ...meta];
        if (!input) return all;
        
        // Dynamic filtering for the "modern" feel
        return all.filter(c => c.name.toLowerCase().includes(input.toLowerCase()));
      }
    });

    if (action.type === 'done') {
      isDone = true;
    } else if (action.type === 'category') {
      const categoryData = catalog.find(c => c.category === action.id);
      
      const picked = await checkbox({
        message: `Toggle skills for ${action.id.toUpperCase()}:`,
        choices: categoryData.skills.map(s => ({
          name: s.label,
          value: s,
          checked: selectedSkills.some(item => item.id === s.id)
        }))
      });

      // Update selection: Remove old items from this category and add the new selection
      selectedSkills = [
        ...selectedSkills.filter(s => s.category !== action.id),
        ...picked
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

  const selectedSkills = await gantrySkillPicker(catalog);

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
