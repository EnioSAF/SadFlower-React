import React, { useState } from "react";
import { AuthContext } from "/context/AuthContext";
import { API, BEARER } from "@/components/Tools/constant";
import { getToken } from "@/components/Tools/strapitoken";

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const authToken = getToken();

    const fetchLoggedInUser = async (token) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/users/me`, {
                headers: { Authorization: `${BEARER} ${token}` },
            });
            const data = await response.json();

            setUserData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUser = (user) => {
        setUserData(user);
    };

    // useEffect(() => {
    //     if (authToken) {
    //         fetchLoggedInUser(authToken);
    //     }
    // }, [authToken]);

    return (
        <AuthContext.Provider
            value={{ user: userData, setUser: handleUser, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;