export type Difficulty = 'easy' | 'normal' | 'hard';

interface DifficultySettings {
  initialFunds: number;
  populationGrowthRate: number;
  taxRate: number;
  buildingCostMultiplier: number;
  eventFrequency: number;
  researchCostMultiplier: number;
}

const difficultySettings: Record<Difficulty, DifficultySettings> = {
  easy: {
    initialFunds: 1000000,
    populationGrowthRate: 1.5,
    taxRate: 0.08,
    buildingCostMultiplier: 0.8,
    eventFrequency: 0.5,
    researchCostMultiplier: 0.8,
  },
  normal: {
    initialFunds: 500000,
    populationGrowthRate: 1.0,
    taxRate: 0.1,
    buildingCostMultiplier: 1.0,
    eventFrequency: 1.0,
    researchCostMultiplier: 1.0,
  },
  hard: {
    initialFunds: 250000,
    populationGrowthRate: 0.75,
    taxRate: 0.12,
    buildingCostMultiplier: 1.2,
    eventFrequency: 1.5,
    researchCostMultiplier: 1.2,
  },
};

class DifficultyService {
  private currentDifficulty: Difficulty = 'normal';

  setDifficulty(difficulty: Difficulty): void {
    this.currentDifficulty = difficulty;
  }

  getDifficulty(): Difficulty {
    return this.currentDifficulty;
  }

  getSettings(): DifficultySettings {
    return difficultySettings[this.currentDifficulty];
  }
}

export const difficultyService = new DifficultyService();