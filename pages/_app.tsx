import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import { CacheProvider, EmotionCache } from '@emotion/react';
import React from 'react';
import createEmotionCache from '../utils/createEmotionCache';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../utils/theme';
import { frontendGraphqlClient } from '../utils/graphQLApiUtils';
import { cacheRtl } from '../utils/rtlUtils';

const clientSideEmotionCache = createEmotionCache();


const MyApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: AppProps & { emotionCache: EmotionCache }) => {
  console.log(pageProps)
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CacheProvider value={cacheRtl} >
          <ApolloProvider client={frontendGraphqlClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </CacheProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export interface MinimialPageProps {
  isLoggedIn: boolean;
  userId?: number | null;
  userName?: string | null;
}

export default MyApp



