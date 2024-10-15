import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// NB: A unique `key` is important for it to work!
const options = {
  rtl: { key: 'css-ar' },
  ltr: { key: 'css-en' },
};
export function RtlProvider({ children }) {
  const dir = document.documentElement.dir === 'ar' ? 'rtl' : 'ltr';
  const cache = createCache(options[dir]);
  return <CacheProvider value={cache} children={children} />;
}
