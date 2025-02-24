// backend/src/config/swagger.ts


import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import dotenv from 'dotenv';

require('dotenv').config();

const url = process.env.DB_HOST;
const port = process.env.PORT;
const swaggerApiDocs = '/api-docs'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gamificação The News API',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de gamificação do The News',
    },
    servers: [
        {
            url: `http://${url}:${port}`,
            description: 'Servidor de Desenvolvimento',
        },
    ],
    components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Insira o token JWT no formato Bearer {token}",
          },
        },
    },
    security: [
        { 
            BearerAuth: [] 
        }
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Caminho para as rotas a serem documentadas
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
    app.use(swaggerApiDocs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger configurado em http://${url}:${port}${swaggerApiDocs}`);
};
