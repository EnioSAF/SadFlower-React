import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { API, AVATAR_API } from "/components/Tools/constant";

const Profiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/users`);
            const data = await response.json();
            setProfiles(data ?? []);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la récupération des profils !");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="row">
            {profiles.map((profile, index) => (
                <div className="col" key={`${profile.id}_${index}`}>
                    <div className="card">
                        <div className="card-body">
                            <img
                                className="profile-image"
                                src={
                                    profile.avatar_url ??
                                    `${AVATAR_API}?name=${profile.username}&background=1890ff&color=fff`
                                }
                                alt={profile.username}
                            />
                            <h5>{profile.username}</h5>
                            <p>{
                                profile.about
                                    ? (typeof profile.about === 'string' ? parse(profile.about) : JSON.stringify(profile.about))
                                    : 'Pas de description'
                            }</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Profiles;
