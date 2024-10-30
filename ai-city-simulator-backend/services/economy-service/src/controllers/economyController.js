import * as economyService from '../services/economyService';

const economyController = {
  async getStats(req, res) {
    try {
      const stats = await economyService.getEconomyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async calculateEconomicIndicators(req, res) {
    try {
      const cityData = req.body;
      const indicators = await economyService.calculateEconomicIndicators(cityData);
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEconomyStats(req, res) {
    try {
      const stats = await economyService.getEconomyStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error in getEconomyStats:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default economyController;
