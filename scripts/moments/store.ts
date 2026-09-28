import { readFile, writeFile } from 'node:fs/promises';
import {
  formatIssues,
  momentListSchema,
  parseMoments,
  type Moment,
} from '../../src/lib/moment-schema';
import { dataPath } from './core';

const recordFor = (moment: Moment): Record<string, unknown> => {
  const record: Record<string, unknown> = { id: moment.id, date: moment.date };
  if (moment.title !== undefined) record.title = moment.title;
  if (moment.event !== undefined) record.event = moment.event;
  if (moment.credit !== undefined) record.credit = moment.credit;
  if (moment.tags.length > 0) record.tags = moment.tags;
  return record;
};

export const loadMoments = async (): Promise<Moment[]> => {
  const raw = JSON.parse(await readFile(dataPath, 'utf8')) as unknown;
  return parseMoments(raw, 'src/data/moments.json');
};

export const saveMoments = async (items: Moment[]): Promise<void> => {
  const records = [...items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(recordFor);
  const parsed = momentListSchema.safeParse(records);
  if (!parsed.success) {
    throw new Error(`Refusing to write invalid data:\n${formatIssues(parsed.error)}`);
  }
  await writeFile(dataPath, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
};
