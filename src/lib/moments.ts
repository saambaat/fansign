import { z } from 'zod';
import { defaultLang, languages, type Lang } from '../i18n/ui';
import raw from '../data/moments.json';

const localeKeys = Object.keys(languages) as [Lang, ...Lang[]];

const localizedTextSchema = z.union([
  z.string().min(1),
  z.partialRecord(z.enum(localeKeys), z.string().min(1)),
]);

export type LocalizedText = z.infer<typeof localizedTextSchema>;

export const resolveText = (value: LocalizedText | undefined, lang: Lang): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return value[lang] ?? value[defaultLang] ?? Object.values(value)[0];
};

const isRealDate = (value: string): boolean => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

const momentSchema = z
  .object({
    id: z
      .string()
      .min(1, 'id is required')
      .regex(/^[A-Za-z0-9]+$/, {
        error: 'id must be the bare Imgur media ID (e.g. aMmtnGX), not a URL or album path',
      }),
    date: z
      .iso
      .date({ error: 'date must be yyyy-MM-dd' })
      .refine(isRealDate, { error: 'date must be a real calendar date' }),
    title: localizedTextSchema.optional(),
    event: localizedTextSchema.optional(),
    credit: z.string().min(1).optional(),
    tags: z.array(z.string().min(1)).default([]),
  })
  .strict();

export type Moment = z.infer<typeof momentSchema>;

const parsed = z.array(momentSchema).safeParse(raw);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid src/data/moments.json:\n${details}`);
}

const monthFormatters = new Map<Lang, Intl.DateTimeFormat>();

const monthFormatter = (lang: Lang): Intl.DateTimeFormat => {
  let formatter = monthFormatters.get(lang);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(lang, { month: 'long', timeZone: 'UTC' });
    monthFormatters.set(lang, formatter);
  }
  return formatter;
};

export const monthName = (month: string, lang: Lang = 'en'): string =>
  monthFormatter(lang).format(new Date(`${month}-01T00:00:00Z`));

export const monthKey = (month: string): string => month.slice(5);

export const headingFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang) ??
  [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ');

export const subFor = (moment: Moment, lang: Lang = 'en'): string =>
  resolveText(moment.title, lang)
    ? [moment.date, resolveText(moment.event, lang)].filter(Boolean).join(' · ')
    : '';

export const videoUrl = (id: string): string => `https://i.imgur.com/${id}.mp4`;

export const posterUrl = (id: string): string => `https://i.imgur.com/${id}.jpg`;

export const moments: Moment[] = [...parsed.data].sort((a, b) =>
  b.date.localeCompare(a.date),
);
