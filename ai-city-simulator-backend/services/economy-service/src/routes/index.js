import express from 'express';
import economyRoutes from './economyRoutes';

const router = express.Router();

router.use('/economy', economyRoutes);

export default router;
