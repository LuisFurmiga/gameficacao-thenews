// backend/src/routes/admin.routes.ts

import { Router } from 'express';
import { getEngagementMetrics, getNewsletters, getTopReaders } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrativos para análise de métricas e engajamento
 */

// Obtém métricas gerais da plataforma
router.get('/metrics', authenticate, getEngagementMetrics);

// Obtém os leitores mais engajados
router.get('/top-readers', authenticate, getTopReaders);

// Obtém todas as newsletters
router.get("/newsletters", authenticate, getNewsletters);

export default router;
