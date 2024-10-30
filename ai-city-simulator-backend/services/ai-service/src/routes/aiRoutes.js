import express from 'express';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import validate from '../middleware/validationMiddleware.js';
import sanitizeBody from '../middleware/sanitizationMiddleware.js';
import aiService from '../services/aiService.js';
import { evaluateDecision } from '../services/aiEthicsService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'AI Service is running' });
});

const predictionSchema = Joi.object({
  cityId: Joi.string().required(),
  timeframe: Joi.string().valid('short', 'medium', 'long').required()
});

/**
 * @swagger
 * /api/ai/predict:
 *   post:
 *     summary: Generate a prediction for a city
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cityId
 *               - timeframe
 *             properties:
 *               cityId:
 *                 type: string
 *               timeframe:
 *                 type: string
 *                 enum: [short, medium, long]
 *     responses:
 *       200:
 *         description: The prediction result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prediction:
 *                   type: object
 */
router.post('/predict', validate(predictionSchema), sanitizeBody, asyncHandler(async (req, res) => {
  const prediction = await aiService.makePrediction(req.body.cityId, req.body.timeframe);
  res.json({ prediction });
}));

router.post('/optimize', asyncHandler(async (req, res) => {
  const { cityData, goal } = req.body;
  const optimizationPlan = await aiService.optimizeCity(cityData, goal);
  res.json(optimizationPlan);
}));

router.get('/prediction/:id', asyncHandler(async (req, res) => {
  const prediction = await aiService.getPrediction(req.params.id);
  if (!prediction) {
    return res.status(404).json({ message: 'Prediction not found' });
  }
  res.json(prediction);
}));

router.post('/ethical-decision', asyncHandler(async (req, res) => {
  const { decision } = req.body;
  const result = await aiService.makeEthicalDecision(decision);
  res.json(result);
}));

router.post('/quantum-algorithm', asyncHandler(async (req, res) => {
  const { algorithmName, problemSize } = req.body;
  const result = await aiService.runQuantumAlgorithm(algorithmName, problemSize);
  res.json(result);
}));

router.post('/evaluate-ethics', asyncHandler(async (req, res) => {
  const { decision, context } = req.body;
  const evaluation = await evaluateDecision(decision, context);
  res.json(evaluation);
}));

export default router;
