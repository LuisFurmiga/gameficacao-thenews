// backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acesso não autorizado. Token ausente.' });
    }

    try {
        if(JWT_SECRET){
            const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
            (req as any).user = decoded;
            next();
        }
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};
