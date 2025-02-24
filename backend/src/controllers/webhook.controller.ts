// backend/src/controllers/webhook.controller.ts

import { Request, Response } from 'express';
import { Reader } from '../models/reader.model';
import { Newsletter } from '../models/newsletter.model';
import { Streak } from '../models/streak.model';
import { Openings } from '../models/opening.model';

const processedRequests = new Set(); // Armazena as requisições recentes

/**
 * @swagger
 * /webhook:
 *   get:
 *     summary: Recebe os dados de abertura dos leitores via webhook
 *     tags: [Webhook]
 *     description: Endpoint para capturar informações de abertura de e-mails e atualizar streaks.
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: "ameixa@email.com"
 *         description: O e-mail do leitor.
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "post_12345"
 *         description: ID único do post/newsletter.
 *       - in: query
 *         name: utm_source
 *         required: false
 *         schema:
 *           type: string
 *           example: "tiktok"
 *         description: Origem da campanha de marketing.
 *       - in: query
 *         name: utm_medium
 *         required: false
 *         schema:
 *           type: string
 *           example: "socialpaid"
 *         description: Meio pelo qual o usuário acessou.
 *       - in: query
 *         name: utm_campaign
 *         required: false
 *         schema:
 *           type: string
 *           example: "12/12/2024"
 *         description: Nome da campanha associada ao clique.
 *       - in: query
 *         name: utm_channel
 *         required: false
 *         schema:
 *           type: string
 *           example: "web"
 *         description: Canal pelo qual o usuário acessou.
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Webhook processado com sucesso"
 *       406:
 *         description: Dados insuficientes
 *         content:
 *           application/json:
 *             example:
 *               message: "Favor informar o campo!"
 *       500:
 *         description: Erro ao processar webhook
 *         content:
 *           application/json:
 *             example:
 *               message: "Dados insuficientes. 'email' e 'id' são obrigatórios."
 *               error: "Detalhes do erro"
 * 
 *   post:
 *     summary: Recebe os dados de abertura dos leitores via webhook
 *     tags: [Webhook]
 *     description: Endpoint para capturar informações de abertura de e-mails e atualizar streaks.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ameixa@email.com"
 *               id:
 *                 type: string
 *                 example: "post_12345"
 *               utm_source:
 *                 type: string
 *                 example: "tiktok"
 *                 description: Origem da campanha de marketing (opcional).
 *               utm_medium:
 *                 type: string
 *                 example: "socialpaid"
 *                 description: Meio pelo qual o usuário acessou (opcional).
 *               utm_campaign:
 *                 type: string
 *                 example: "12/12/2024"
 *                 description: Nome da campanha associada ao clique (opcional).
 *               utm_channel:
 *                 type: string
 *                 example: "web"
 *                 description: Canal pelo qual o usuário acessou (opcional).
 *     responses:
 *       200:
 *         description: Webhook processado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Webhook processado com sucesso"
 *       406:
 *         description: Dados insuficientes
 *         content:
 *           application/json:
 *             example:
 *               message: "Dados insuficientes. 'email' e 'id' são obrigatórios."
 *       500:
 *         description: Erro ao processar webhook
 *         content:
 *           application/json:
 *             example:
 *               message: "Erro ao processar webhook"
 *               error: "Detalhes do erro"
 */
export const handleWebhook = async (req: Request, res: Response) => {
    // Para GET: os dados virão de req.query, para POST: req.body
    let { email, id, utm_source, utm_medium, utm_campaign, utm_channel } = { ...req.body, ...req.query };

    if (!email || !id) {
            return res.status(406).json({ message: "Dados insuficientes. 'email' e 'id' são obrigatórios." });
    }

    // Criar um objeto JSON com todos os campos recebidos
    const requestData = JSON.stringify({ email, id, utm_source, utm_medium, utm_campaign, utm_channel });

    // Evitar processamento duplicado (cache temporário)
    if (processedRequests.has(requestData)) {
        console.log(`Requisição duplicada ignorada: ${requestData}`);
        return res.status(200).json({ message: "Requisição já processada." });
    }

    // Adiciona ao cache temporário
    processedRequests.add(requestData);

    try {
        let reader = await Reader.findOne({ where: { email } });
        if (!reader) {
            reader = await Reader.create({ email });
        }

        let newsletter = await Newsletter.findOne({ where: { resource_id: id } });
        if (!newsletter) {
            newsletter = await Newsletter.create({ resource_id: id });
        }

        let streak = await Streak.findOne({ where: { reader_id: reader.id } });

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        await Openings.create({
            reader_id: reader.id,
            newsletter_id: newsletter.id,
            opened_at: today,
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
            utm_channel: utm_channel || null,
        });

        // Ignorar domingos (0 no Date.getDay())
        if (yesterday.getDay() === 0) {
            yesterday.setDate(yesterday.getDate() - 1);
        }

        if (!streak) {
            streak = await Streak.create({
                reader_id: reader.id,
                current_streak: 1,
                longest_streak: 1,
                last_opened_date: today,
            });
        } else {
            // Calcula a diferença em dias
            const lastOpenedDate = new Date(streak.last_opened_date);
            const differenceInDays = Math.floor(
                (today.getTime() - lastOpenedDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (streak.last_opened_date && new Date(streak.last_opened_date).toDateString() === yesterday.toDateString()) {
                streak.current_streak += 1;
                if (streak.current_streak > streak.longest_streak) {
                    streak.longest_streak = streak.current_streak;
                }
            } else if (new Date(streak.last_opened_date).toDateString() !== today.toDateString()) {
                if (differenceInDays > streak.life) {
                    // Se a diferença for maior que a vida do usuário, zeramos e resetamos o streak
                    streak.life = 0;
                    streak.current_streak = 1;
                  } else {
                    // Se ainda houver vidas suficientes, descontamos e mantemos a streak
                    streak.life -= differenceInDays;
                    streak.current_streak += 1; // Continua a streak
                  }
            }

            // Se o último acesso foi no domingo e o de hoje é segunda, adiciona 1 à vida
            if (today.getDay() === 1 && new Date(streak.last_opened_date).getDay() === 0){
                streak.life += 1;
            }

            streak.last_opened_date = today;
            await streak.save();

        }

        // Remover do cache após um tempo (para evitar bloqueio permanente)
        setTimeout(() => {
            processedRequests.delete(requestData);
        }, 5000); // 5 segundos
    
        return res.status(200).json({ message: "Webhook processado com sucesso" });
    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        return res.status(500).json({ message: "Erro ao processar webhook", error });
    }
};
