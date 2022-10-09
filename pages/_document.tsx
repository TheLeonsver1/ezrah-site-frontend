import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import createEmotionCache from '../utils/createEmotionCache';
import createEmotionServer from "@emotion/server/create-instance";
import React from 'react';
export default class MyDocument extends Document {
    render() {
        return (
            // @ts-ignore
            <Html dir="rtl" lang="he">
                <Head >
                    {// @ts-ignore
                        this.props.emotionStyleTags}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}


MyDocument.getInitialProps = async (ctx: DocumentContext) => {
    const originalRenderPage = ctx.renderPage;

    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) =>
                function EnhanceApp(props) {
                    // @ts-ignore
                    return <App emotionCache={cache} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);

    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        styles: [
            ...React.Children.toArray(initialProps.styles),
            ...emotionStyleTags,
        ],
    };
};