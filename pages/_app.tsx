import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink } from '@apollo/client';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { useContext } from 'react';
import React from 'react';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const GRAPHQL_URI = process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql";

const frontendGraphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: GRAPHQL_URI,
    credentials: 'include',
  })
})

function RTL(props: { children: any }) {
  return <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
}

export const MinimalPagePropsContext = React.createContext<MinimialPageProps>({ isLoggedIn: false, userId: null, userName: null });

function MyApp({ Component, pageProps }: AppProps<MinimialPageProps>) {
  console.log(pageProps)
  return <RTL>
    <ApolloProvider client={frontendGraphqlClient}>
      <MinimalPagePropsContext.Provider value={{ ...pageProps }}>
        <Component {...pageProps} />
      </MinimalPagePropsContext.Provider>
    </ApolloProvider>
  </RTL>
}


MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  let cookies = appContext.ctx.req?.headers.cookie?.split(';');
  let accessTokenCookie;
  // console.log(cookies)
  if (cookies) {
    for (const cookie of cookies) {
      let keyValue = cookie.split('=');
      if (keyValue[0].includes("ACCESS_TOKEN")) {
        accessTokenCookie = keyValue[1];
      }
    }
  }
  let authorizationHeader = accessTokenCookie ? `Bearer ${accessTokenCookie}` : ''
  // we use a seperate client from the frontend because we can't use credentials: include here and have to get a authorization header 
  const serverGraphqlClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: GRAPHQL_URI,
      credentials: 'include',
      headers: {
        authorization: authorizationHeader
      }
    })
  })
  // console.log(authorizationHeader);
  const minimalProps = await serverGraphqlClient.query<{ minimalPageProps: MinimialPageProps }>({
    query: gql`
    query {
      minimalPageProps {
        isLoggedIn,
        userId,
        userName
      }
    }
    `
  }).then(res => {
    // console.log("success")
    return res.data.minimalPageProps;
  }).catch(err => {
    // console.log("err")
    // console.log(err)
    return undefined;
  });
  // console.log(appProps)
  // console.log(minimalProps)
  return { ...appProps, pageProps: { ...appProps.pageProps, ...minimalProps } }
}

export default MyApp

interface MinimialPageProps {
  isLoggedIn: boolean;
  userId?: number | null;
  userName?: string | null;
}