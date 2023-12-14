import { useEffect } from 'react';

const ResetCookie = () => {
    useEffect(() => {
        // Logique pour réinitialiser le cookie ici
        document.cookie = 'hasVisited=false; max-age=0'; // Réinitialise le cookie
        window.location.href = '/'; // Redirige vers la page d'accueil ou toute autre page nécessaire
    }, []);

    return <div>Réinitialisation du cookie...</div>;
};

export default ResetCookie;