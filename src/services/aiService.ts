import * as tf from '@tensorflow/tfjs';
import { cityService, economyService, educationService, healthcareService, trafficService, environmentService } from './index';

interface Recommendation {
  action: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

class AIService {
  private model: tf.Sequential | null = null;
  private trafficModel: tf.Sequential | null = null;
  private energyModel: tf.Sequential | null = null;

  async initModels() {
    await this.initModel();
    this.trafficModel = await this.createTrafficModel();
    this.energyModel = await this.createEnergyModel();
  }

  async initModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [7] }));
    this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 1 }));

    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  }

  private async createTrafficModel(): Promise<tf.Sequential> {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [4], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return model;
  }

  private async createEnergyModel(): Promise<tf.Sequential> {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return model;
  }

  async trainModel(epochs: number = 100) {
    if (!this.model) {
      await this.initModel();
    }

    const historicalData = await this.getHistoricalData();
    const xs = tf.tensor2d(historicalData.inputs);
    const ys = tf.tensor2d(historicalData.outputs);

    await this.model!.fit(xs, ys, {
      epochs,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });
  }

  async optimizeTraffic(population: number, employmentRate: number, time: number, currentTraffic: number): Promise<number> {
    if (!this.trafficModel) {
      throw new Error('Traffic model not initialized');
    }

    const input = tf.tensor2d([[population, employmentRate, time, currentTraffic]]);
    const prediction = this.trafficModel.predict(input) as tf.Tensor;
    const optimizedTraffic = prediction.dataSync()[0];

    // Train the model with the new data
    await this.trafficModel.fit(input, tf.tensor2d([[currentTraffic]]), { epochs: 1 });

    return optimizedTraffic;
  }

  async predictEnergyConsumption(population: number, temperature: number, time: number): Promise<number> {
    if (!this.energyModel) {
      throw new Error('Energy model not initialized');
    }

    const input = tf.tensor2d([[population, temperature, time]]);
    const prediction = this.energyModel.predict(input) as tf.Tensor;
    const predictedEnergy = prediction.dataSync()[0];

    // Train the model with the new data
    const actualEnergy = cityService.getCityData().energyConsumption;
    await this.energyModel.fit(input, tf.tensor2d([[actualEnergy]]), { epochs: 1 });

    return predictedEnergy;
  }

  async predictGrowth(days: number): Promise<number[]> {
    if (!this.model) {
      await this.trainModel();
    }

    const currentData = this.getCurrentCityData();
    const predictions: number[] = [];

    for (let i = 0; i < days; i++) {
      const input = tf.tensor2d([currentData]);
      const prediction = this.model!.predict(input) as tf.Tensor;
      const predictedPopulation = Math.round(prediction.dataSync()[0]);
      predictions.push(predictedPopulation);

      // Update current data for next prediction
      currentData[0] = predictedPopulation;
    }

    return predictions;
  }

  getRecommendations(): Recommendation[] {
    const cityData = cityService.getCityData();
    const recommendations: Recommendation[] = [];

    recommendations.push(...this.getEducationRecommendations(cityData.educationLevel));
    recommendations.push(...this.getHealthcareRecommendations(cityData.healthcareQuality));
    recommendations.push(...this.getTrafficRecommendations(cityData.trafficLevel));
    recommendations.push(...this.getEconomyRecommendations(cityData.unemploymentRate, cityData.gdp));
    recommendations.push(...this.getEnvironmentRecommendations(environmentService.getPollutionLevel()));

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  getPrimaryRecommendation(): string {
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      const topRec = recommendations[0];
      return `${topRec.action}. ${topRec.reason}`;
    }
    return "The city is doing well. Focus on maintaining current standards.";
  }

  makeDecision(): string {
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      const decision = recommendations[0];
      this.implementDecision(decision);
      return `AI Mayor decided to: ${decision.action}`;
    }
    return "AI Mayor decided to maintain current policies.";
  }

  private implementDecision(decision: Recommendation) {
    console.log(`Implementing decision: ${decision.action}`);
  }

  private getCurrentCityData(): number[] {
    const cityData = cityService.getCityData();
    const economyData = economyService.getEconomyData();
    const educationData = educationService.getEducationData();
    const healthcareData = healthcareService.getHealthcareData();
    const trafficData = trafficService.getTrafficData();

    return [
      cityData.population,
      cityData.happiness,
      cityData.funds,
      economyData.gdp,
      educationData.educationLevel,
      healthcareData.healthcareQuality,
      trafficData.trafficLevel
    ];
  }

  private async getHistoricalData(): Promise<{ inputs: number[][]; outputs: number[][] }> {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    for (let i = 0; i < 1000; i++) {
      const input = [
        Math.random() * 1000000, 
        Math.random() * 100, 
        Math.random() * 1000000, 
        Math.random() * 1000000000, 
        Math.random() * 100, 
        Math.random() * 100, 
        Math.random() * 100 
      ];
      inputs.push(input);
      outputs.push([input[0] * (1 + Math.random() * 0.1)]);
    }

    return { inputs, outputs };
  }

  private getEducationRecommendations(educationLevel: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (educationLevel < 30) {
      recommendations.push({
        action: "Invest heavily in education",
        reason: "Education level is critically low, affecting citizen productivity and happiness",
        priority: "high"
      });
    } else if (educationLevel < 60) {
      recommendations.push({
        action: "Improve education system",
        reason: "Better education will lead to a more skilled workforce and increased innovation",
        priority: "medium"
      });
    }
    return recommendations;
  }

  private getHealthcareRecommendations(healthcareQuality: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (healthcareQuality < 40) {
      recommendations.push({
        action: "Upgrade healthcare facilities",
        reason: "Poor healthcare is risking citizens' lives and overall city health",
        priority: "high"
      });
    } else if (healthcareQuality < 70) {
      recommendations.push({
        action: "Invest in healthcare improvements",
        reason: "Better healthcare will increase life expectancy and citizen happiness",
        priority: "medium"
      });
    }
    return recommendations;
  }

  private getTrafficRecommendations(trafficLevel: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (trafficLevel > 80) {
      recommendations.push({
        action: "Implement urgent traffic management solutions",
        reason: "Severe traffic congestion is hampering city productivity and citizen satisfaction",
        priority: "high"
      });
    } else if (trafficLevel > 60) {
      recommendations.push({
        action: "Improve city infrastructure",
        reason: "Reducing traffic will improve citizen mobility and boost economic activity",
        priority: "medium"
      });
    }
    return recommendations;
  }

  private getEconomyRecommendations(unemploymentRate: number, gdp: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (unemploymentRate > 10) {
      recommendations.push({
        action: "Create job opportunities",
        reason: "High unemployment is causing economic stagnation and reduced citizen well-being",
        priority: "high"
      });
    } else if (gdp < 5000000) {
      recommendations.push({
        action: "Stimulate economic growth",
        reason: "Low GDP is limiting city development and services",
        priority: "medium"
      });
    }
    return recommendations;
  }

  private getEnvironmentRecommendations(pollutionLevel: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    if (pollutionLevel > 70) {
      recommendations.push({
        action: "Enforce stricter environmental regulations",
        reason: "High pollution is endangering public health and damaging the environment",
        priority: "high"
      });
    } else if (pollutionLevel > 50) {
      recommendations.push({
        action: "Implement green initiatives",
        reason: "Reducing pollution will lead to a healthier environment and improved quality of life",
        priority: "medium"
      });
    }
    return recommendations;
  }
}

export const aiService = new AIService();
