import path from 'path';

export const SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FreshPrint API',
      version: '1.0.0',
      description: 'Api documentation for FreshPrints Apparel backend endpoints'
    },
    servers: [
      {
        url: 'http://localhost:9000',
        description: 'Local development server'
      }
    ]
  },
  apis: [path.resolve(__dirname, './swagger.yaml')]
};