import { z } from 'zod';
import raw from '../data/moments.json';

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
    title: z.string().min(1).optional(),
    event: z.string().min(1).optional(),
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

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  timeZone: 'UTC',
});

export const monthName = (month: string): string =>
  monthFormatter.format(new Date(`${month}-01T00:00:00Z`));

export const monthKey = (month: string): string => month.slice(5);

export const headingFor = (moment: Moment): string =>
  moment.title ?? [moment.date, moment.event].filter(Boolean).join(' · ');

export const subFor = (moment: Moment): string =>
  moment.title ? [moment.date, moment.event].filter(Boolean).join(' · ') : '';

export const videoUrl = (id: string): string => `https://i.imgur.com/${id}.mp4`;

export const posterUrl = (id: string): string => `https://i.imgur.com/${id}.jpg`;

export const moments: Moment[] = [...parsed.data].sort((a, b) =>
  b.date.localeCompare(a.date),
);
