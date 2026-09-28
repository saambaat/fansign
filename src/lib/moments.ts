import raw from '../data/moments.json';
import { momentPathParams } from './moment-display';
import { parseMoments } from './moment-schema';

export const moments = parseMoments(raw, 'src/data/moments.json').sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const momentPaths = () =>
  moments.map((moment) => ({ params: momentPathParams(moment), props: { moment } }));
