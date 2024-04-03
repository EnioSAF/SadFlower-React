import AuthProvider from "@/components/Tools/SignInOut/AuthProvider";
import { ZIndexProvider } from "@/components/Tools/ZIndexContext";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from 'src/redux/store.js';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ZIndexProvider>
            <Component {...pageProps}/>
          </ZIndexProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
