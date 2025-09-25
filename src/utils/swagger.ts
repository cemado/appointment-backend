import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Appointment Backend API',
    version: '2.0.0',
    description: '🏥 Sistema completo de gestión de citas médicas con arquitectura serverless',
    contact: {
      name: 'API Support',
      email: 'support@appointment-api.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo local'
    },
    {
      url: 'https://api.appointment-backend.com',
      description: 'Servidor de producción'
    }
  ],
  tags: [
    {
      name: 'Health Check',
      description: 'Endpoints para verificar el estado de la API'
    },
    {
      name: 'Appointments',
      description: 'Operaciones CRUD para gestión de citas médicas'
    },
    {
      name: 'Statistics',
      description: 'Estadísticas y reportes del sistema'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./src/handlers/*.ts', './src/types/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJSDoc(options);