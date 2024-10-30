import { EventEmitter } from 'events';
import { cityService } from './cityService';

export interface WeatherCondition {
  type: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  intensity: number; // 0 to 1
}

class EnvironmentService extends EventEmitter {
  private pollution: number = 0; // 0 to 100
  private greenSpaces: number = 0;
  private weather: WeatherCondition = { type: 'clear', intensity: 0 };

  updateEnvironment() {
    this.updatePollution();
    this.updateWeather();
    this.emit('update');
  }

  private updatePollution() {
    const cityData = cityService.getCityData();
    const pollutionIncrease = cityData.population * 0.0001 + cityData.industries * 0.1;
    const pollutionDecrease = this.greenSpaces * 0.05;
    this.pollution = Math.max(0, Math.min(100, this.pollution + pollutionIncrease - pollutionDecrease));
  }

  private updateWeather() {
    if (Math.random() < 0.1) {
      const weatherTypes: WeatherCondition['type'][] = ['clear', 'cloudy', 'rainy', 'snowy'];
      this.weather = {
        type: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
        intensity: Math.random()
      };
    }
  }

  getPollutionLevel(): number {
    return this.pollution;
  }

  getWeather(): WeatherCondition {
    return this.weather;
  }

  addGreenSpace(amount: number) {
    this.greenSpaces += amount;
  }
}

export const environmentService = new EnvironmentService();