import { defaultLang, ui, type Lang, type UIKey } from './ui';

export const asLang = (value: string | null | undefined): Lang =>
  value && value in ui ? (value as Lang) : defaultLang;

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export const localePath = (lang: Lang, path = '/'): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return lang === defaultLang ? `${base}${normalized}` : `${base}/${lang}${normalized}`;
};

const nonDefaultLocales = (Object.keys(ui) as Lang[]).filter((lang) => lang !== defaultLang);

export const stripLocale = (pathname: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  if (nonDefaultLocales.length === 0) return path || '/';
  const stripped = path.replace(new RegExp(`^/(${nonDefaultLocales.join('|')})(?=/|$)`), '');
  return stripped || '/';
};

export const switchLocalePath = (lang: Lang, pathname: string): string =>
  localePath(lang, stripLocale(pathname));
