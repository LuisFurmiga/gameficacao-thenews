// backend/src/controllers/reader.controller.ts

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { Openings } from '../models/opening.model';
import { Reader } from '../models/reader.model';
import { Streak } from '../models/streak.model';
import { Newsletter } from '../models/newsletter.model';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /reader/login:
 *   post:
 *     summary: Login do leitor
 *     tags: [Reader]
 *     description: Permite que um leitor faça login usando o email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "teste@email.com"
 *     responses:
 *       200:
 *         description: Retorna o token de autenticação.
 *       400:
 *         description: Erro de validação.
 */
export const loginReader = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'E-mail é obrigatório.' });
    }

    try {
        let reader = await Reader.findOne({ where: { email } });
        if (!reader) {
            reader = await Reader.create({ email });
        }

        if(JWT_SECRET){
            const token = jwt.sign({ id: reader.id, email: reader.email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, email: reader.email });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login.', error });
    }
};

/**
 * @swagger
 * /reader/stats:
 *   get:
 *     summary: Estatísticas do leitor
 *     tags: [Reader]
 *     description: Retorna o streak e histórico do leitor autenticado.
 *     responses:
 *       200:
 *         description: Dados de estatísticas do leitor.
 *       401:
 *         description: Não autorizado.
 */
export const getReaderStats = async (req: Request, res: Response) => {
    try {
        const readerId = (req as any).user.id;
        const streak = await Streak.findOne({ where: { reader_id: readerId } });

        res.json({
            currentStreak: streak?.current_streak || 0,
            longestStreak: streak?.longest_streak || 0,
            lastOpenedDate: streak?.last_opened_date || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter estatísticas do leitor.', error });
    }
};


/**
 * @swagger
 * /reader/openings:
 *   get:
 *     summary: Retorna o histórico de aberturas de newsletters do leitor
 *     tags: 
 *       - Reader
 *     security:
 *       - BearerAuth: []
 *     description: Obtém todas as aberturas de newsletters feitas pelo usuário autenticado.
 *     responses:
 *       200:
 *         description: Lista de aberturas do leitor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   newsletter_id:
 *                     type: string
 *                     example: "123"
 *                   opened_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-22T12:00:00Z"
 *                   utm_source:
 *                     type: string
 *                     example: "facebook"
 *                   utm_medium:
 *                     type: string
 *                     example: "social"
 *                   utm_campaign:
 *                     type: string
 *                     example: "promo_01"
 *                   utm_channel:
 *                     type: string
 *                     example: "email"
 *       401:
 *         description: Não autorizado - Token inválido ou não enviado.
 *       500:
 *         description: Erro interno ao obter estatísticas do leitor.
 */
export const getReaderOpenings = async (req: Request, res: Response) => {
    try {
        const readerId = (req as any).user.id;

        // Buscar todos os registros do usuário
        const openings = await Openings.findAll({ where: { reader_id: readerId } });

        // Mapear os resultados para retornar apenas os campos desejados
        const formattedOpenings = openings.map(opening => ({
            newsletter_id: opening.newsletter_id,
            opened_at: opening.opened_at,
            utm_source: opening.utm_source || "",
            utm_medium: opening.utm_medium || "",
            utm_campaign: opening.utm_campaign || "",
            utm_channel: opening.utm_channel || ""
        }));

        res.json(formattedOpenings);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter estatísticas do leitor.', error });
    }
};


export const getNewsletterName = async (req: Request, res: Response) => {
    try {
        const { newsletter_id } = req.query;
        if (!newsletter_id) {
            return res.status(400).json({ message: 'newsletter_id é obrigatório.' });
        }
        
        const newsletter = await Newsletter.findOne({ where: { id:newsletter_id } });
        if (!newsletter) {
            return res.status(404).json({ message: 'Newsletter não encontrada.' });
        }

        res.json({ resource_id: newsletter.resource_id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter nome da Newsletter.', error });
    }
};