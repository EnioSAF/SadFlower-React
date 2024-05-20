import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import SadGotchuService from '@/components/system32/applications/SadGotchu/SadGotchuService';
import {
    setName,
    incrementAge,
    setStage,
    adjustHunger,
    adjustHappiness,
    setTimeAtHundredHunger,
    setTimeAtZeroHappiness,
    togglePoop,
    setIsSick,
    setIsSleeping,
    setIsFinalStage,
    setEvolutionLine,
    adjustStateBasedOnTimeElapsed,
    resetSadGotchu,
    setSadGotchu
} from 'src/redux/sadgotchuSlice.js';
import { loadUserSadGotchu, updateSadGotchuAction, createSadGotchuAction, deleteSadGotchuAction } from 'src/redux/sadgotchuSlice.js';
import { evolutionTree, determineNextStage } from './EvolutionTree';

import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

    // Sprites pour chaque stade
    export const sprites = {
        oeuf: '/SadGotchu/tamas/egg(enio).png',
        bébé: '/SadGotchu/tamas/baby/baby(enio).png',
        enfant: '/SadGotchu/tamas/child/child(enio).png',
        adulteGood: '/SadGotchu/tamas/adult/adult(good-julie).png',
        adulteBad: '/SadGotchu/tamas/adult/adult(bad-enio).png',
        vieux: '/SadGotchu/tamas/old/old(enio-tama).png',
        ange: '/SadGotchu/tamas/death/gooddeath(enio).png',
        demon: '/SadGotchu/tamas/death/baddeath(enio).png',
    };

