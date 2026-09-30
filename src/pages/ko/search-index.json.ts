import { buildSearchDocs } from '../../lib/search-index';

export const GET = () =>
  new Response(JSON.stringify({ docs: buildSearchDocs('ko') }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
