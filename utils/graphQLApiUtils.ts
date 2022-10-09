import { ApolloClient, createHttpLink, InMemoryCache, QueryOptions } from "@apollo/client";
import { GetServerSidePropsContext } from "next";

const GRAPHQL_URI = process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql";

export const frontendGraphqlClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: GRAPHQL_URI,
        credentials: 'include',
    })
})

// Server can't forward cookies to java api, so we need to extract cookie and send it in a header
export const serverQueryGraphql = async<P>(context: GetServerSidePropsContext, options: QueryOptions, fallback: P) => {
    let accessTokenCookie;
    const cookies = context.req?.headers.cookie?.split(';');

    if (cookies) {
        for (const cookie of cookies) {
            let keyValue = cookie.split('=');
            if (keyValue[0].includes("ACCESS_TOKEN")) {
                accessTokenCookie = keyValue[1];
            }
        }
    }

    const authorizationHeader = accessTokenCookie ? `Bearer ${accessTokenCookie}` : '';

    const serverGraphqlClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: createHttpLink({
            uri: GRAPHQL_URI,
            credentials: 'include',
            headers: {
                authorization: authorizationHeader
            },
        })
    })

    return await serverGraphqlClient.query<P>(options).then((res) => {
        // console.log(res);
        return res.data;
    }).catch((err) => {
        // console.log(err);
        return fallback;
    })
}