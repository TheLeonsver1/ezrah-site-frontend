import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});