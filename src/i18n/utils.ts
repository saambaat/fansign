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
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = lang === defaultLang ? '' : `/${lang}`;
  return clean === '' ? `${base}${prefix}` || '/' : `${base}${prefix}/${clean}`;
};

const nonDefaultLocales = (Object.keys(ui) as Lang[]).filter((lang) => lang !== defaultLang);

export const stripLocale = (pathname: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = (base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname)
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '');
  const stripped =
    nonDefaultLocales.length > 0
      ? path.replace(new RegExp(`^/(${nonDefaultLocales.join('|')})(?=/|$)`), '')
      : path;
  return stripped.replace(/\/+$/, '') || '/';
};

export const switchLocalePath = (lang: Lang, pathname: string): string =>
  localePath(lang, stripLocale(pathname));
