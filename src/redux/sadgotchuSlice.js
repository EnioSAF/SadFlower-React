import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SadGotchuService from '@/components/system32/applications/SadGotchu/SadGotchuService';
import { evolutionTree, determineNextStage } from '@/components/system32/applications/SadGotchu/EvolutionTree';

// TODO VERIFIER VALEUR AGE STRAPI FLOAT (décimales) - VERIFIER MOMENT SAUVEGARDE - VERIFIER MOMENT SetIsSleeping

// FONCTION d'ajustement du temps basé sur la dernière interaction
export const adjustStateBasedOnTimeElapsed = createAsyncThunk(
    'sadgotchu/adjustStateBasedOnTimeElapsed',
    async (timeElapsed, { getState, dispatch }) => {
        const state = getState().sadGotchu;
        let { stage, hunger, happiness, age, timeAtHundredHunger, timeAtZeroHappiness, isFinalStage, evolutionLine } = state;

        if (['ange', 'demon'].includes(stage)) {
            return;
        }
        const timeInMinutes = timeElapsed / 60000; // Convertir le temps écoulé en minutes
        const ageIncrement = timeInMinutes / 1440; // Convertir les minutes en jours fractionnaires

        // Incrémenter l'âge de façon fractionnaire
        dispatch(incrementAgeBy(ageIncrement));
        const stageConfig = evolutionTree[stage];

        if (stageConfig?.needsUpdate) {
            const { hungerIncrement, happinessDecrement, updateInterval } = stageConfig.needsUpdate;
            let adjustedHunger = Math.min(100, Math.max(0, hunger + (hungerIncrement * timeInMinutes / (updateInterval / 60000))));
            let adjustedHappiness = Math.max(0, Math.min(100, happiness - (happinessDecrement * timeInMinutes / (updateInterval / 60000))));

            // Dispatch seulement si les valeurs sont valides
            if (!isNaN(adjustedHunger)) {
                dispatch(adjustHunger(adjustedHunger - hunger));
            }
            if (!isNaN(adjustedHappiness)) {
                dispatch(adjustHappiness(adjustedHappiness - happiness));
            }
        }

        // Vérifiez si le Tamagotchi devrait évoluer
        const evolutionResult = determineNextStage(stage, age, happiness, hunger, evolutionLine);
        if (evolutionResult) {
            dispatch(setStage(evolutionResult.type));
            if (evolutionResult.evolutionLine) {
                dispatch(setEvolutionLine(evolutionResult.evolutionLine));
            }
        }

        // Gérer la mort et les états de faim et de bonheur
        handleStateBasedOnThresholds(dispatch, {
            hunger, happiness, currentTime: Date.now(), timeAtHundredHunger, timeAtZeroHappiness, isFinalStage
        });

        if (isFinalStage) {
            dispatch(setIsFinalStage(true));
        }
    }
);

function handleStateBasedOnThresholds(dispatch, { hunger, happiness, currentTime, timeAtHundredHunger, timeAtZeroHappiness, isFinalStage }) {
    const deathByHungerThreshold = 12 * 60 * 60 * 1000; // 12 heures en millisecondes
    const deathByUnhappinessThreshold = 12 * 60 * 60 * 1000;

    if (hunger === 100 && (!timeAtHundredHunger || currentTime - timeAtHundredHunger >= deathByHungerThreshold)) {
        dispatch(setStage('demon'));
        isFinalStage = true;
    } else if (happiness === 0 && (!timeAtZeroHappiness || currentTime - timeAtZeroHappiness >= deathByUnhappinessThreshold)) {
        dispatch(setStage('demon'));
        isFinalStage = true;
    }

    // Assurer la mise à jour de timeAtHundredHunger et timeAtZeroHappiness
    if (hunger === 100 && !timeAtHundredHunger) {
        dispatch(setTimeAtHundredHunger(currentTime));
    } else if (hunger < 100) {
        dispatch(setTimeAtHundredHunger(0));
    }

    if (happiness === 0 && !timeAtZeroHappiness) {
        dispatch(setTimeAtZeroHappiness(currentTime));
    } else if (happiness > 0) {
        dispatch(setTimeAtZeroHappiness(0));
    }
}

// Actions pour Strapi
export const loadUserSadGotchu = createAsyncThunk(
    'sadgotchu/loadUserSadGotchu',
    async ({ userId, setDataLoaded }, { dispatch }) => {
        try {
            const sadGotchu = await SadGotchuService.fetchSadGotchu(userId);
            if (sadGotchu) {
                // Ce dispatch met à jour l'état immédiatement, ce qui est bien.
                dispatch(setSadGotchu(sadGotchu));

                // Mais pour que le reducer de fulfilled fonctionne comme tu l'attends, tu dois aussi retourner sadGotchu ici.
                setDataLoaded(true)
                return sadGotchu; // Assure-toi que c'est la structure attendue.
            }
        } catch (error) {
            console.error("Erreur lors du chargement du SadGotchu:", error);
            throw error; // Propage l'erreur pour que le thunk puisse la traiter.
        }
    }
);

