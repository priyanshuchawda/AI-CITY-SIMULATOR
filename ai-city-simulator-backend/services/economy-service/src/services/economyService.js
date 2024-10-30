import axios from 'axios';
import { getAsync, setAsync } from '../config/redisClient';
import logger from '../utils/logger';

const CACHE_TTL = process.env.CACHE_TTL || 3600;

const calculateGDP = (cityData) => (
  (cityData.population * cityData.funds / 1000).toFixed(2)
);

const calculateUnemploymentRate = (cityData) => {
  const employedPopulation = cityData.population * 0.6;
  const unemployedPopulation = employedPopulation * (Math.random() * 0.1 + 0.02);
  return ((unemployedPopulation / employedPopulation) * 100).toFixed(2);
};

const calculateInflationRate = () => (
  (Math.random() * 3 + 1).toFixed(2)
);

const calculateGDPGrowth = () => (
  (Math.random() * 4 - 1).toFixed(2)
);

const fetchEconomyStatsFromService = async () => {
  try {
    const cityDataResponse = await axios.get('http://localhost:3001/api/city/data');
    const cityData = cityDataResponse.data;

    return {
      gdp: calculateGDP(cityData),
      unemploymentRate: calculateUnemploymentRate(cityData),
      inflationRate: calculateInflationRate(),
      gdpGrowth: calculateGDPGrowth()
    };
  } catch (error) {
    logger.error('Error fetching city data:', error);
    if (error.response) {
      throw new Error(`Failed to retrieve economy statistics: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Failed to retrieve economy statistics: No response received from city service');
    } else {
      throw new Error(`Failed to retrieve economy statistics: ${error.message}`);
    }
  }
};

export const getEconomyStats = async () => {
  const cacheKey = 'economyStats';

  // Try to get stats from cache
  const cachedStats = await getAsync(cacheKey);
  if (cachedStats) {
    return JSON.parse(cachedStats);
  }

  // If not in cache, fetch from service and calculate
  const stats = await fetchEconomyStatsFromService();

  // Store in cache for future requests
  await setAsync(cacheKey, JSON.stringify(stats), 'EX', CACHE_TTL);

  return stats;
};

export const updateEconomyStats = async (newStats) => {
  // Update stats in database (simulated)
  const updatedStats = { ...newStats, lastUpdated: new Date() };

  // Update cache
  const cacheKey = 'economyStats';
  await setAsync(cacheKey, JSON.stringify(updatedStats), 'EX', CACHE_TTL);

  return updatedStats;
};

export const calculateEconomicIndicators = async (cityData) => {
  // Implement the logic to calculate economic indicators
  // This is a placeholder implementation
  return {
    gdp: cityData.totalRevenue - cityData.totalExpenses,
    unemploymentRate: ((cityData.population - cityData.employedPopulation) / cityData.population) * 100,
    economicGrowthRate: 2.5 // Placeholder value
  };
};
