import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link
                    rel="preload"
                    href="/fonts/Britanica-BlackRegular.ttf"
                    as="font"
                    type="font/ttf"
                    crossOrigin="anonymous"
                />
            </Head>
            <body className=' font-britanica font-normal '>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}