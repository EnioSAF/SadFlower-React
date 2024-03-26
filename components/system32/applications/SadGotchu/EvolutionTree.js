export const evolutionTree = {
    oeuf: {
        nextStage: "bébé",
        ageToEvolve: 1,
        needsUpdate: { hungerIncrement: 0, happinessDecrement: 0, updateInterval: 5000 },
    },
    bébé: {
        nextStage: "enfant",
        ageToEvolve: 10,
        needsUpdate: { hungerIncrement: 7, happinessDecrement: 7, updateInterval: 8500 },
    },
    enfant: {
        nextStage: "adulte",
        ageToEvolve: 25,
        needsUpdate: { hungerIncrement: 5, happinessDecrement: 5, updateInterval: 15000 },
        evolutionOptions: [
            { type: "adulteGood", condition: (happiness) => happiness > 80, evolutionLine: "good" },
            { type: "adulteBad", condition: (happiness) => happiness <= 60, evolutionLine: "bad" },
        ],
    },
    adulteGood: {
        nextStage: "vieux",
        ageToEvolve: 60,
        needsUpdate: { hungerIncrement: 3, happinessDecrement: 3, updateInterval: 10000 },
        evolutionLine: "good",
    },
    adulteBad: {
        nextStage: "vieux",
        ageToEvolve: 60,
        needsUpdate: { hungerIncrement: 5, happinessDecrement: 5, updateInterval: 15000 },
        evolutionLine: "bad",
    },
    vieux: {
        ageToEvolve: 100,
        needsUpdate: { hungerIncrement: 2, happinessDecrement: 7, updateInterval: 15000 },
        evolutionOptions: [
            { type: "ange", condition: (evolutionLine) => evolutionLine === "good", evolutionLine: "good" },
            { type: "demon", condition: (evolutionLine) => evolutionLine === "bad", evolutionLine: "bad" },
        ],
    },
    // Autres étapes comme mort, etc.
};

export const determineNextStage = (currentStage, age, happiness, hunger, currentEvolutionLine) => {
    const stageInfo = evolutionTree[currentStage];

    if (!stageInfo) return null; // Pas d'information sur ce stade

    if (age >= stageInfo.ageToEvolve) {
        if (stageInfo.conditions && !stageInfo.conditions(happiness, hunger)) {
            // Les conditions d'évolution ne sont pas remplies
            return null;
        }
        if (stageInfo.evolutionOptions) {
            // Gère les évolutions multiples basées sur des conditions
            const nextStageOption = stageInfo.evolutionOptions.find(option => option.condition(currentEvolutionLine || happiness));
            return nextStageOption ? { ...nextStageOption, evolutionLine: nextStageOption.evolutionLine } : stageInfo.nextStage;
        }
        return { type: stageInfo.nextStage, evolutionLine: stageInfo.evolutionLine || currentEvolutionLine };
    }

    return null;
};
