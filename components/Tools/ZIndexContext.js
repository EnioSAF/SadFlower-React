import React, { createContext, useContext, useState } from 'react';

const ZIndexContext = createContext();

export const ZIndexProvider = ({ children }) => {
    const [openWindows, setOpenWindows] = useState(0);

    const bringToFront = () => {
        setOpenWindows(openWindows + 1); // Incrémente le nombre de fenêtres ouvertes
        return openWindows + 1; // Retourne le nouveau Z-Index
    };

    const handleClose = () => {
        setOpenWindows(openWindows - 1); // Décrémente le nombre de fenêtres ouvertes quand une est fermée
    };

    return (
        <ZIndexContext.Provider value={{ bringToFront, handleClose }}>
            {children}
        </ZIndexContext.Provider>
    );
};

export const useZIndex = () => useContext(ZIndexContext);