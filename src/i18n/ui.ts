export const languages = {
  en: 'English',
  ko: '한국어',
  zh: '中文',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export const en = {
  'site.title': 'Fansigns',
  'site.description': 'A fan-made directory of fansign moments, with videos embedded from Imgur.',
  'nav.site': 'Site',
  'nav.home': 'Home',
  'nav.years': 'Years',
  'nav.months': 'Months',
  'nav.menu': 'Menu',
  'nav.toggleMenu': 'Toggle menu',
  'search.placeholder': 'Search',
  'search.empty': 'No moments match.',
  'theme.toggle': 'Toggle theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',
  'lang.toggle': 'Change language',
} as const;

export type UIKey = keyof typeof en;

export const ko: Record<UIKey, string> = {
  'site.title': '팬사인',
  'site.description': '팬사인 순간들을 모은 팬 제작 아카이브입니다. 영상은 Imgur에서 불러옵니다.',
  'nav.site': '사이트',
  'nav.home': '홈',
  'nav.years': '연도',
  'nav.months': '월',
  'nav.menu': '메뉴',
  'nav.toggleMenu': '메뉴 열기',
  'search.placeholder': '검색',
  'search.empty': '일치하는 순간이 없습니다.',
  'theme.toggle': '테마 변경',
  'theme.light': '라이트',
  'theme.dark': '다크',
  'theme.system': '시스템',
  'lang.toggle': '언어 변경',
};

export const zh: Record<UIKey, string> = {
  'site.title': '签售会',
  'site.description': '粉丝整理的签售瞬间合集，视频来自 Imgur。',
  'nav.site': '网站',
  'nav.home': '首页',
  'nav.years': '年份',
  'nav.months': '月份',
  'nav.menu': '菜单',
  'nav.toggleMenu': '打开菜单',
  'search.placeholder': '搜索',
  'search.empty': '没有找到匹配的瞬间。',
  'theme.toggle': '切换主题',
  'theme.light': '浅色',
  'theme.dark': '深色',
  'theme.system': '跟随系统',
  'lang.toggle': '切换语言',
};

export const ui: Record<Lang, Record<UIKey, string>> = { en, ko, zh };
