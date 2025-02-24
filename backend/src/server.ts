 // backend/src/server.ts
 
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import webhookRoutes from './routes/webhook.routes';
import readerRoutes from './routes/reader.routes';
import adminRoutes from './routes/admin.routes';
import { setupSwagger } from './config/swagger';

import "./services/webhook.service";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configura a documentação Swagger
setupSwagger(app);

// Rotas
app.use('/webhook', webhookRoutes);
app.use('/reader', readerRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT;

app.get('/test', (req, res) => {
    res.send("Servidor rodando corretamente!");
});

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch(err => console.error('Erro ao conectar ao banco:', err));


