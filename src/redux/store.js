import { configureStore } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import sadgotchuSlice from 'src/redux/sadgotchuSlice.js';

// Créez une transformation qui assure que hunger et happiness ne sont jamais null.
const nonNullTransform = createTransform(
    // transforme l'état entrant (vers le stockage)
    (inboundState, key) => inboundState,
    // transforme l'état sortant (depuis le stockage)
    (outboundState, key) => {
        if (key === 'hunger' || key === 'happiness') {
            return outboundState != null ? outboundState : 50; // Utilisez 50 comme valeur par défaut
        }
        return outboundState;
    },
    { whitelist: ['sadGotchu'] } // Applique cette transformation uniquement au slice sadGotchu
);

// Ajoutez la transformation à votre persistConfig
const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2, // Si vous utilisez autoMergeLevel2
    transforms: [nonNullTransform]
};

const rootReducer = combineReducers({
    sadGotchu: sadgotchuSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);
export default store;