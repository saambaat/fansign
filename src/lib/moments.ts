import raw from '../data/moments.json';
import { parseMoments } from './moment-schema';

export const moments = parseMoments(raw, 'src/data/moments.json').sort((a, b) =>
  b.date.localeCompare(a.date),
);