export const updateSadGotchuAction = createAsyncThunk(
    'sadgotchu/update',
    async ({ id, changes }, { rejectWithValue }) => {
        try {
            const data = await SadGotchuService.updateSadGotchu(id, changes);
            return data;
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const createSadGotchuAction = createAsyncThunk(
    'sadgotchu/create',
    async (sadGotchuData, { rejectWithValue }) => {
        try {
            const data = await SadGotchuService.createSadGotchu(sadGotchuData);
            return data;
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

// Création de la slice pour le SadGotchu
export const sadgotchuSlice = createSlice({
    name: 'SadGotchu',
    initialState: {
        id: null,
        name: "",
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
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        incrementAge: (state) => {
            state.age += 1;
        },
        setStage: (state, action) => {
            state.stage = action.payload;
            state.isFinalStage = ['ange', 'demon'].includes(action.payload);
        },
        setEvolutionLine: (state, action) => {
            state.evolutionLine = action.payload;
        },
        togglePoop: (state) => {
            state.hasPoop = !state.hasPoop;
        },
        setIsSick: (state, action) => {
            state.isSick = action.payload;
        },
        adjustHunger: (state, action) => {
            const newHunger = Math.round(state.hunger + action.payload);
            state.hunger = Math.min(100, Math.max(0, newHunger));
        },
        adjustHappiness: (state, action) => {
            const newHappiness = Math.round(state.happiness + action.payload);
            state.happiness = Math.min(100, Math.max(0, newHappiness));
        },
        setTimeAtHundredHunger: (state, action) => {
            state.timeAtHundredHunger = action.payload;
        },
        setTimeAtZeroHappiness: (state, action) => {
            state.timeAtZeroHappiness = action.payload;
        },
        setIsSleeping: (state, action) => {
            state.isSleeping = action.payload;
        },
        setIsFinalStage: (state, action) => {
            state.isFinalStage = action.payload;
        },
        incrementAgeBy: (state, action) => {
            let updatedAge = parseFloat((state.age + action.payload).toFixed(12)); // Utiliser toFixed(12) pour contrôler la précision
            state.age = updatedAge;
        },
        resetSadGotchu: (state) => {
            state.name = "";
            state.stage = 'oeuf';
            state.age = 0;
            state.evolutionLine = null;
            state.hasPoop = false;
            state.isSick = false;
            state.hunger = 50;
            state.happiness = 50;
            state.timeAtHundredHunger = 0;
            state.timeAtZeroHappiness = 0;
            state.isSleeping = false;
            state.isFinalStage = false;
        },
        setSadGotchu: (state, action) => {
            const { data } = action.payload;
            if (data) {
                const { id, attributes } = data;
                if (attributes) {
                    const {
                        name,
                        stage,
                        age,
                        evolutionLine,
                        hunger,
                        happiness,
                        timeAtHundredHunger,
                        timeAtZeroHappiness,
                        isSleeping,
                        isFinalStage,
                    } = attributes;

                    // Met à jour l'état avec les valeurs extraites
                    state.id = id;
                    state.name = name;
                    state.stage = stage;
                    state.age = parseFloat(attributes.age);
                    state.evolutionLine = evolutionLine;
                    state.hunger = parseInt(hunger, 10);
                    state.happiness = happiness ? parseInt(happiness, 10) : state.happiness;
                    state.timeAtHundredHunger = parseInt(timeAtHundredHunger, 10);
                    state.timeAtZeroHappiness = parseInt(timeAtZeroHappiness, 10);
                    state.isSleeping = isSleeping;
                    state.isFinalStage = isFinalStage;
                    // Assurez-vous de mettre à jour tous les champs nécessaires
                }
            }
        },
        // Ajoute ici d'autres reducers selon les actions que ton Tamagotchi peut entreprendre
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUserSadGotchu.fulfilled, (state, action) => {
                // Assure-toi que l'action.payload contient l'objet attendu
                if (action.payload) {
                    const { id, attributes } = action.payload;
                    if (attributes) {
                        // Déstructuration des attributs pour mise à jour de l'état
                        const {
                            name,
                            stage,
                            age,
                            evolutionLine,
                            hasPoop,
                            isSick,
                            hunger,
                            happiness,
                            timeAtHundredHunger,
                            timeAtZeroHappiness,
                            isSleeping,
                            isFinalStage,
                            // ajoute ici d'autres champs selon le besoin
                        } = attributes;

                        // Mise à jour de l'état avec les nouvelles valeurs
                        Object.assign(state, {
                            id,
                            name,
                            stage,
                            age: parseFloat(attributes.age), // S'assurer que les valeurs numériques sont correctement traitées
                            evolutionLine,
                            hasPoop,
                            isSick,
                            hunger: parseInt(hunger, 10),
                            happiness: parseInt(happiness, 10),
                            timeAtHundredHunger: parseInt(timeAtHundredHunger, 10),
                            timeAtZeroHappiness: parseInt(timeAtZeroHappiness, 10),
                            isSleeping,
                            isFinalStage,
                        });
                    }
                }
            })
            .addCase(createSadGotchuAction.fulfilled, (state, action) => {
                // Gérer le SadGotchu créé
            })
            .addCase(updateSadGotchuAction.fulfilled, (state, action) => {
                // Gérer le SadGotchu mis à jour
            });
    },
});

// Action creators sont générés pour chaque cas de reducer
export const {
    setName,
    incrementAge,
    setStage,
    setEvolutionLine,
    togglePoop,
    setIsSick,
    adjustHunger,
    adjustHappiness,
    setTimeAtHundredHunger,
    setTimeAtZeroHappiness,
    setIsSleeping,
    setIsFinalStage,
    incrementAgeBy,
    resetSadGotchu,
    setSadGotchu,
    // Exporte d'autres actions ici...
} = sadgotchuSlice.actions;

export default sadgotchuSlice.reducer;