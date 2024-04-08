import { API } from "components/Tools/SignInOut/constant.js"

const SADGOTCHU_ENDPOINT = `${API}/sad-gotchus`; // Endpoint de votre collection SadGotchu

const getToken = () => localStorage.getItem('authToken'); // Assurez-vous que cela correspond à la manière dont vous stockez votre token

const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});

const SadGotchuService = {
    // Récupérer le SadGotchu d'un utilisateur
    fetchSadGotchu: async (userId) => {
        console.log('fetchSadGotchu avec userID:', userId);
        try {
            const response = await fetch(`${SADGOTCHU_ENDPOINT}?filters[users_permissions_user][id][$eq]=${userId}`, {
                method: 'GET',
                headers: headers(),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération du SadGotchu");
            }
            const data = await response.json();
            return data.data[0]; // Supposant que l'utilisateur ne peut avoir qu'un seul SadGotchu
        } catch (error) {
            console.error("Erreur dans fetchSadGotchu:", error);
            throw error;
        }
    },

    // Créer un nouveau SadGotchu pour un utilisateur
    createSadGotchu: async (sadGotchuData) => {
        try {
            const response = await fetch(SADGOTCHU_ENDPOINT, {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify({ data: sadGotchuData }),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la création du SadGotchu");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur dans createSadGotchu:", error);
            throw error;
        }
    },

    // Mettre à jour un SadGotchu existant
    updateSadGotchu: async (sadGotchuId, sadGotchuData) => {
        try {
            const response = await fetch(`${SADGOTCHU_ENDPOINT}/${sadGotchuId}`, {
                method: 'PUT',
                headers: headers(),
                body: JSON.stringify({ data: sadGotchuData }),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du SadGotchu");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur dans updateSadGotchu:", error);
            throw error;
        }
    },
};

export default SadGotchuService;
