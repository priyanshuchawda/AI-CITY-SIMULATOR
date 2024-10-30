import express from 'express';
import asyncHandler from 'express-async-handler';
import Joi from 'joi';
import createError from 'http-errors';
import validate from '../middleware/validationMiddleware.js';
import sanitizeBody from '../middleware/sanitizationMiddleware.js';
import { getCityById, createCity, updateCity, deleteCity } from '../services/cityService.js';
import cityController from '../controllers/cityController.js';
import cityService from '../services/cityService.js';  

const router = express.Router();

const citySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  population: Joi.number().integer().min(0).required(),
  funds: Joi.number().min(0).required()
});

router.get('/:id', asyncHandler(async (req, res) => {
  const city = await getCityById(req.params.id);
  if (!city) {
    throw createError(404, 'City not found');
  }
  res.json(city);
}));

router.post('/', validate(citySchema), sanitizeBody, asyncHandler(async (req, res) => {
  const newCity = await createCity(req.body);
  res.status(201).json(newCity);
}));

router.put('/:id', validate(citySchema), sanitizeBody, asyncHandler(async (req, res) => {
  const updatedCity = await updateCity(req.params.id, req.body);
  res.json(updatedCity);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await deleteCity(req.params.id);
  res.json(result);
}));

router.post('/cities', cityController.createCity);



router.post('/5g/deploy', asyncHandler(async (req, res) => {
  const { area } = req.body;
  const result = await cityService.deploy5GInfrastructure(area);
  res.json(result);
}));

router.get('/5g/load', asyncHandler(async (req, res) => {
  const { timeOfDay } = req.query;
  const result = await cityService.get5GNetworkLoad(parseInt(timeOfDay));
  res.json(result);
}));

export default router;
/**
 * @swagger
 * /api/city:
 *   post:
 *     summary: Create a new city
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - population
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: number
 *               funds:
 *                 type: number
 *     responses:
 *       201:
 *         description: The created city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 * /api/city/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The city details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 * /api/city/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: number
 *               funds:
 *                 type: number
 *     responses:
 *       200:
 *         description: The updated city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 * /api/city/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags: [Cities]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success message
 *       404:
 *         description: City not found
 * /api/5g/deploy:
 *   post:
 *     summary: Deploy 5G infrastructure
 *     tags: [5G]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deployment result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 * /api/5g/load:
 *   get:
 *     summary: Get 5G network load
 *     tags: [5G]
 *     parameters:
 *       - name: timeOfDay
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Load result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 load:
 *                   type: integer
 * /api/5g/deploy:
 *   post:
 *     summary: Deploy 5G infrastructure
 *     tags: [5G]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deployment result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 * /api/5g/load:
 *   get:
 *     summary: Get 5G network load
 *     tags: [5G]
 *     parameters:
 *       - name: timeOfDay
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Load result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 load:
 *                   type: integer
 */

