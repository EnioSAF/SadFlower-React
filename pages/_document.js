import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang='fr'>
                <Head>
                    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500&display=swap" rel="stylesheet" />

                    <meta name='description' content='LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS...' />
                    <meta name='keywords' content='Enio, enio, ENIO, sadflower, SADFLOWER, SadFlower, Enio SadFlower, ENIO SADFLOWER, enio sadflower, sadflowerhub, SadFlowerHub, SadFlower Hub, SadFlowerCorp, sadflowercorp' />
                    <meta name='author' content='Enio SadFlower' />
                    <meta charSet='UTF-8' />
                    <meta property='og:title' content='SadFlower HUB' />
                    <meta property='og:description' content='LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS...' />
                    <meta property='og:image' content='URL de votre image ici' />
                    <meta property='og:url' content='http://sadflower.fr' />
                    <meta name='twitter:title' content='SadFlower HUB' />
                    <meta name='twitter:description' content='LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS...' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument