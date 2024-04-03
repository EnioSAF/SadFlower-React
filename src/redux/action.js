import { createAction } from '@reduxjs/toolkit';

// Action pour la persistance avec une valeur non-sérialisable
export const persistAction = createAction('persist/PERSIST', (register) => {
    return {
        payload: {
            register: register.toString(), // Convertit la fonction en chaîne de caractères
        },
    };
});
