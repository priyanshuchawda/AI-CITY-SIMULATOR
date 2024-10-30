import { cityService } from './cityService';
import { economyService } from './economyService';
import { timeService } from './timeService';

interface CitySnapshot {
  timestamp: number;
  population: number;
  happiness: number;
  funds: number;
  gdp: number;
  unemploymentRate: number;
}

class StatisticsService {
  private history: CitySnapshot[] = [];
  private maxHistoryLength = 1000; // Store up to 1000 data points

  constructor() {
    setInterval(() => this.recordSnapshot(), 3600000); // Record every hour (game time)
  }

  private recordSnapshot() {
    const cityData = cityService.getCityData();
    const economyData = economyService.getEconomyData();
    const snapshot: CitySnapshot = {
      timestamp: timeService.getTime(),
      population: cityData.population,
      happiness: cityData.happiness,
      funds: cityData.funds,
      gdp: economyData.gdp,
      unemploymentRate: economyData.unemploymentRate
    };

    this.history.push(snapshot);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift(); // Remove oldest entry if we exceed max length
    }
  }

  getHistory(): CitySnapshot[] {
    return this.history;
  }

  getLatestSnapshot(): CitySnapshot | null {
    return this.history[this.history.length - 1] || null;
  }

  getGrowthRate(metric: keyof CitySnapshot): number {
    if (this.history.length < 2) return 0;
    const latest = this.history[this.history.length - 1];
    const previous = this.history[this.history.length - 2];
    return (latest[metric] - previous[metric]) / previous[metric];
  }
}

export const statisticsService = new StatisticsService();