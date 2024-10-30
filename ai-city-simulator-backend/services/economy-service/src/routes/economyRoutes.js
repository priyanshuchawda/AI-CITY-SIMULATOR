import express from 'express';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import validate from '../middleware/validationMiddleware';
import sanitizeBody from '../middleware/sanitizationMiddleware';
import economyController from '../controllers/economyController';
import { getEconomyStats, updateEconomyStats } from '../services/economyService';

const router = express.Router();

const economyStatsSchema = Joi.object({
  gdp: Joi.number().min(0).required(),
  unemploymentRate: Joi.number().min(0).max(100).required(),
  inflationRate: Joi.number().required(),
});

/**
 * @swagger
 * /api/economy/stats:
 *   get:
 *     summary: Get economy statistics
 *     tags: [Economy]
 *     responses:
 *       200:
 *         description: The economy statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gdp:
 *                   type: number
 *                 unemploymentRate:
 *                   type: number
 *                 inflationRate:
 *                   type: number
 */
router.get('/api/economy/stats', async (req, res) => {
  try {
    const stats = await getEconomyStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in /api/economy/stats route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/stats', validate(economyStatsSchema), sanitizeBody, asyncHandler(async (req, res) => {
  const updatedStats = await updateEconomyStats(req.body);
  res.json(updatedStats);
}));

/**
 * @swagger
 * /api/economy/calculate:
 *   post:
 *     summary: Calculate economic indicators
 *     tags: [Economy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - population
 *               - employedPopulation
 *               - totalRevenue
 *               - totalExpenses
 *             properties:
 *               population:
 *                 type: number
 *               employedPopulation:
 *                 type: number
 *               totalRevenue:
 *                 type: number
 *               totalExpenses:
 *                 type: number
 *     responses:
 *       200:
 *         description: Calculated economic indicators
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EconomicIndicators'
 */
router.post('/calculate', economyController.calculateEconomicIndicators);

router.get('/stats', economyController.getEconomyStats);

export default router;
