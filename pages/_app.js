import AuthProvider from "@/components/Tools/SignInOut/AuthProvider";
import { ZIndexProvider } from "@/components/Tools/ZIndexContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <AuthProvider>
      <ZIndexProvider>
        <Component {...pageProps} />
      </ZIndexProvider>
    </AuthProvider>
  );
}

export default MyApp;
