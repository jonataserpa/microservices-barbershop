import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import logger from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './infra/http/routes';
import { disconnect } from './infra/database';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Middleware de logs
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rotas da aplicação
app.use('/api', routes);

// Middleware de tratamento de erros
app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port}`);
  logger.info(`Documentação da API disponível em http://localhost:${port}/api-docs`);
});

// Tratamento de encerramento do servidor
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. Encerrando servidor...');
  server.close(async () => {
    // Fecha conexão com o banco de dados
    await disconnect();
    logger.info('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido. Encerrando servidor...');
  server.close(async () => {
    // Fecha conexão com o banco de dados
    await disconnect();
    logger.info('Servidor encerrado.');
    process.exit(0);
  });
}); 