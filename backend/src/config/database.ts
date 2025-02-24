// backend/src/config/database.ts

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, // Desativa logs de SQL
    }
);

if (process.env.NODE_ENV !== 'test') {
    sequelize.sync({ alter: true })
        .then(() => console.log("Banco de dados sincronizado!"))
        .catch(err => console.error("Erro ao sincronizar banco:", err));
}

sequelize.authenticate()
  .then(() => console.log("Banco de dados conectado!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

export { sequelize };
