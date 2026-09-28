#!/usr/bin/env bun
import * as p from '@clack/prompts';
import { addMoment, deleteMoment, editMoment } from './actions';
import { Cancelled, guard } from './core';

const main = async (): Promise<void> => {
  p.intro('fansign moments editor');
  for (;;) {
    const action = guard(
      await p.select({
        message: 'What do you want to do?',
        options: [
          { value: 'add', label: 'Add a moment' },
          { value: 'edit', label: 'Edit a moment' },
          { value: 'delete', label: 'Delete a moment' },
          { value: 'quit', label: 'Quit' },
        ],
      }),
    );
    if (action === 'quit') break;
    try {
      if (action === 'add') await addMoment();
      else if (action === 'edit') await editMoment();
      else await deleteMoment();
    } catch (error) {
      if (error instanceof Cancelled) p.log.warn('Operation cancelled.');
      else throw error;
    }
  }
  p.outro('Done.');
};

await main().catch((error: unknown) => {
  if (error instanceof Cancelled) {
    p.cancel('Cancelled.');
    return;
  }
  p.log.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
