import { configureStore } from '@reduxjs/toolkit';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import sadgotchuSlice from 'src/redux/sadgotchuSlice.js';

// Créez une transformation qui assure que hunger et happiness ne sont jamais null.
const nonNullTransform = createTransform(
    (inboundState, key) => {
        // Pas de transformation à l'entrée
        return inboundState;
    },
    (outboundState, key) => {
        if (key === 'sadGotchu') {
            const { hunger, happiness } = outboundState;
            return {
                ...outboundState,
                hunger: hunger != null ? hunger : 50,
                happiness: happiness != null ? happiness : 50,
            };
        }
        return outboundState;
    },
    { whitelist: ['sadGotchu'] }
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