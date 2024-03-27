import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from "styles/system32/applications/SadGotchu/tamagotchi.module.sass";

import { evolutionTree, determineNextStage } from './EvolutionTree';

const TamagotchiCore = ({ toggleView, isMenuVisible }) => {
    const savedState = JSON.parse(localStorage.getItem('tamagotchiState')) || {};
    const [stage, setStage] = useState(savedState.stage || 'oeuf');
    const [age, setAge] = useState(savedState.age || 0);
    const [evolutionLine, setEvolutionLine] = useState(savedState.evolutionLine || null);
    const [hasPoop, setHasPoop] = useState(false);
    const [isSick, setIsSick] = useState(false);
    const [hunger, setHunger] = useState(savedState.hunger || 50);
    const [happiness, setHappiness] = useState(savedState.happiness || 50);
    const [timeAtHundredHunger, setTimeAtHundredHunger] = useState(savedState.timeAtHundredHunger || 0);
    const [timeAtZeroHappiness, setTimeAtZeroHappiness] = useState(savedState.timeAtZeroHappiness || 0);
    const [isSleeping, setIsSleeping] = useState(false);
    const [isFinalStage, setIsFinalStage] = useState(false);


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

    useEffect(() => {
        const evolutionInterval = setInterval(() => {
            setAge(prevAge => prevAge + 1); // Simule le passage d'un an

            // Determine la prochaine étape d'évolution basée sur l'âge, le bonheur, la faim, et la ligne d'évolution ainsi que la fin d'évolution
            const evolutionResult = determineNextStage(stage, age, happiness, hunger, evolutionLine);
            if (evolutionResult) {
                setStage(evolutionResult.type); // Mise à jour du stade
                setEvolutionLine(evolutionResult.evolutionLine); // Mise à jour de la ligne d'évolution
                if (evolutionResult.type === 'ange' || evolutionResult.type === 'demon') {
                    setIsFinalStage(true);
                }
            }

        }, 60000); // Simule le passage d'un an toutes les minutes

        return () => clearInterval(evolutionInterval);
    }, [stage, age, evolutionLine, hunger, happiness, timeAtHundredHunger, timeAtZeroHappiness, isSleeping]);

    // Ce useEffect gère la mise à jour régulière de la faim et du bonheur
    useEffect(() => {
        const needsUpdateInterval = setInterval(() => {
            const currentNeedsUpdate = evolutionTree[stage]?.needsUpdate;
            if (currentNeedsUpdate && !isSleeping && !isFinalStage) { // Ne met à jour la faim et le bonheur que si le Tamagotchi n'est pas endormi
                setHunger((prevHunger) => {
                    const newHunger = Math.min(100, prevHunger + currentNeedsUpdate.hungerIncrement);
                    return newHunger;
                });
                setHappiness((prevHappiness) => {
                    const newHappiness = Math.max(0, prevHappiness - currentNeedsUpdate.happinessDecrement);
                    return newHappiness;
                });
            }

            // Cette partie s'exécute indépendamment du sommeil pour vérifier l'évolution
            if (timeAtHundredHunger >= 12 || timeAtZeroHappiness >= 12) {
                setStage('demon');
                setTimeAtHundredHunger(0);
                setTimeAtZeroHappiness(0);
            }
        }, evolutionTree[stage]?.needsUpdate.updateInterval);

        return () => clearInterval(needsUpdateInterval);
    }, [stage, timeAtHundredHunger, timeAtZeroHappiness, isSleeping, isFinalStage]); // Dépendance à `stage`, `timeAtZeroHunger`, et `timeAtZeroHappiness`
    // Fonctions d'interaction
    const feed = () => {
        if (isSleeping || stage === 'ange' || stage === 'demon') return; // Ne nourrissez pas si endormi ou si au stade final
        setHunger(Math.max(0, hunger - 20));
        // Planification du "poop"
        const [min, max] = evolutionTree[stage].poopFrequency;
        setTimeout(() => setHasPoop(true), Math.random() * (max - min) + min);
    };
    const play = () => isSleeping ? null : setHappiness(Math.min(100, happiness + 20));
    // Ajoute d'autres fonctions comme jouer ou dormir ici
    useEffect(() => {
        const checkSickness = () => {
            if (Math.random() < evolutionTree[stage].sicknessChance) setIsSick(true);
        };
        const sicknessCheckInterval = setInterval(checkSickness, 3600000); // Toutes les heures
        return () => clearInterval(sicknessCheckInterval);
    }, [stage]);
    // Sauvegarde de l'état actuel dans le localStorage
    useEffect(() => {
        const saveState = () => {
            const stateToSave = {
                stage,
                age,
                evolutionLine,
                hunger,
                happiness,
                timeAtHundredHunger,
                timeAtZeroHappiness,
                lastUpdate: Date.now()
            };
            localStorage.setItem('tamagotchiState', JSON.stringify(stateToSave));
        };

        window.addEventListener('beforeunload', saveState);

        return () => {
            window.removeEventListener('beforeunload', saveState);
            saveState(); // Assurez-vous de sauvegarder lorsque le composant est démonté
        };
    }, [stage, age, evolutionLine, hunger, happiness, timeAtHundredHunger, timeAtZeroHappiness]);

    // Fonction pour déterminer si le Tamagotchi devrait être endormi
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
            setIsSleeping(sleeping);
        };

        updateSleepStatus();
        // Vérifier toutes les minutes si l'état de sommeil doit être mis à jour
        const interval = setInterval(updateSleepStatus, 60000);

        return () => clearInterval(interval);
    }, [stage]);

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


    // Restauration de l'état à partir du localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('tamagotchiState');
        if (savedState) {
            const {
                stage: savedStage,
                age: savedAge,
                evolutionLine: savedEvolutionLine,
                hunger: savedHunger,
                happiness: savedHappiness,
                timeAtHundredHunger: savedTimeAtHundredHunger,
                timeAtZeroHappiness: savedTimeAtZeroHappiness,
                lastUpdate
            } = JSON.parse(savedState);
            const currentTime = Date.now();
            const timeElapsed = (currentTime - lastUpdate) / 60000; // Converti en minutes

            // Ajustez ici l'âge, la faim, le bonheur, etc., en fonction du temps écoulé
            // Note : Assurez-vous de définir une fonction pour calculer ces ajustements basée sur `timeElapsed`
            // Fonction pour ajuster l'âge en fonction du temps écoulé
            const calculateAgeAdjustment = (timeElapsed) => {
                // Arrondir à l'entier le plus proche pour l'âge
                return Math.round(timeElapsed / 60); // Si 1 heure réelle correspond à 1 an dans le jeu
            };
            // Fonction pour ajuster la faim en fonction du temps écoulé
            const calculateHungerAdjustment = (hunger, timeElapsed) => {
                // Assurer que la faim ne dépasse jamais 100 et est arrondie
                return Math.min(100, Math.round(hunger + timeElapsed));
            };
            // Fonction pour ajuster le bonheur en fonction du temps écoulé
            const calculateHappinessAdjustment = (happiness, timeElapsed) => {
                // Assurer que le bonheur ne tombe jamais en dessous de 0 et est arrondi
                return Math.max(0, Math.round(happiness - timeElapsed));
            };
            // Ajuste le compteur pour le temps passé à 100% de faim basé sur le temps écoulé.
            const calculateTimeAtHundredHungerAdjustment = (timeAtHundredHunger, hunger, timeElapsed) => {
                if (hunger === 100) {
                    // Si la faim est à 100%, ajoute le temps écoulé au compteur existant.
                    return timeAtHundredHunger + timeElapsed;
                } else {
                    // Si la faim n'est pas à 100%, réinitialise le compteur.
                    return 0;
                }
            };
            // Ajuste le compteur pour le temps passé à 0% de bonheur basé sur le temps écoulé.
            const calculateTimeAtZeroHappinessAdjustment = (timeAtZeroHappiness, happiness, timeElapsed) => {
                if (happiness === 0) {
                    // Si le bonheur est à 0%, ajoute le temps écoulé au compteur existant.
                    return timeAtZeroHappiness + timeElapsed;
                } else {
                    // Si le bonheur n'est pas à 0%, réinitialise le compteur.
                    return 0;
                }
            };
            setStage(savedStage);
            setAge(savedAge + calculateAgeAdjustment(timeElapsed));
            setEvolutionLine(savedEvolutionLine);
            setHunger(calculateHungerAdjustment(savedHunger, timeElapsed));
            setHappiness(calculateHappinessAdjustment(savedHappiness, timeElapsed));
            setTimeAtHundredHunger(calculateTimeAtHundredHungerAdjustment(savedTimeAtHundredHunger, timeElapsed));
            setTimeAtZeroHappiness(calculateTimeAtZeroHappinessAdjustment(savedTimeAtZeroHappiness, timeElapsed));
        }
    }, []);


    return (
        <div className={styles.tamagotchiCore}>
            {!isMenuVisible ? (
                <>
                    <Image
                        src={getSprite()}
                        alt="Tamagotchi"
                        className={`${isSleeping ? styles.dodoSprite : ''} ${styles[getAnimationClass(stage)]}`}
                        width={isSleeping ? '800' : '447'}
                        height={isSleeping ? '500' : '360'}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    {isSick && <img src={extraSprites.sick} alt="Sick" className={styles.extraSpritesick} />}
                    {hunger > 50 && <img src={extraSprites.hungry} alt="Hungry" className={styles.extraSpritehungry} />}
                    {hasPoop && <img src={extraSprites.poop} alt="Poop" className={styles.extraSpritepoop} />}
                </>
            ) : (
                <div className={styles.tamagotchiMenu}>
                    <p>Stade: {stage}</p>
                    <p>Âge: {age} ans</p>
                    {stage !== 'oeuf' && !isSleeping && (
                        <>
                            <p>Faim: {hunger}%</p>
                            <p>Bonheur: {happiness}%</p>
                            {!isFinalStage && (
                                <div className={styles.menuButtons}>
                                    <button onClick={feed} disabled={isSleeping}>Nourrir</button>
                                    <button onClick={play} disabled={isSleeping}>Jouer</button>
                                    <button onClick={() => setHasPoop(false)} disabled={!hasPoop}>Nettoyer</button>
                                    <button onClick={() => setIsSick(false)} disabled={!isSick}>Soigner</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TamagotchiCore;