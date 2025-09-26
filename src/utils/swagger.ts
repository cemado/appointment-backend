import swaggerJSDoc from 'swagger-jsdoc';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

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
      url: API_BASE_URL,
      description: 'Servidor base configurado por entorno'
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
  ],
  paths: {
    '/appointments/stats': {
      get: {
        tags: ['Appointments'],
        summary: 'Obtener estadísticas de citas',
        description: 'Devuelve estadísticas agregadas de todas las citas en la base de datos DynamoDB.',
        responses: {
          '200': {
            description: 'Estadísticas obtenidas exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    stats: {
                      $ref: '#/components/schemas/AppointmentStats'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      AppointmentStats: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          byStatus: { type: 'object', additionalProperties: { type: 'integer' } },
          byPriority: { type: 'object', additionalProperties: { type: 'integer' } },
          byType: { type: 'object', additionalProperties: { type: 'integer' } },
          byDoctor: { type: 'object', additionalProperties: { type: 'integer' } },
          upcomingToday: { type: 'integer' },
          upcomingWeek: { type: 'integer' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/handlers/*.ts', './src/types/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);