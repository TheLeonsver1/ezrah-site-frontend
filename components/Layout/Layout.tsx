import { Box, Container } from "@mui/material";
import Head from "next/head";
import { MinimialPageProps } from "../../pages/_app";
import { Header } from "./Header/Header";

const Layout: React.FC<{ children: React.ReactNode, pageTitle?: string, description?: string } & MinimialPageProps> = (props) => {

    const pageTitle = props.pageTitle
        ? <title>{props.pageTitle}</title>
        : <title>אזרח</title>;
    return (
        <>
            <Head>
                {pageTitle}
                <meta name="description" content={props.description ? props.description : ''} />
                {
                    // @ts-ignore
                    <link rel="icon" href="/favicon.ico" />
                }
            </Head>
            <Header isLoggedIn={props.isLoggedIn} userId={props.userId} userName={props.userName} />
            <Container>
                <main>
                    {props.children}
                </main>
                <footer>
                </footer>
            </Container>
        </>
    )
}
export default Layout;