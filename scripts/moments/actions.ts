import * as p from '@clack/prompts';
import { momentSchema } from '../../src/lib/moment-schema';
import { guard } from './core';
import {
  parseTags,
  pickMoment,
  promptDate,
  promptId,
  promptLocalizedSource,
  promptMomentType,
  promptOptional,
  promptPairing,
  promptSourceLang,
  showPreview,
  today,
} from './prompts';
import { loadMoments, saveMoments } from './store';
import { editLocalized, translateInteractive } from './translate';
import { offerPullRequest } from './publish';

export const addMoment = async (): Promise<void> => {
  const items = await loadMoments();
  const taken = new Set(items.map((moment) => moment.id));
  const id = await promptId('', taken);
  const pairing = await promptPairing();
  const momentType = await promptMomentType();
  const date = await promptDate(today());
  const sourceLang = await promptSourceLang();
  const eventSource = await promptLocalizedSource('Event', sourceLang, '');
  const titleSource = await promptLocalizedSource('Title', sourceLang, '');
  const event = eventSource ? await translateInteractive('event', eventSource, sourceLang) : undefined;
  const title = titleSource ? await translateInteractive('title', titleSource, sourceLang) : undefined;
  const credit = await promptOptional('Credit (URL) — leave empty to skip', '');
  const tags = parseTags(await promptOptional('Tags (comma separated) — leave empty to skip', ''));
  const draft = momentSchema.parse({
    id,
    pairing,
    momentType,
    date,
    title,
    event,
    credit: credit || undefined,
    tags,
  });
  showPreview(draft);
  const confirmed = guard(await p.confirm({ message: 'Save this moment?' }));
  if (!confirmed) {
    p.log.info('Discarded.');
    return;
  }
  await saveMoments([...items, draft]);
  p.log.success(`Saved ${draft.id} to src/data/moments.json.`);
  await offerPullRequest('add', draft);
};

export const editMoment = async (): Promise<void> => {
  const items = await loadMoments();
  if (items.length === 0) {
    p.log.warn('No moments to edit.');
    return;
  }
  const target = await pickMoment('Which moment do you want to edit?', items);
  const sourceLang = await promptSourceLang();
  const id = await promptId(target.id, new Set(items.map((moment) => moment.id)), target.id);
  const pairing = await promptPairing(target.pairing);
  const momentType = await promptMomentType(target.momentType);
  const date = await promptDate(target.date);
  const event = await editLocalized('Event', target.event, sourceLang);
  const title = await editLocalized('Title', target.title, sourceLang);
  const credit = await promptOptional('Credit (URL) — leave empty to remove', target.credit ?? '');
  const tags = parseTags(
    await promptOptional('Tags (comma separated) — leave empty to remove', target.tags.join(', ')),
  );
  const draft = momentSchema.parse({
    id,
    pairing,
    momentType,
    date,
    title,
    event,
    credit: credit || undefined,
    tags,
  });
  showPreview(draft);
  const confirmed = guard(await p.confirm({ message: 'Save changes?' }));
  if (!confirmed) {
    p.log.info('Discarded.');
    return;
  }
  await saveMoments(items.map((moment) => (moment.id === target.id ? draft : moment)));
  p.log.success(`Updated ${draft.id}.`);
  await offerPullRequest('edit', draft);
};

export const deleteMoment = async (): Promise<void> => {
  const items = await loadMoments();
  if (items.length === 0) {
    p.log.warn('No moments to delete.');
    return;
  }
  const target = await pickMoment('Which moment do you want to delete?', items);
  showPreview(target);
  const confirmed = guard(await p.confirm({ message: `Delete ${target.id}? This cannot be undone.` }));
  if (!confirmed) {
    p.log.info('Kept.');
    return;
  }
  await saveMoments(items.filter((moment) => moment.id !== target.id));
  p.log.success(`Deleted ${target.id}.`);
  await offerPullRequest('delete', target);
};
