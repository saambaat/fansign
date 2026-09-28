import type { Lang } from '../i18n/ui';
import { localePath } from '../i18n/utils';
import { resolveText, type Moment } from './moment-schema';

export const momentPathParams = (
  moment: Moment,
): { year: string; month: string; day: string; id: string } => ({
  year: moment.date.slice(0, 4),
  month: moment.date.slice(5, 7),
  day: moment.date.slice(8, 10),
  id: moment.id,
});

export const momentHref = (moment: Moment, lang: Lang = 'en'): string => {
  const { year, month, day, id } = momentPathParams(moment);
  return localePath(lang, `/${year}/${month}/${day}/${id}`);
};

export const headingFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang) ??
  [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ');

export const subFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang)
    ? [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ')
    : '';
