import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { evolutionTree } from '@/components/system32/applications/SadGotchu/EvolutionTree';

// // FONCTION d'ajustement du temps basé sur la dernière interaction
// export const adjustStateBasedOnTimeElapsed = createAsyncThunk(
//     'sadgotchu/adjustStateBasedOnTimeElapsed',
//     async (timeElapsed, { getState, dispatch }) => {
//         const state = getState().sadGotchu;
//         const { stage, hunger, happiness, timeAtHundredHunger, timeAtZeroHappiness } = state;

//         // Définir les stages pour lesquels les ajustements sont applicables
//         const validStagesForAdjustment = new Set(['bébé', 'enfant', 'adulteGood', 'adulteBad', 'vieux']);

//         // Vérifier si le stage actuel permet un ajustement
//         if (!validStagesForAdjustment.has(stage)) {
//             console.log(`Aucun ajustement requis pour le stage : ${stage}`);
//             return;
//         }

//         // Récupérer les informations de mise à jour basées sur le stage actuel
//         const stageUpdateInfo = evolutionTree[stage]?.needsUpdate;
//         if (!stageUpdateInfo) {
//             console.log(`Aucune info de mise à jour pour le stage ${stage}`);
//             return;
//         }

//         const timeInMinutes = timeElapsed / 60000; // Convertir le temps écoulé en minutes
//         const adjustedHunger = Math.min(100, hunger + (timeInMinutes * stageUpdateInfo.hungerIncrement / (stageUpdateInfo.updateInterval / 60000)));
//         const adjustedHappiness = Math.max(0, happiness - (timeInMinutes * stageUpdateInfo.happinessDecrement / (stageUpdateInfo.updateInterval / 60000)));

//         // Appliquer les ajustements calculés
//         dispatch(adjustHunger(adjustedHunger - hunger));
//         dispatch(adjustHappiness(adjustedHappiness - happiness));

//         // Ajuster timeAtHundredHunger et timeAtZeroHappiness si nécessaire
//         const newTimeAtHundredHunger = adjustedHunger === 100 ? (timeAtHundredHunger + timeElapsed) : 0;
//         const newTimeAtZeroHappiness = adjustedHappiness === 0 ? (timeAtZeroHappiness + timeElapsed) : 0;
//         dispatch(resetTimeAtHundredHunger(newTimeAtHundredHunger));
//         dispatch(resetTimeAtZeroHappiness(newTimeAtZeroHappiness));
//     }
// );

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
            const newHunger = state.hunger + action.payload.amount;
            state.hunger = Math.min(100, Math.max(0, newHunger));
        },
        adjustHappiness: (state, action) => {
            const newHappiness = state.happiness + action.payload.amount;
            state.happiness = Math.min(100, Math.max(0, newHappiness));
        },
        resetTimeAtHundredHunger: (state, action) => {
            state.timeAtHundredHunger = action.payload;
        },
        resetTimeAtZeroHappiness: (state, action) => {
            state.timeAtZeroHappiness = action.payload;
        },
        setIsSleeping: (state, action) => {
            state.isSleeping = action.payload;
        },
        setIsFinalStage: (state, action) => {
            state.isFinalStage = action.payload;
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
    resetTimeAtHundredHunger,
    resetTimeAtZeroHappiness,
    setIsSleeping,
    setIsFinalStage,
    // Exporte d'autres actions ici...
} = sadgotchuSlice.actions;

export default sadgotchuSlice.reducer;