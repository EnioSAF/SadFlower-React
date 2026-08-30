import AuthProvider from "@/components/Tools/SignInOut/AuthProvider";
import { ZIndexProvider } from "@/components/Tools/ZIndexContext";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from 'src/redux/store.js';
import "/styles/styles.sass";
import "/styles/system32/windows/index.sass";
import "/styles/system32/desktop/crt.sass";
import "/styles/system32/applications/icon.sass";
import "/styles/system32/desktop/taskbar.sass";
import "/styles/system32/windows/window.sass";
import "/styles/system32/windows/WhoAmI/whoami.sass";
import "/styles/system32/windows/Articles/articlewindow.sass";
import "/styles/system32/windows/Articles/window-contenu.sass";
import "/styles/system32/windows/MentionLegal/bookscene.sass";
import "/styles/system32/windows/MentionLegal/legalroute.sass";
import "/styles/system32/windows/MyWork/mywork.sass";
import "/styles/system32/windows/PrivacyConsent/privacyconsent.sass";
import "/styles/system32/windows/SignInSignOut/editavatar.sass";
import "/styles/system32/windows/SignInSignOut/editprofile.sass";
import "/styles/system32/windows/SignInSignOut/userinfo.sass";
import "/styles/system32/windows/SignInSignOut/userlist.sass";
import "/styles/system32/windows/WhoAmI/ChatGPTModule.sass";
import "/styles/system32/windows/PopUp/Enio/ClickOnThis/clickonthis.sass";
import "/styles/system32/windows/PopUp/OskarWash/CoolBug4Sell/coolbug4sell.sass";
import "/styles/system32/windows/PopUp/OskarWash/DiveIn/divein.sass";
import "/styles/system32/windows/aboutpage.sass";
import "/styles/system32/windows/twitchwindow.sass";

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
