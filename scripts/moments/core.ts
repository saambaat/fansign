import * as p from '@clack/prompts';
import { languages, type Lang } from '../../src/i18n/ui';

export const langOrder = Object.keys(languages) as Lang[];

export type LocalizedMap = Partial<Record<Lang, string>>;

export class Cancelled extends Error {}

export const guard = <T>(value: T): Exclude<T, symbol> => {
  if (p.isCancel(value)) throw new Cancelled();
  return value as Exclude<T, symbol>;
};
