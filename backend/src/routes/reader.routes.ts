// backend/src/routes/reader.routes.ts

import { Router } from 'express';
import { getNewsletterName, getReaderOpenings, getReaderStats, loginReader } from '../controllers/reader.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reader
 *   description: Endpoints relacionados aos leitores
 */

// Login do leitor
// Autentica o leitor e retorna um token.
router.post('/login', loginReader);

// Estatísticas do leitor
// Retorna streaks do leitor autenticado.
router.get('/stats', authenticate, getReaderStats);

// Estatísticas do leitor
// Retorna histórico do leitor autenticado.
router.get('/openings', authenticate, getReaderOpenings);

// Retorna o nome da Newsletter acessada pelo leitor.
router.get('/newsletter', authenticate, getNewsletterName);

export default router;
