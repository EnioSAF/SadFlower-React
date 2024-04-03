import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import sadgotchuSlice from 'src/redux/sadgotchuSlice.js';

const persistConfig = {
    key: 'root',
    storage,
    serialize: true,
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