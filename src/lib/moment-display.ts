import type { Lang } from '../i18n/ui';
import { resolveText, type Moment } from './moment-schema';

export const headingFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang) ??
  [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ');

export const subFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang)
    ? [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ')
    : '';
