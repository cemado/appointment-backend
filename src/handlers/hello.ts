import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { successResponse } from '../utils/response';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const message = {
      message: '🏥 ¡Hola! El Backend de Citas está funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      documentation: {
        swagger: 'http://localhost:3000/docs',
        openapi: 'http://localhost:3000/api-docs.json'
      },
      endpoints: {
        appointments: {
          create: 'POST /appointments',
          list: 'GET /appointments',
          get: 'GET /appointments/{id}',
          update: 'PUT /appointments/{id}',
          delete: 'DELETE /appointments/{id}',
          stats: 'GET /appointments/stats',
          confirm: 'PATCH /appointments/{id}/confirm',
          cancel: 'PATCH /appointments/{id}/cancel'
        },
        documentation: {
          swagger: 'GET /docs',
          openapi: 'GET /api-docs.json'
        }
      },
      queryParameters: {
        list: [
          'doctorName',
          'patientEmail', 
          'status',
          'appointmentDate',
          'dateFrom',
          'dateTo',
          'priority',
          'appointmentType',
          'page',
          'limit',
          'includeStats'
        ]
      }
    };

    return successResponse(message, 'API Health Check Successful');
  } catch (error) {
    console.error('Health check error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};