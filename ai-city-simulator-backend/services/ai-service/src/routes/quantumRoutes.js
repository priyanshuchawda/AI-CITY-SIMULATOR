import express from 'express';
import { runQuantumAlgorithm } from '../services/quantumService.js';

const router = express.Router();

router.post('/run-algorithm', async (req, res) => {
  const { algorithm, problemSize } = req.body;
  const result = await runQuantumAlgorithm(algorithm, problemSize);
  res.json(result);
});

export default router;
