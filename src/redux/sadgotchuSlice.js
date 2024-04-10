import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SadGotchuService from '@/components/system32/applications/SadGotchu/SadGotchuService';
import { evolutionTree } from '@/components/system32/applications/SadGotchu/EvolutionTree';


// FONCTION d'ajustement du temps basé sur la dernière interaction
export const adjustStateBasedOnTimeElapsed = createAsyncThunk(
    'sadgotchu/adjustStateBasedOnTimeElapsed',
    async (timeElapsed, { getState, dispatch }) => {
        const state = getState().sadGotchu;
        let { stage, hunger, happiness, age, timeAtHundredHunger, timeAtZeroHappiness, isFinalStage } = state;

        if (['ange', 'demon', 'oeuf'].includes(stage)) {
            console.log('Pas d’ajustement nécessaire pour le stade final ou initial.');
            return;
        }
        console.log(`Début adjustStateBasedOnTimeElapsed avec timeElapsed: ${timeElapsed}`);
        console.log(`État initial - stage: ${stage}, hunger: ${hunger}, happiness: ${happiness}, age: ${age}, timeAtHundredHunger: ${timeAtHundredHunger}, timeAtZeroHappiness: ${timeAtZeroHappiness}`);

        const timeInMinutes = timeElapsed / 60000; // Convertir le temps écoulé en minutes
        const daysElapsed = Math.floor(timeInMinutes / 1440); // Convertir les minutes en jours (1440 minutes par jour)
        const stageConfig = evolutionTree[stage];
        hunger = hunger ?? 50; // Valeur par défaut si null
        happiness = happiness ?? 50; // Valeur par défaut si null

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
        } else {
            console.error('Valeurs calculées non valides', { adjustedHunger, adjustedHappiness });
        }

        if (daysElapsed > 0) {
            // Incrémenter l'âge basé sur les jours écoulés
            dispatch(incrementAgeBy(daysElapsed));
        }

        // Vérifiez si le Tamagotchi devrait évoluer
        const evolutionResult = determineNextStage(stage, age, happiness, hunger);
        if (evolutionResult) {
            dispatch(incrementAge(evolutionResult.nextStage));
            stage = evolutionResult.nextStage; // Mettre à jour la variable locale pour la suite de la logique
        }

        console.log(`Age après ajustement: ${age}`);
        if (evolutionResult) {
            console.log(`Résultat de l'évolution:`, evolutionResult);
        } else {
            console.log(`Pas d'évolution pour ${stage} à l'âge ${age}`);
        }

        // Mise à jour pour la mort due à la faim ou au bonheur nul pendant plus de 12 heures
        const currentTime = Date.now();
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

        if (isFinalStage) {
            dispatch(setIsFinalStage(true));
        }
    }
);

// Actions pour Strapi
export const loadUserSadGotchu = createAsyncThunk(
    'sadgotchu/loadUserSadGotchu',
    async (userId, { dispatch }) => {
        try {
            const sadGotchu = await SadGotchuService.fetchSadGotchu(userId);
            console.log('Réponse de fetchSadGotchu:', sadGotchu);
            if (sadGotchu) {
                // Ce dispatch met à jour l'état immédiatement, ce qui est bien.
                dispatch(setSadGotchu(sadGotchu));

                // Mais pour que le reducer de fulfilled fonctionne comme tu l'attends, tu dois aussi retourner sadGotchu ici.
                return sadGotchu; // Assure-toi que c'est la structure attendue.
            } else {
                console.log("Aucun SadGotchu trouvé pour cet utilisateur");
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
            state.age += action.payload; // action.payload contient le nombre de jours à ajouter
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
                    state.age = parseInt(age, 10);
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
                console.log('Action payload dans loadUserSadGotchu.fulfilled:', action.payload);
                // Assure-toi que l'action.payload contient l'objet attendu
                if (action.payload) {
                    const { id, attributes } = action.payload;
                    console.log('Attributes dans loadUserSadGotchu.fulfilled:', attributes);

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
                            age: parseInt(age, 10), // S'assurer que les valeurs numériques sont correctement traitées
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
                } else {
                    console.log("Aucun SadGotchu trouvé pour cet utilisateur ou structure de réponse inattendue.");
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