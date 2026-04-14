#!/usr/bin/env node
import { program } from 'commander';
import { initAction } from '../src/commands/init.js';

program
  .name('gantry')
  .description('Harness Engineering CLI for AI Agents')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize the AI harness in the current repository')
  .action(initAction);

program.parse();