const TamagotchiCore = ({ currentMenu }) => {
    const dispatch = useDispatch();
    const {
        id,
        name,
        stage,
        age,
        evolutionLine,
        hunger,
        happiness,
        hasPoop,
        isSick,
        isSleeping,
        isFinalStage,
        timeAtHundredHunger,
        timeAtZeroHappiness,
    } = useSelector((state) => state.sadGotchu);

    const extraSprites = {
        sick: '/SadGotchu/tamas/other/sick.png',
        hungry: '/SadGotchu/tamas/other/hungry.png',
        poop: '/SadGotchu/tamas/other/poop.png',
    };

    const getAnimationClass = (stage) => {
        switch (stage) {
            case 'bébé':
                return 'animation-bebe';
            case 'adulteGood':
                return 'animation-adulte';
            // Ajoutez d'autres cas selon vos stages
            default:
                return ''; // Pas d'animation par défaut
        }
    };

    // FONCTION de Load / Save Strapi
    const [isLoading, setIsLoading] = useState(true); // Ajout d'un état pour le chargement
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Pour initialiser le SadGotchu si aucuns en localstorage
    useEffect(() => {
        const initializeSadGotchu = async () => {
            setIsLoading(true);
            const localSadGotchu = localStorage.getItem('sadGotchu');
            let sadGotchuData;
            if (localSadGotchu) {
                sadGotchuData = JSON.parse(localSadGotchu);
            } else {
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                sadGotchuData = await SadGotchuService.fetchSadGotchu(user.id);
                if (!sadGotchuData) {
                    sadGotchuData = await SadGotchuService.createSadGotchu(initialSadGotchuData(user.id));
                }
                localStorage.setItem('sadGotchu', JSON.stringify(sadGotchuData));
            }
            dispatch(setSadGotchu(sadGotchuData)); // Met à jour Redux store
            setIsLoading(false);
        };

        initializeSadGotchu();
    }, [dispatch]);

    // Pour load
    useEffect(() => {
        setIsLoading(true);  // Indiquer que le chargement est en cours
        async function fetchDataAndAdjustState() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                try {
                    // Charger les données utilisateur et attendre la fin de cette opération
                    var sadGotchuData = await loadUserSadGotchu({ userId: user.id, setDataLoaded: setDataLoaded });
                    dispatch(sadGotchuData);
                } catch (error) {
                } finally {
                    setIsLoading(false);
                    // setDataLoaded(true);    // Fin du chargement
                }
            } else {
                setIsLoading(false);  // Aucune donnée utilisateur, donc fin du chargement
            }
        }
        if (dataLoaded == false) {
            fetchDataAndAdjustState();
        }
    }, [dispatch, id, dataLoaded]);

    useEffect(() => {
        const adjustState = async () => {
            // Récupérer le temps de dernière interaction depuis Strapi
            const lastInteractionTime = parseFloat(await SadGotchuService.fetchLastInteractionTime(id));
            const currentTime = Date.now();
            const timeElapsed = currentTime - new Date(lastInteractionTime).getTime();
            // Ajuster l'état basé sur le temps écoulé
            dispatch(adjustStateBasedOnTimeElapsed(timeElapsed));
            // Mettre à jour le timestamp de la dernière interaction dans Strapi
            await SadGotchuService.updateLastInteractionTime(id, currentTime);

            setInitialLoadComplete(true);  // Signale que le chargement initial est complet
        }
        if (dataLoaded) {
            adjustState();
        }
    }, [dispatch, id, dataLoaded]);


    // Utilisation de useCallback pour définir handleSave
    const handleSave = useCallback(async () => {
        const currentSadGotchuState = {
            name,
            stage,
            age,
            evolutionLine,
            hunger,
            happiness,
            hasPoop,
            isSick,
            isSleeping,
            isFinalStage,
            timeAtHundredHunger,
            timeAtZeroHappiness,
        };

        if (id) {
            try {
                // Mise à jour du SadGotchu dans la base de données
                const updatedSadGotchuData = await updateSadGotchuAction({ id, changes: currentSadGotchuState });
                dispatch(updatedSadGotchuData);
                // Mise à jour du timestamp de la dernière interaction dans la base de données
                const currentTime = new Date().getTime();
                await SadGotchuService.updateLastInteractionTime(id, currentTime);
            } catch (error) {
                console.error("Erreur lors de la sauvegarde des changements de SadGotchu :", error);
            }
        }
    }, [
        dispatch,
        id,
        name,
        stage,
        age,
        evolutionLine,
        hunger,
        happiness,
        hasPoop,
        isSick,
        isSleeping,
        isFinalStage,
        timeAtHundredHunger,
        timeAtZeroHappiness
    ]);

    // useEffect pour la sauvegarde automatique et à la fermeture du composant
    useEffect(() => {
        const saveInterval = setInterval(handleSave, 60000); // Sauvegarder toutes les minutes

        // Ajouter l'écouteur d'événement beforeunload pour sauvegarder avant de quitter la page
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            event.returnValue = ''; // Chrome requiert returnValue à être défini
            await handleSave();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(saveInterval); // Arrêter l'intervalle de sauvegarde
            window.removeEventListener('beforeunload', handleBeforeUnload); // Retirer l'écouteur d'événement
            handleSave(); // Sauvegarde finale lors du démontage du composant
        };
    }, [handleSave]);

    // FONCTION d'interval / Check-Intéractions / Passage du temps

    // Simulation du temps qui passe
    useEffect(() => {
        const evolutionInterval = setInterval(() => {
            if (!isFinalStage || stage === 'oeuf') { // Assurez-vous que l'âge s'incrémente même pour l'œuf
                dispatch(incrementAge());

                // Utilise l'état actuel depuis Redux pour la logique d'évolution
                const evolutionResult = determineNextStage(stage, age, happiness, hunger, evolutionLine);
                if (evolutionResult) {
                    dispatch(setStage(evolutionResult.type)); // Dispatch l'action pour changer le stage
                    dispatch(setEvolutionLine(evolutionResult.evolutionLine)); // Dispatch l'action pour changer la ligne d'évolution
                    if (evolutionResult.type === 'ange' || evolutionResult.type === 'demon') {
                        dispatch(setIsFinalStage(true)); // Dispatch l'action pour marquer le stage final
                    }
                }
            }
        }, 86400000); // 24 heures en millisecondes pour simuler le passage d'un "jour" dans le jeu
        return () => clearInterval(evolutionInterval);
    }, [dispatch, stage, age, happiness, hunger, evolutionLine, isFinalStage]);

    // Ce useEffect gère la mise à jour régulière de la faim et du bonheur
    useEffect(() => {
        const needsUpdateInterval = setInterval(() => {
            const currentTime = Date.now();
            const currentNeedsUpdate = evolutionTree[stage]?.needsUpdate;
            if (currentNeedsUpdate && !isSleeping && !isFinalStage) {
                const hungerAdjustment = Math.round(currentNeedsUpdate.hungerIncrement);
                const happinessAdjustment = Math.round(-currentNeedsUpdate.happinessDecrement);
                dispatch(adjustHunger(hungerAdjustment));
                dispatch(adjustHappiness(happinessAdjustment));
            }

            // Si la faim est à 100 et que timeAtHundredHunger n'est pas défini, ou si le bonheur est à 0 et que timeAtZeroHappiness n'est pas défini,
            // enregistrez le timestamp actuel. Sinon, vérifiez si 12 heures se sont écoulées pour déclencher la mort.
            if (hunger === 100 && timeAtHundredHunger === 0) {
                dispatch(setTimeAtHundredHunger(currentTime));
            } else if (hunger < 100) {
                dispatch(setTimeAtHundredHunger(0));
            }

            if (happiness === 0 && timeAtZeroHappiness === 0) {
                dispatch(setTimeAtZeroHappiness(currentTime));
            } else if (happiness > 0) {
                dispatch(setTimeAtZeroHappiness(0));
            }

            // Vérifiez si 12 heures se sont écoulées depuis que la faim est à 100 ou le bonheur à 0
            if ((timeAtHundredHunger && currentTime - timeAtHundredHunger >= 12 * 3600000) ||
                (timeAtZeroHappiness && currentTime - timeAtZeroHappiness >= 12 * 3600000)) {
                dispatch(setStage('demon')); // Marquez comme mort
                dispatch(setIsFinalStage(true));
                dispatch(setTimeAtHundredHunger(0));
                dispatch(setTimeAtZeroHappiness(0));
            }

        }, evolutionTree[stage]?.needsUpdate.updateInterval);

        return () => clearInterval(needsUpdateInterval);
    }, [dispatch, stage, hunger, happiness, timeAtHundredHunger, timeAtZeroHappiness, isSleeping, isFinalStage]);

    // Pour nommer l'oeuf
    const showNameForm = useMemo(() => {
        return !isLoading && (!name && stage === 'oeuf');
    }, [isLoading, name, stage]);
    const [newName, setNewName] = useState('');

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        if (newName.trim()) {
            const userStr = localStorage.getItem('user');
            let userId;
            if (userStr) {
                const user = JSON.parse(userStr);
                userId = user.id;
            }

            if (!userId) {
                console.error('UserID est introuvable. Assurez-vous que l’utilisateur est connecté.');
                return;
            }

            // Tentative de charger un SadGotchu existant
            try {
                let sadGotchu = await SadGotchuService.fetchSadGotchu(userId);

                if (!sadGotchu) {
                    // Aucun SadGotchu existant, donc en créer un nouveau
                    const initialSadGotchuData = {
                        name: newName,
                        stage: 'oeuf',
                        age: 0,
                        evolutionLine: null,
                        hasPoop: false,
                        isSick: false,
                        hunger: 50,
                        happiness: 50,
                        timeAtHundredHunger: 0,
                        timeAtZeroHappiness: 0,
                        isSleeping: false,
                        isFinalStage: false,
                        users_permissions_user: userId,
                    };

                    sadGotchu = await SadGotchuService.createSadGotchu(initialSadGotchuData);
                } else {
                    // SadGotchu existant, mise à jour du nom uniquement
                    sadGotchu = await SadGotchuService.updateSadGotchu(sadGotchu.id, { ...sadGotchu, name: newName });
                }

                // Mettre à jour le store Redux avec le SadGotchu chargé ou créé
                dispatch(setSadGotchu(sadGotchu));
                setShowNameForm(false);
            } catch (error) {
                console.error('Erreur lors de la gestion du SadGotchu:', error);
            }
        }
    };

    // Fonction pour récupérer l'heure exacte de la dernière intéraction
    useEffect(() => {
        // Fonction exécutée lorsque le composant se démonte
        return () => {
            const currentTime = Date.now();
            localStorage.setItem('lastUpdateTime', currentTime.toString());
        };
    }, []);

    // FONCTIONS d'interaction
    const feed = () => {
        if (isSleeping || isFinalStage) return;
        dispatch(adjustHunger(-30));
        updateInteractionTime();
        const [min, max] = evolutionTree[stage].poopFrequency;
        setTimeout(() => dispatch(togglePoop(true)), Math.random() * (max - min) + min);
    };

    const play = () => {
        if (isSleeping || isFinalStage) return;
        dispatch(adjustHappiness(30));
        updateInteractionTime();
    };

    const updateInteractionTime = async () => {
        const currentTime = Date.now();
        await SadGotchuService.updateLastInteractionTime(id, currentTime);
    };
    // Ajoute d'autres fonctions

    // Pour les maladies et le caca
    useEffect(() => {
        const checkSickness = () => {
            // Vérifie aussi que le Tamagotchi n'est pas dans un état final
            if (evolutionTree[stage] && stage !== "ange" && stage !== "démon" && Math.random() < evolutionTree[stage].sicknessChance) {
                dispatch(setIsSick(true));
            }
        };
        const sicknessCheckInterval = setInterval(checkSickness, 3600000); // Toutes les heures
        return () => clearInterval(sicknessCheckInterval);
    }, [dispatch, stage]);

    // Utilisez useEffect pour surveiller hasPoop
    useEffect(() => {
        let sicknessTimer;
        let deathTimer;

        if (hasPoop) {
            // Démarrer un timer pour marquer comme malade si le "poop" n'est pas nettoyé en 1 heure
            sicknessTimer = setTimeout(() => {
                dispatch(setIsSick(true));

                // Démarrer un autre timer pour la mort si pas soigné en 24 heures
                deathTimer = setTimeout(() => {
                    if (isSick) { // Vérifier si toujours malade
                        dispatch(setStage('demon')); // Passer au stade "démon"
                    }
                }, 3600000 * 24); // 24 heures
            }, 3600000); // 1 heure
        }

        // Nettoyage : s'assurer d'annuler les timers si le composant est démonté ou si les conditions changent
        return () => {
            clearTimeout(sicknessTimer);
            clearTimeout(deathTimer);
        };
    }, [dispatch, hasPoop, isSick]);


    // Fonction pour déterminer si le Tamagotchi devrait être endormi
    const checkIfSleeping = (stage) => {
        const currentHour = new Date().getHours();
        const sleepStartTimes = { bébé: 19, enfant: 20, adulte: 23, vieux: 20 };
        const sleepEndTimes = { bébé: 7, enfant: 8, adulte: 10, vieux: 9 }; // Supposons que tous se réveillent à 8h pour simplifier

        const sleepStartTime = sleepStartTimes[stage] || 22;
        const sleepEndTime = sleepEndTimes[stage] || 8;

        if (currentHour >= sleepStartTime || currentHour < sleepEndTime) {
            return true; // Le Tamagotchi dort
        }
        return false; // Le Tamagotchi est éveillé
    };

