import { EventEmitter } from 'events';
import { cityService } from './cityService';
import { achievementService } from './achievementService';
import { economyService } from './economyService';

interface CityRank {
  score: number;
  tier: string;
  position: number;
}

class RankingService extends EventEmitter {
  private currentRank: CityRank = { score: 0, tier: 'Bronze', position: 1000 };
  private tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

  constructor() {
    super();
    setInterval(() => this.updateRank(), 60000); // Update rank every minute
  }

  private updateRank() {
    const cityData = cityService.getCityData();
    const achievements = achievementService.getAchievements();
    const economyData = economyService.getEconomyData();

    // Calculate score based on various factors
    const populationScore = cityData.population * 0.5;
    const happinessScore = cityData.happiness * 1000;
    const fundsScore = cityData.funds * 0.0001;
    const achievementScore = achievements.filter(a => a.isUnlocked).length * 5000;
    const gdpScore = economyData.gdp * 0.01;

    const totalScore = populationScore + happinessScore + fundsScore + achievementScore + gdpScore;

    // Determine tier and position based on score
    const tier = this.getTierFromScore(totalScore);
    const position = this.getPositionFromScore(totalScore);

    const newRank: CityRank = {
      score: Math.round(totalScore),
      tier,
      position
    };

    if (JSON.stringify(newRank) !== JSON.stringify(this.currentRank)) {
      this.currentRank = newRank;
      this.emit('rankUpdated', this.currentRank);
    }
  }

  private getTierFromScore(score: number): string {
    if (score < 100000) return 'Bronze';
    if (score < 500000) return 'Silver';
    if (score < 1000000) return 'Gold';
    if (score < 5000000) return 'Platinum';
    return 'Diamond';
  }

  private getPositionFromScore(score: number): number {
    // This is a simplified calculation. In a real game, this would be based on comparing scores with other players.
    return Math.max(1, Math.floor(1000000 / (score + 1)));
  }

  getCurrentRank(): CityRank {
    return this.currentRank;
  }
}

export const rankingService = new RankingService();