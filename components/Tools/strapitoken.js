import { AUTH_TOKEN, USER } from "./constant";

export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(AUTH_TOKEN);
    }
    return null;
};

export const setToken = (token) => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN, token);
    }
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem(USER));
};

export const setUser = (user) => {
    localStorage.setItem(USER, JSON.stringify({
        username: user.username,
        role : user.role,
    }));
};

export const removeToken = () => {
    localStorage.removeItem(AUTH_TOKEN);
};

export const removeUser = () => {
    localStorage.removeItem(USER);
};

