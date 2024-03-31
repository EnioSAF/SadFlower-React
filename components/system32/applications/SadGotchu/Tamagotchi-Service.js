import { API, BEARER, AUTH_TOKEN, USER } from "@/components/Tools/SignInOut/constant";

const API_URL = `${API}/sadgotchus`;

// Utilise localStorage ou une méthode de ton choix pour récupérer le token et l'ID de l'utilisateur
function getUserToken() {
    return localStorage.getItem(AUTH_TOKEN); // Assure-toi que ton token est bien stocké ici lors de la connexion
}

function getUserId() {
    const user = JSON.parse(localStorage.getItem(USER)); // Si tu stockes les infos de l'utilisateur dans localStorage
    return user?.id; // Assure-toi que l'ID est bien présent dans ce que tu stockes
}

export async function fetchTamagotchiData() {
    const userToken = getUserToken();
    const userId = getUserId();
    const response = await fetch(`${API_URL}/${userId}`, {
        headers: {
            Authorization: `${BEARER} ${userToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Problème lors de la récupération des données du Tamagotchi');
    }
    return response.json();
}

export async function updateTamagotchiData(data) {
    const userToken = getUserToken();
    const userId = getUserId();
    const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${BEARER} ${userToken}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Problème lors de la mise à jour des données du Tamagotchi');
    }
    return response.json();
}
