import Head from 'next/head';
import AuthProvider from "@/components/Tools/SignInOut/AuthProvider";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <AuthProvider>
            {/* <Head>
                <title>SadFlower HUB</title>
                <meta name="description" content="LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS..." />
                <meta name="keywords" content="Enio, enio, ENIO, sadflower, SADFLOWER, SadFlower, Enio SadFlower, ENIO SADFLOWER, enio sadflower, sadflowerhub, SadFlowerHub, SadFlower Hub, SadFlowerCorp, sadflowercorp" />
                <meta name="author" content="Enio SadFlower" />
                <meta name="viewport" content="responsiv" />
                <meta charset="UTF-8" />
                <html lang="fr" />
                <meta property="og:title" content="" />
                <meta property="og:description" content="LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS..." />
                <meta property="og:image" content="URL de votre image ici" />
                <meta property="og:url" content="http://sadflower.fr" />
                <meta name="twitter:title" content="SadFlower HUB" />
                <meta name="twitter:description" content="LE MONDE DE LA SADFLOWER DANS UN SEUL ET MÊME PORTAIL. PORTOFOLIO/CV/MUSIQUE/CREATIONS..." />
                <meta name="twitter:image" content="URL de votre image ici" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head> */}
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;