export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Economy Service API',
      version: '1.0.0',
      description: 'API documentation for the Economy Service in AI City Simulator',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};
