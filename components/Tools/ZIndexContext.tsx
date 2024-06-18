import React, { createContext, useContext, useState, ReactNode } from 'react';

// Typage pour les valeurs du contexte
type ZIndexContextType = {
    bringToFront: () => number;
    handleClose: () => void;
};

const ZIndexContext = createContext<ZIndexContextType | undefined>(undefined);

// Typage pour les props du fournisseur
type ZIndexProviderProps = {
    children: ReactNode;
};

export const ZIndexProvider: React.FC<ZIndexProviderProps> = ({ children }) => {
    const [openWindows, setOpenWindows] = useState<number>(0);

    const bringToFront = (): number => {
        setOpenWindows(openWindows + 1);
        return openWindows + 1;
    };

    const handleClose = (): void => {
        setOpenWindows(openWindows - 1);
    };

    return (
        <ZIndexContext.Provider value={{ bringToFront, handleClose }}>
            {children}
        </ZIndexContext.Provider>
    );
};

export const useZIndex = (): ZIndexContextType => {
    const context = useContext(ZIndexContext);
    if (!context) {
        throw new Error('useZIndex must be used within a ZIndexProvider');
    }
    return context;
};
