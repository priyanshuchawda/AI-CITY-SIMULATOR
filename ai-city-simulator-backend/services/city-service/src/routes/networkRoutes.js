import express from 'express';
import { deploy5GInfrastructure, get5GNetworkLoad } from '../services/networkService.js';

const router = express.Router();

router.post('/deploy', async (req, res) => {
  const { area } = req.body;
  const result = await deploy5GInfrastructure(area);
  res.json(result);
});

router.get('/load', async (req, res) => {
  const { timeOfDay } = req.query;
  const result = await get5GNetworkLoad(parseInt(timeOfDay));
  res.json(result);
});

export default router;
