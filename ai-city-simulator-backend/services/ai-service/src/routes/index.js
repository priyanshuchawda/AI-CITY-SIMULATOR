import express from 'express';
import aiRoutes from './aiRoutes.js';

const router = express.Router();

router.use('/ai', aiRoutes);

export default router;
