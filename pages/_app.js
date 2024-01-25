import AuthProvider from "@/components/Tools/SignInOut/AuthProvider";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;