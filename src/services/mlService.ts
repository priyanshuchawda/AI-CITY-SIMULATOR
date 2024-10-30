import * as tf from '@tensorflow/tfjs';
import { cityService } from './cityService';

class MLService {
  private model: tf.Sequential | null = null;

  async trainModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [3] }));
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    const cityData = cityService.getCityData();
    const xs = tf.tensor2d([[cityData.population, cityData.happiness, cityData.funds]]);
    const ys = tf.tensor2d([[cityData.population * 1.01]]); // Assume 1% growth

    await model.fit(xs, ys, { epochs: 100 });
    this.model = model;
  }

  async predictGrowth(days: number): Promise<number[]> {
    if (!this.model) {
      await this.trainModel();
    }

    const predictions: number[] = [];
    let currentData = cityService.getCityData();

    for (let i = 0; i < days; i++) {
      const input = tf.tensor2d([[currentData.population, currentData.happiness, currentData.funds]]);
      const prediction = this.model!.predict(input) as tf.Tensor;
      const predictedPopulation = Math.round((prediction.dataSync()[0]));
      predictions.push(predictedPopulation);

      // Update current data for next prediction
      currentData = {
        ...currentData,
        population: predictedPopulation,
      };
    }

    return predictions;
  }
}

export const mlService = new MLService();