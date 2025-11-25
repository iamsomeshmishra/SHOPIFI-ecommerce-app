import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protect, admin } from '#shared/index.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);

export default router;
