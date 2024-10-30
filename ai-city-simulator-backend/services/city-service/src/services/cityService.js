import { getAsync, setAsync, delAsync } from '../config/redisClient.js';
import City from '../models/City.js';
import FiveGSimulation from '../utils/5gSimulation.js';

const CACHE_TTL = process.env.CACHE_TTL || 3600; // Cache for 1 hour by default

const fiveGSimulation = new FiveGSimulation();

export const getCityById = async (id) => {
  const cacheKey = `city:${id}`;
  
  try {
    // Try to get data from cache
    const cachedCity = await getAsync(cacheKey);
    if (cachedCity) {
      return JSON.parse(cachedCity);
    }

    // If not in cache, get from database
    const city = await City.findById(id);
    if (city) {
      // Store in cache for future requests
      await setAsync(cacheKey, JSON.stringify(city), 'EX', CACHE_TTL);
    }

    return city;
  } catch (error) {
    console.error('Error getting city by ID:', error);
    throw error;
  }
};

export const createCity = async (cityData) => {
  try {
    // Use City.create() instead of new City()
    const city = await City.create(cityData);

    // Cache the new city
    await setAsync(`city:${city._id}`, JSON.stringify(city), 'EX', 3600);

    return city;
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
};

export const updateCity = async (id, cityData) => {
  try {
    const city = await City.findByIdAndUpdate(id, cityData, { new: true });
    
    if (city) {
      // Update cache
      const cacheKey = `city:${id}`;
      await setAsync(cacheKey, JSON.stringify(city), 'EX', CACHE_TTL);
    }

    return city;
  } catch (error) {
    console.error('Error updating city:', error);
    throw error;
  }
};

export const deleteCity = async (id) => {
  try {
    const result = await City.findByIdAndDelete(id);
    
    if (result) {
      // Remove from cache
      const cacheKey = `city:${id}`;
      await delAsync(cacheKey);
    }

    return result;
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
};

// 5G Simulation Integration
export const deploy5GInfrastructure = async (area) => {
  try {
    await fiveGSimulation.deployInfrastructure(area);
    return await fiveGSimulation.getNetworkStatus();
  } catch (error) {
    console.error('Error deploying 5G infrastructure:', error);
    throw error;
  }
};

export const get5GNetworkLoad = async (timeOfDay) => {
  try {
    return await fiveGSimulation.simulateNetworkLoad(timeOfDay);
  } catch (error) {
    console.error('Error getting 5G network load:', error);
    throw error;
  }
};