// Mettre à jour l'état de sommeil en fonction du stade et de l'heure
useEffect(() => {
    const updateSleepStatus = () => {
        if (dataLoaded) {  // Ne met à jour que si les données sont complètement chargées
            const sleeping = checkIfSleeping(stage);
            dispatch(setIsSleeping(sleeping));
        }
    };

    updateSleepStatus(); // Appeler immédiatement au montage, mais seulement exécuté si les données sont chargées
    const interval = setInterval(updateSleepStatus, 60000); // Et ensuite toutes les minutes

    return () => clearInterval(interval); // Nettoyage à la désinscription
}, [dispatch, stage, dataLoaded]);  // Ajout de dataLoaded aux dépendances

    // Désactivation des boutons et ajustement des sprites si endormi
    const getSprite = () => {
        if (isSleeping) return `/SadGotchu/tamas/dodo.png`;

        let spritePath = sprites[stage]; // Utilisez le sprite par défaut en premier

        // Ajustez le chemin en fonction du bonheur
        if (happiness > 80) {
            spritePath = `/SadGotchu/tamas/happy/happy-${stage}.png`;
        } else if (happiness < 40 || hunger > 50) {
            spritePath = `/SadGotchu/tamas/sad/sad-${stage}.png`;
        }

        return spritePath;
    };


    return (
        <div className={styles.tamagotchiCore}>
            {showNameForm && (
                <form onSubmit={handleNameSubmit} className={styles.nameForm}>
                    <label htmlFor="sadGotchuName">Nomme ton SadGotchu :</label>
                    <input
                        id="sadGotchuName"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                    />
                    <button type="submit">Nommer</button>
                </form>
            )}
            {currentMenu === 'core' && (
                <>
                    <Image
                        src={getSprite()}
                        alt="Tamagotchi"
                        className={`${isSleeping ? styles.dodoSprite : ''} ${isSleeping ? '' : styles[getAnimationClass(stage)]}]}`}
                        width={isSleeping ? '800' : '447'}
                        height={isSleeping ? '500' : '360'}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {/* Conditionnellement rendre les extras basé sur isFinalStage */}
                    {!isFinalStage && (
                        <>
                            {isSick && <img src={extraSprites.sick} alt="Sick" className={styles.extraSpritesick} />}
                            {hunger > 50 && <img src={extraSprites.hungry} alt="Hungry" className={styles.extraSpritehungry} />}
                            {hasPoop && <img src={extraSprites.poop} alt="Poop" className={styles.extraSpritepoop} />}
                        </>
                    )}
                </>
            )}
            {currentMenu === 'stats' && (
                <div className={styles.tamagotchiMenu}>
                    <div className={styles.tamagotchiStats}>
                        <p>{name || 'SadGotchu'}</p>
                        <p>Stade: {stage}</p>
                        <p>Âge: {Math.floor(age)} ans</p>
                    </div>
                    {/* Afficher les stats uniquement si ce n'est pas le stage final */}
                    {!isFinalStage && stage !== 'oeuf' && !isSleeping && (
                        <div className={styles.statsContainer}>
                            <div className={styles.statItem}>
                                <p>Nourriture: </p>
                                <div className={styles.statBarContainer}>
                                    <div className={styles.statBar} style={{ width: `${100 - hunger}%` }}></div>
                                </div>
                            </div>
                            <div className={styles.statItem}>
                                <p>Bonheur: </p>
                                <div className={styles.statBarContainer}>
                                    <div className={styles.statBar} style={{ width: `${happiness}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {currentMenu === 'actions' && (
                <div className={styles.menuButtonsContainer}>
                    <div className={styles.menuButtonsGroup}>
                        <button className={styles.menuButtons} onClick={feed}>Nourrir</button>
                        <button className={styles.menuButtons} onClick={play}>Jouer</button>
                    </div>
                    <div className={styles.menuButtonsGroup}>
                        <button className={styles.menuButtons} onClick={() => dispatch(togglePoop(false))} disabled={!hasPoop || isFinalStage}>Nettoyer</button>
                        <button className={styles.menuButtons} onClick={() => dispatch(setIsSick(false))} disabled={!isSick || isFinalStage}>Soigner</button>
                    </div>
                    <div className={styles.menuButtonsReset}>
                        <button className={styles.menuButtonsReset} onClick={async () => {
                            if (window.confirm("Es-tu sûr de vouloir réinitialiser ton SadGotchu ?")) {
                                if (id) {
                                    await dispatch(deleteSadGotchuAction(id));
                                    localStorage.removeItem('persist:root');
                                    localStorage.removeItem('sadGotchu');
                                    window.location.reload();
                                }
                            }
                        }}>Réinitialiser</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default TamagotchiCore;