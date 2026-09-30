import { buildSearchDocs } from '../../lib/search-index';

export const GET = () =>
  new Response(JSON.stringify({ docs: buildSearchDocs('zh') }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
