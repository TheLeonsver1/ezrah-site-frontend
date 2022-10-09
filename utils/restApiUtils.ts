import axios from "axios";
import { GetServerSidePropsContext } from "next";

export const restClient = axios.create({ baseURL: process.env.NEXT_PUBLIC_BACKEND_URL })

export enum EndpointEnum {
    homePageProps = "/homePageProps.json",
    specificBillPageProps = "/specificBillPageProps.json",
}

/**
 * @param context the next.js context
 * @param endpoint the endpoint to send a GET request to
 * @param fallback the fallback value in case there's an error
 * @returns the desired response from the server,
 *  or the fallback value in case of failure
 */
export const apiGet = async <P>(context: GetServerSidePropsContext,
    endpoint: EndpointEnum, fallback: P, data: any = undefined) => {
    let accessTokenCookie;
    const cookies = context.req.headers.cookie?.split(';');

    // Server can't forward cookies to java api, so we need to extract cookie and send it in a header
    if (cookies) {
        for (const cookie of cookies) {
            let keyValue = cookie.split('=');
            if (keyValue[0].includes("ACCESS_TOKEN")) {
                accessTokenCookie = keyValue[1];
            }
        }
    }

    const authorizationHeader = accessTokenCookie ? `Bearer ${accessTokenCookie}` : '';

    return await restClient.get<P>(endpoint, {
        headers: { 'Authorization': authorizationHeader },
        data,
        withCredentials: true
    }).then(res => {
        return res.data;
    }).catch(err => {
        // console.log(err);
        return fallback;
    })

}