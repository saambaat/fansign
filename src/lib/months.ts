import type { Lang } from '../i18n/ui';

const monthFormatters = new Map<Lang, Intl.DateTimeFormat>();
const dateFormatters = new Map<Lang, Intl.DateTimeFormat>();

const monthFormatter = (lang: Lang): Intl.DateTimeFormat => {
  let formatter = monthFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(lang, { month: 'long', timeZone: 'UTC' });
    monthFormatters.set(lang, formatter);
  }
  return formatter;
};

const dateFormatter = (lang: Lang): Intl.DateTimeFormat => {
  let formatter = dateFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' });
    dateFormatters.set(lang, formatter);
  }
  return formatter;
};

export const monthName = (month: string, lang: Lang = 'en'): string =>
  monthFormatter(lang).format(new Date(`${month}-01T00:00:00Z`));

export const formatDate = (date: string, lang: Lang = 'en'): string =>
  dateFormatter(lang).format(new Date(`${date}T00:00:00Z`));

export const monthKey = (month: string): string => month.slice(5);
