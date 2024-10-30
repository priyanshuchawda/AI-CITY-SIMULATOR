import { cityService } from './cityService';
import { educationService } from './educationService';
import { healthcareService } from './healthcareService';
import { trafficService } from './trafficService';
import { economyService } from './economyService';
import { researchService } from './researchService';

interface GameState {
  cityData: ReturnType<typeof cityService.getCityData>;
  educationData: ReturnType<typeof educationService.getEducationData>;
  healthcareData: ReturnType<typeof healthcareService.getHealthcareData>;
  trafficData: ReturnType<typeof trafficService.getTrafficData>;
  economyData: ReturnType<typeof economyService.getEconomyData>;
  researchData: ReturnType<typeof researchService.getResearchData>;
}

class SaveLoadService {
  saveGame(): void {
    const gameState: GameState = {
      cityData: cityService.getCityData(),
      educationData: educationService.getEducationData(),
      healthcareData: healthcareService.getHealthcareData(),
      trafficData: trafficService.getTrafficData(),
      economyData: economyService.getEconomyData(),
      researchData: researchService.getResearchData(),
    };

    localStorage.setItem('aiCitySimulatorSave', JSON.stringify(gameState));
  }

  loadGame(): boolean {
    const savedState = localStorage.getItem('aiCitySimulatorSave');
    if (!savedState) return false;

    try {
      const gameState: GameState = JSON.parse(savedState);

      cityService.loadCityData(gameState.cityData);
      educationService.loadEducationData(gameState.educationData);
      healthcareService.loadHealthcareData(gameState.healthcareData);
      trafficService.loadTrafficData(gameState.trafficData);
      economyService.loadEconomyData(gameState.economyData);
      researchService.loadResearchData(gameState.researchData);

      return true;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return false;
    }
  }

  hasSavedGame(): boolean {
    return localStorage.getItem('aiCitySimulatorSave') !== null;
  }
}

export const saveLoadService = new SaveLoadService();