import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'City Service API',
      version: '1.0.0',
      description: 'API for managing city data in AI City Simulator. This service now includes WebSocket support for real-time updates at ws://[server-url]/ws',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

export default swaggerJsdoc(options);
