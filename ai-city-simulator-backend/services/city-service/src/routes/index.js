import express from 'express';
import cityRoutes from './cityRoutes.js';

const router = express.Router();

router.use('/city', cityRoutes);

export default router;
