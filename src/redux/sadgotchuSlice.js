import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

// Création de la slice pour le SadGotchu
export const sadgotchuSlice = createSlice({
    name: 'SadGotchu',
    initialState: {
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
        // Ajoute ici d'autres reducers selon les actions que ton Tamagotchi peut entreprendre
    },
});

// Action creators sont générés pour chaque cas de reducer
export const {
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
    // Exporte d'autres actions ici...
} = sadgotchuSlice.actions;

export default sadgotchuSlice.reducer;