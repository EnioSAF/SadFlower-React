import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

import { setName, incrementAge, setStage, adjustHunger, adjustHappiness, setTimeAtHundredHunger, setTimeAtZeroHappiness, togglePoop, setIsSick, setIsSleeping, setIsFinalStage, setEvolutionLine, adjustStateBasedOnTimeElapsed, resetSadGotchu } from 'src/redux/sadgotchuSlice.js';
import { evolutionTree, determineNextStage } from './EvolutionTree';

const TamagotchiCore = ({ toggleView, isMenuVisible }) => {
    const dispatch = useDispatch();
    const {
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

    // Pour nommer l'oeuf
    const [showNameForm, setShowNameForm] = useState(!name && stage === 'oeuf');
    const [newName, setNewName] = useState('');
    // Gère la soumission du formulaire
    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (newName.trim()) {
            dispatch(setName(newName));
            setShowNameForm(false); // Cache le formulaire après la soumission
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
        const sleepStartTimes = { bébé: 19, enfant: 20, adulte: 22, vieux: 20 };
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

    // FONCTION pour récupérer l'heure exacte de la dernière intéraction
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
            {!isMenuVisible ? (
                <>
                    <Image
                        src={getSprite()}
                        alt="Tamagotchi"
                        className={`${isSleeping ? styles.dodoSprite : ''} ${getAnimationClass(stage)}`}
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
            ) : (
                <div className={styles.tamagotchiMenu}>
                    <p>{name || 'SadGotchu'}</p>
                    <p>Stade: {stage}</p>
                    <p>Âge: {age} ans</p>
                    {/* Afficher les stats uniquement si ce n'est pas le stage final */}
                    {!isFinalStage && stage !== 'oeuf' && !isSleeping && (
                        <>
                            <p>Faim: {hunger}%</p>
                            <p>Bonheur: {happiness}%</p>
                            <div className={styles.menuButtons}>
                                <button onClick={feed}>Nourrir</button>
                                <button onClick={play}>Jouer</button>
                                <button onClick={() => dispatch(togglePoop(false))} disabled={!hasPoop || isFinalStage}>Nettoyer</button>
                                <button onClick={() => dispatch(setIsSick(false))} disabled={!isSick || isFinalStage}>Soigner</button>
                                <button onClick={() => {
                                    if (window.confirm("Es-tu sûr de vouloir réinitialiser ton SadGotchu ?")) {
                                        dispatch(resetSadGotchu());
                                        setShowNameForm(true);
                                    }
                                }}>Réinitialiser</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TamagotchiCore;