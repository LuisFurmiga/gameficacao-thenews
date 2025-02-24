// backend/src/routes/webhook.routes.ts

import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Endpoints relacionados ao recebimento de eventos via webhook
 */

// Recebe dados de abertura da newsletter via webhook
// Processa a abertura de newsletters e atualiza streaks dos leitores.
router.get('/', handleWebhook);
router.post('/', handleWebhook);

export default router;
