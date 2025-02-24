// backend/src/controllers/admin.controller.ts

import { Request, Response } from 'express';
import { Op } from "sequelize";

import { sequelize } from '../config/database';
import { Reader } from '../models/reader.model';
import { Streak } from '../models/streak.model';
import { Openings } from '../models/opening.model';
import { Newsletter } from "../models/newsletter.model";

/**
 * @swagger
 * /admin/metrics:
 *   get:
 *     summary: Obtém métricas de engajamento dos leitores
 *     tags: [Admin]
 *     description: Retorna estatísticas de engajamento, incluindo total de leitores, total de aberturas e média de streaks. Suporta filtros opcionais para newsletter, período de tempo e parâmetros UTM.
 *     parameters:
 *       - in: query
 *         name: newsletterId
 *         schema:
 *           type: string
 *         description: Filtra as aberturas por um ID específico de newsletter.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-02-01"
 *         description: Data de início para filtrar as aberturas.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-02-15"
 *         description: Data final para filtrar as aberturas.
 *       - in: query
 *         name: streakStatus
 *         schema:
 *           type: integer
 *         description: Filtra usuários com streaks maiores ou iguais ao valor informado.
 *       - in: query
 *         name: utmSource
 *         schema:
 *           type: string
 *           example: "tiktok"
 *         description: Filtra por UTM Source.
 *       - in: query
 *         name: utmMedium
 *         schema:
 *           type: string
 *           example: "socialpaid"
 *         description: Filtra por UTM Medium.
 *       - in: query
 *         name: utmCampaign
 *         schema:
 *           type: string
 *           example: "12/12/2024"
 *         description: Filtra por UTM Campaign.
 *       - in: query
 *         name: utmChannel
 *         schema:
 *           type: string
 *           example: "web"
 *         description: Filtra por UTM Channel.
 *     responses:
 *       200:
 *         description: Retorna métricas de engajamento com os filtros aplicados.
 *         content:
 *           application/json:
 *             example:
 *               totalReaders: 150
 *               totalOpenings: 320
 *               averageStreak: 4.5
 *       400:
 *         description: Erro nos parâmetros da requisição.
 *         content:
 *           application/json:
 *             example:
 *               message: "Parâmetros inválidos."
 *       500:
 *         description: Erro ao obter métricas de engajamento.
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao obter métricas de engajamento"
 *               error: "Detalhes do erro"
 */
export const getEngagementMetrics = async (req: Request, res: Response) => {
    try {
        console.log("Requisição de métricas de engajamento recebida:", req.query);
        // Captura os parâmetros de filtro da query
        const { newsletterId, startDate, endDate, streakStatus, utmSource, utmMedium, utmCampaign, utmChannel } = req.query;

        // Filtro de período de tempo para abertura
        const dateFilter: any = {};
        if (startDate) dateFilter[Op.gte] = new Date(startDate as string);
        if (endDate) dateFilter[Op.lte] = new Date(endDate as string);

        // Construção dos filtros para UTM, ignorando NULL
        const utmFilter: any = {};
        if (utmSource) utmFilter.utm_source = utmSource;
        if (utmMedium) utmFilter.utm_medium = utmMedium;
        if (utmCampaign) utmFilter.utm_campaign = utmCampaign;
        if (utmChannel) utmFilter.utm_channel = utmChannel;

        // Filtrar os usuários com streak >= streakStatus (se fornecido)
        const streakFilter: any = {};
        if (streakStatus) {
            streakFilter.current_streak = { [Op.gte]: Number(streakStatus) };
        }

        const streakUsers = await Streak.findAll({
            attributes: ["reader_id"],
            where: streakFilter,
            raw: true,
        });

        const readerIds = streakUsers.map((streak) => streak.reader_id);

        if (readerIds.length === 0) {
            return res.json({
                totalReaders: 0,
                totalOpenings: 0,
                averageStreak: 0,
            });
        }
        
        // Se newsletterId for passado, buscar os IDs reais na tabela de newsletters
        let newsletterIds: number[] | undefined;
        if (newsletterId) {
            const newsletters = await Newsletter.findAll({
                attributes: ["id"],
                where: { resource_id: newsletterId }, // Newsletter.reader_id na verdade é o título
                raw: true,
            });

            newsletterIds = newsletters.map((n) => n.id);

            if (newsletterIds.length === 0) {
                return res.json({
                    totalReaders: 0,
                    totalOpenings: 0,
                    averageStreak: 0,
                });
            }
        }

        // Contar as aberturas filtradas por leitores encontrados e newsletters (se aplicável)
        const totalOpenings = await Openings.count({
            where: {
                reader_id: { [Op.in]: readerIds },
                ...(newsletterIds ? { newsletter_id: { [Op.in]: newsletterIds } } : {}),
                ...(startDate || endDate ? { opened_at: dateFilter } : {}),
                ...utmFilter,
            },
        });

        // 4. Contar o total de leitores únicos que passaram nos filtros
        const totalReaders = readerIds.length;

        // 5. Calcular a média de streaks apenas para os leitores filtrados
        const averageStreakData = await Streak.findOne({
            attributes: [[sequelize.fn("AVG", sequelize.col("current_streak")), "average_streak"]],
            where: { reader_id: { [Op.in]: readerIds } },
            raw: true,
        });

        const averageStreak = averageStreakData ? (averageStreakData as any).average_streak || 0 : 0;

        res.json({
            totalReaders,
            totalOpenings,
            averageStreak,
        });
    } catch (error) {
        console.error("Erro ao obter métricas de engajamento:", error);
        res.status(500).json({ message: "Erro ao obter métricas de engajamento", error });
    }
};


/**
 * @swagger
 * /admin/top-readers:
 *   get:
 *     summary: Obtém os leitores mais engajados
 *     tags: [Admin]
 *     description: Retorna um ranking dos leitores com maiores streaks.
 *     responses:
 *       200:
 *         description: Lista de leitores mais engajados retornada com sucesso
 *       500:
 *         description: Erro ao obter ranking de leitores
 */
export const getTopReaders = async (req: Request, res: Response) => {
    try {
        const topReaders = await Streak.findAll({
            order: [['longest_streak', 'DESC']],
            limit: 10,
            include: {
                model: Reader,
                as: 'reader',
                attributes: ['email'],  
                required: true // Garante que só retornará streaks com um leitor associado
            }
        });        
        res.json(topReaders);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter ranking de leitores', error });
    }
};


export const getNewsletters = async (req: Request, res: Response) => {
    try {
        const newsletters = await Newsletter.findAll({
            attributes: ["id", "resource_id"],
        });
        res.json(newsletters);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar newsletters", error });
    }
};
