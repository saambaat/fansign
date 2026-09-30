import { useSyncExternalStore } from 'react';

type Listener = () => void;

const listeners = new Set<Listener>();

const readQueryFromUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('q') ?? '';
};

let query = readQueryFromUrl();

export const getSearchQuery = (): string => query;

export const setSearchQuery = (value: string): void => {
  if (value === query) return;
  query = value;
  for (const listener of listeners) listener();
};

export const subscribeSearchQuery = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Shared by the header input and the search page results so they stay in sync. */
export const useSearchQuery = (): string =>
  useSyncExternalStore(subscribeSearchQuery, getSearchQuery, () => '');

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => setSearchQuery(readQueryFromUrl()));
}
