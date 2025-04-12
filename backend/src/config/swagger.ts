import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Barber Shop API',
      version: '1.0.0',
      description: 'API para gestão de agendamentos, serviços e clientes de uma barbearia',
      license: {
        name: 'ISC',
      },
      contact: {
        name: 'Equipe de Desenvolvimento',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/infra/http/routes/*.ts', './src/domain/entities/*.ts'],
};

export const specs = swaggerJsdoc(options); 