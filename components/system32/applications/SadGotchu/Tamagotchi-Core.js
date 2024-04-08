import React, { useEffect, useState } from 'react';
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
import { loadUserSadGotchu, updateSadGotchuAction, createSadGotchuAction } from 'src/redux/sadgotchuSlice.js';
import { evolutionTree, determineNextStage } from './EvolutionTree';

import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

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

    // Sprites pour chaque stade
    const sprites = {
        oeuf: '/SadGotchu/tamas/egg(enio).png',
        bébé: '/SadGotchu/tamas/baby/baby(enio).png',
        enfant: '/SadGotchu/tamas/child/child(enio).png',
        adulteGood: '/SadGotchu/tamas/adult/adult(good-julie).png',
        adulteBad: '/SadGotchu/tamas/adult/adult(bad-enio).png',
        vieux: '/SadGotchu/tamas/old/old(enio-tama).png',
        ange: '/SadGotchu/tamas/death/gooddeath(enio).png',
        demon: '/SadGotchu/tamas/death/baddeath(enio).png',
    };

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

    // Pour load
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const userId = user.id;
            if (userId) {
                console.log('UserID avant dispatch:', userId);
                dispatch(loadUserSadGotchu(userId));
            }
        }
    }, [dispatch]);

    // useEffect pour sauvegarder les changements de SadGotchu
    useEffect(() => {
        const handleSave = async () => {
            // Obtenez l'état actuel de SadGotchu depuis le store Redux
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
                // incluez d'autres propriétés de l'état que vous voulez sauvegarder
            };

            // Supposons que votre store Redux maintient un champ `id` pour l'identification de SadGotchu
            if (id) {
                dispatch(updateSadGotchuAction({ id, changes: currentSadGotchuState })).unwrap();
            }
        };

        // Ici, vous devez décider quand appeler handleSave.
        // Par exemple, si vous voulez sauvegarder chaque fois que l'utilisateur nourrit SadGotchu ou joue avec,
        // vous pourriez ajouter `hunger` et `happiness` comme dépendances de useEffect.
        // Ajustez selon vos besoins.
        handleSave();
    }, [dispatch, hunger, happiness, id]); // Incluez toutes les dépendances pertinentes ici

    // Pour nommer l'oeuf
    const [showNameForm, setShowNameForm] = useState(!name && stage === 'oeuf');
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

    // FONCTION d'interval / Check-Intéractions / Passage du temps

    // Pour update les states depuis la dernière intéraction
    useEffect(() => {
        // Récupérer le timestamp de la dernière interaction depuis localStorage
        const lastInteractionTime = localStorage.getItem('lastInteractionTime') || Date.now();
        const currentTime = Date.now();
        const timeElapsed = currentTime - parseInt(lastInteractionTime);

        // Ajuster l'état basé sur le temps écoulé
        dispatch(adjustStateBasedOnTimeElapsed(timeElapsed));

        // Mise à jour du timestamp de la dernière interaction
        localStorage.setItem('lastInteractionTime', currentTime.toString());
    }, [dispatch]);

    // Simulation du temps qui passe
    useEffect(() => {
        const evolutionInterval = setInterval(() => {
            if (!isFinalStage) {
                dispatch(incrementAge());

                // Utilise l'état actuel depuis Redux pour la logique d'évolution
                // Note : Tu dois obtenir age, stage, etc., via useSelector au début de ton composant.
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

    // Fonctions d'interaction
    const feed = () => {
        if (isSleeping || isFinalStage) return;
        dispatch(adjustHunger(-30));
        const [min, max] = evolutionTree[stage].poopFrequency;
        setTimeout(() => dispatch(togglePoop(true)), Math.random() * (max - min) + min);
    };

    const play = () => {
        if (isSleeping || isFinalStage) return;
        dispatch(adjustHappiness(30)); // De même ici
    };
    // Ajoute d'autres fonctions comme jouer ou dormir ici

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
            const sleeping = checkIfSleeping(stage);
            dispatch(setIsSleeping(sleeping));
        };

        updateSleepStatus();
        const interval = setInterval(updateSleepStatus, 60000);

        return () => clearInterval(interval);
    }, [dispatch, stage]);

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

    // Fonctin pour récupérer l'heure exacte de la dernière intéraction
    useEffect(() => {
        // Fonction exécutée lorsque le composant se démonte
        return () => {
            const currentTime = Date.now();
            localStorage.setItem('lastUpdateTime', currentTime.toString());
        };
    }, []);

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
                        <p>Âge: {age} ans</p>
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
                        <button className={styles.menuButtonsReset} onClick={() => {
                            if (window.confirm("Es-tu sûr de vouloir réinitialiser ton SadGotchu ?")) {
                                dispatch(resetSadGotchu());
                                setShowNameForm(true); // Remarque : Assurez-vous que la logique pour setShowNameForm est gérée correctement dans votre composant
                            }
                        }}>Réinitialiser</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default TamagotchiCore;