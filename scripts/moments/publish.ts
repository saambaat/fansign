import * as p from '@clack/prompts';
import { resolveText, type Moment } from '../../src/lib/moment-schema';
import { guard, langOrder, type LocalizedMap } from './core';
import {
  commitDataFile,
  compareUrl,
  createBranch,
  currentBranch,
  defaultBranch,
  isGitRepo,
  openPullRequest,
  pushBranch,
  switchBranch,
  uniqueBranchName,
} from './git';

export type MomentAction = 'add' | 'edit' | 'delete';

const verbs: Record<MomentAction, string> = {
  add: 'Add',
  edit: 'Update',
  delete: 'Remove',
};

const eventSummary = (moment: Moment): string =>
  [moment.date, resolveText(moment.event, 'en')].filter(Boolean).join(' · ');

const describeLocalized = (label: string, value: LocalizedMap | undefined): string[] =>
  value === undefined
    ? []
    : langOrder.map((lang) => `- ${label}.${lang}: ${value[lang] ?? '—'}`);

const pullRequestBody = (action: MomentAction, moment: Moment): string => {
  const event = typeof moment.event === 'string' ? { en: moment.event } : moment.event;
  const title = typeof moment.title === 'string' ? { en: moment.title } : moment.title;
  const lines = [
    `Automated by \`bun run moments\`.`,
    '',
    `- action: ${action}`,
    `- id: ${moment.id}`,
    `- date: ${moment.date}`,
    ...describeLocalized('event', event),
    ...describeLocalized('title', title),
  ];
  if (moment.credit !== undefined) lines.push(`- credit: ${moment.credit}`);
  if (moment.tags.length > 0) lines.push(`- tags: ${moment.tags.join(', ')}`);
  return lines.join('\n');
};

export const offerPullRequest = async (action: MomentAction, moment: Moment): Promise<void> => {
  if (!isGitRepo()) {
    p.log.warn('Not inside a git repository; skipping branch and PR.');
    return;
  }
  const base = defaultBranch();
  const original = currentBranch();
  const branch = uniqueBranchName(`moments/${action}-${moment.id}`);
  const wants = guard(
    await p.confirm({
      message: `Create branch "${branch}" and open a PR to ${base}?`,
      initialValue: true,
    }),
  );
  if (!wants) return;
  if (original !== base) {
    p.log.warn(`Branching from "${original}", so the PR may include its commits.`);
  }

  const message = `${verbs[action]} moment ${moment.id} (${eventSummary(moment)})`;
  const spinner = p.spinner();

  spinner.start(`Creating branch "${branch}"...`);
  const created = createBranch(branch);
  if (!created.ok) {
    spinner.stop('Could not create the branch.');
    p.log.error(created.stderr);
    return;
  }
  spinner.stop(`Created "${branch}".`);

  spinner.start('Committing src/data/moments.json...');
  const committed = commitDataFile(message);
  if (!committed.ok) {
    spinner.stop('Commit failed.');
    p.log.error(committed.stderr);
    switchBranch(original);
    return;
  }
  spinner.stop('Committed.');

  spinner.start(`Pushing "${branch}"...`);
  const pushed = pushBranch(branch);
  if (!pushed.ok) {
    spinner.stop('Push failed.');
    p.log.error(pushed.stderr);
    switchBranch(original);
    return;
  }
  spinner.stop('Pushed.');

  spinner.start('Opening the pull request...');
  const pr = openPullRequest({
    base,
    branch,
    title: message,
    body: pullRequestBody(action, moment),
  });
  if (pr.ok) {
    spinner.stop('Pull request opened.');
    p.log.success(pr.stdout);
  } else {
    spinner.stop('Could not open the PR automatically.');
    p.log.warn(pr.stderr);
    const url = compareUrl(base, branch);
    if (url) p.log.info(`Open it manually: ${url}`);
  }

  const restored = switchBranch(original);
  if (!restored.ok) {
    p.log.warn(`Could not switch back to "${original}": ${restored.stderr}`);
  }
};
