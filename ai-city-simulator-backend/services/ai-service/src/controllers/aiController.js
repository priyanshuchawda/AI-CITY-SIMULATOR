import aiService from '../services/aiService.js';

export const predict = async (req, res) => {
  try {
    const { cityId, timeframe } = req.body;
    const prediction = await aiService.makePrediction(cityId, timeframe);
    res.status(200).json({ prediction });
  } catch (error) {
    console.error('Error in predict controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
