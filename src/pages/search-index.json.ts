import { defaultLang } from '../i18n/ui';
import { buildSearchDocs } from '../lib/search-index';

export const GET = () =>
  new Response(JSON.stringify({ docs: buildSearchDocs(defaultLang) }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
