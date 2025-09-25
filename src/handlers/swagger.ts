import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Configuración de Swagger/OpenAPI
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Appointment Backend API',
    version: '2.0.0',
    description: '🏥 Sistema completo de gestión de citas médicas con arquitectura serverless',
    contact: {
      name: 'API Support',
      email: 'support@appointment-api.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo local'
    }
  ],
  tags: [
    {
      name: 'Health Check',
      description: 'Endpoints para verificar el estado de la API'
    },
    {
      name: 'AWS Health',
      description: 'Endpoints para verificar conexión y configuración de AWS'
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
    '/hello': {
      get: {
        tags: ['Health Check'],
        summary: 'Health check del sistema',
        description: 'Verifica el estado de la API y muestra todos los endpoints disponibles',
        responses: {
          200: {
            description: 'API funcionando correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/appointments': {
      post: {
        tags: ['Appointments'],
        summary: 'Crear nueva cita médica',
        description: 'Crear una nueva cita con validaciones completas y verificación de disponibilidad',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['patientName', 'patientEmail', 'doctorName', 'appointmentDate', 'appointmentTime'],
                properties: {
                  patientName: { type: 'string', minLength: 2, example: 'Juan Pérez' },
                  patientEmail: { type: 'string', format: 'email', example: 'juan.perez@email.com' },
                  patientPhone: { type: 'string', example: '+34666123456' },
                  doctorName: { type: 'string', minLength: 2, example: 'Dr. María García' },
                  doctorSpecialty: { type: 'string', example: 'Cardiología' },
                  appointmentDate: { type: 'string', format: 'date', example: '2025-12-15' },
                  appointmentTime: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', example: '10:00' },
                  duration: { type: 'number', example: 45, description: 'Duración en minutos' },
                  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
                  appointmentType: { type: 'string', enum: ['consultation', 'follow-up', 'procedure', 'emergency'], example: 'consultation' },
                  notes: { type: 'string', example: 'Primera consulta - dolor en el pecho' },
                  symptoms: { type: 'string', example: 'Dolor torácico, palpitaciones' },
                  roomNumber: { type: 'string', example: '205' },
                  cost: { type: 'number', example: 150.00 },
                  insuranceInfo: {
                    type: 'object',
                    properties: {
                      provider: { type: 'string', example: 'Sanitas' },
                      policyNumber: { type: 'string', example: 'POL123456' },
                      coverageType: { type: 'string', example: 'Complete' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Cita creada exitosamente' },
          400: { description: 'Error de validación' },
          409: { description: 'Conflicto - horario no disponible' }
        }
      },
      get: {
        tags: ['Appointments'],
        summary: 'Listar citas con filtros',
        description: 'Obtener lista de citas con filtros avanzados, paginación y ordenamiento',
        parameters: [
          { name: 'doctorName', in: 'query', schema: { type: 'string' }, description: 'Filtrar por nombre del doctor' },
          { name: 'patientEmail', in: 'query', schema: { type: 'string' }, description: 'Filtrar por email del paciente' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'] } },
          { name: 'appointmentDate', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Fecha específica' },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Desde fecha' },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' }, description: 'Hasta fecha' },
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] } },
          { name: 'appointmentType', in: 'query', schema: { type: 'string', enum: ['consultation', 'follow-up', 'procedure', 'emergency'] } },
          { name: 'page', in: 'query', schema: { type: 'number', default: 1 }, description: 'Número de página' },
          { name: 'limit', in: 'query', schema: { type: 'number', default: 10 }, description: 'Elementos por página' },
          { name: 'includeStats', in: 'query', schema: { type: 'boolean' }, description: 'Incluir estadísticas en la respuesta' }
        ],
        responses: {
          200: { description: 'Lista de citas obtenida exitosamente' }
        }
      }
    },
    '/appointments/{id}': {
      get: {
        tags: ['Appointments'],
        summary: 'Obtener cita específica',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Cita obtenida exitosamente' },
          404: { description: 'Cita no encontrada' }
        }
      },
      put: {
        tags: ['Appointments'],
        summary: 'Actualizar cita existente',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Todos los campos son opcionales para actualización',
                properties: {
                  patientName: { type: 'string' },
                  patientEmail: { type: 'string', format: 'email' },
                  doctorName: { type: 'string' },
                  appointmentDate: { type: 'string', format: 'date' },
                  appointmentTime: { type: 'string' },
                  status: { type: 'string', enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'] },
                  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                  notes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Cita actualizada exitosamente' },
          404: { description: 'Cita no encontrada' }
        }
      },
      delete: {
        tags: ['Appointments'],
        summary: 'Eliminar cita',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Cita eliminada exitosamente' },
          404: { description: 'Cita no encontrada' }
        }
      }
    },
    '/appointments/stats': {
      get: {
        tags: ['Statistics'],
        summary: 'Obtener estadísticas del sistema',
        description: 'Estadísticas en tiempo real por estado, prioridad, tipo, doctor, etc.',
        responses: {
          200: {
            description: 'Estadísticas obtenidas exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        stats: {
                          type: 'object',
                          properties: {
                            total: { type: 'number' },
                            byStatus: { type: 'object' },
                            byPriority: { type: 'object' },
                            byType: { type: 'object' },
                            byDoctor: { type: 'object' },
                            upcomingToday: { type: 'number' },
                            upcomingWeek: { type: 'number' }
                          }
                        }
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
    '/appointments/{id}/confirm': {
      patch: {
        tags: ['Appointments'],
        summary: 'Confirmar cita',
        description: 'Cambiar el estado de la cita a "confirmed"',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Cita confirmada exitosamente' },
          404: { description: 'Cita no encontrada' }
        }
      }
    },
    '/appointments/{id}/cancel': {
      patch: {
        tags: ['Appointments'],
        summary: 'Cancelar cita',
        description: 'Cambiar el estado de la cita a "cancelled"',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Cita cancelada exitosamente' },
          404: { description: 'Cita no encontrada' }
        }
      }
    },
    '/aws-health': {
      get: {
        tags: ['AWS Health'],
        summary: 'AWS Health Check Completo',
        description: 'Verifica el estado completo de la conexión con AWS, configuración de Lambda y variables de entorno',
        responses: {
          200: {
            description: 'Health check completado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'AWS Health Check HEALTHY' },
                    data: {
                      type: 'object',
                      properties: {
                        region: { type: 'string', example: 'us-east-1' },
                        accountId: { type: 'string', example: '123456789012' },
                        stage: { type: 'string', example: 'dev' },
                        lambdaContext: {
                          type: 'object',
                          properties: {
                            functionName: { type: 'string', example: 'appointment-backend-dev-awsHealth' },
                            functionVersion: { type: 'string', example: '$LATEST' },
                            memoryLimitInMB: { type: 'number', example: 128 },
                            remainingTimeInMillis: { type: 'number', example: 14500 }
                          }
                        },
                        environment: {
                          type: 'object',
                          properties: {
                            nodeEnv: { type: 'string', example: 'development' },
                            awsRegion: { type: 'string', example: 'us-east-1' }
                          }
                        },
                        timestamp: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['healthy', 'warning', 'error'], example: 'healthy' },
                        checks: {
                          type: 'object',
                          properties: {
                            lambdaExecution: { type: 'boolean', example: true },
                            environmentVariables: { type: 'boolean', example: true },
                            awsServices: { type: 'boolean', example: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Error en el health check',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'AWS Health Check Failed' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/aws-config': {
      get: {
        tags: ['AWS Health'],
        summary: 'Configuración AWS Actual',
        description: 'Muestra la configuración actual del ambiente AWS, Lambda y sistema operativo',
        responses: {
          200: {
            description: 'Configuración obtenida exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'AWS Configuration Retrieved' },
                    data: {
                      type: 'object',
                      properties: {
                        aws: {
                          type: 'object',
                          properties: {
                            region: { type: 'string', example: 'us-east-1' },
                            stage: { type: 'string', example: 'dev' },
                            runtime: { type: 'string', example: 'v20.10.0' },
                            architecture: { type: 'string', example: 'x64' },
                            platform: { type: 'string', example: 'linux' }
                          }
                        },
                        lambda: {
                          type: 'object',
                          properties: {
                            functionName: { type: 'string', example: 'appointment-backend-dev-awsConfig' },
                            functionVersion: { type: 'string', example: '$LATEST' },
                            memoryLimit: { type: 'string', example: '128 MB' },
                            remainingTime: { type: 'string', example: '9500 ms' }
                          }
                        },
                        environment: {
                          type: 'object',
                          properties: {
                            nodeEnv: { type: 'string', example: 'development' },
                            timezone: { type: 'string', example: 'UTC' },
                            locale: { type: 'string', example: 'en_US.UTF-8' }
                          }
                        },
                        serverless: {
                          type: 'object',
                          properties: {
                            stage: { type: 'string', example: 'dev' },
                            service: { type: 'string', example: 'appointment-backend' },
                            provider: { type: 'string', example: 'aws' }
                          }
                        }
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
    '/aws-connectivity': {
      get: {
        tags: ['AWS Health'],
        summary: 'Test de Conectividad AWS',
        description: 'Prueba la conectividad con servicios específicos de AWS y proporciona diagnósticos',
        responses: {
          200: {
            description: 'Test de conectividad completado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'AWS Connectivity Test Completed' },
                    data: {
                      type: 'object',
                      properties: {
                        summary: {
                          type: 'object',
                          properties: {
                            totalTests: { type: 'number', example: 3 },
                            passedTests: { type: 'number', example: 3 },
                            failedTests: { type: 'number', example: 0 },
                            successRate: { type: 'string', example: '100%' },
                            totalResponseTime: { type: 'string', example: '25ms' }
                          }
                        },
                        tests: {
                          type: 'object',
                          properties: {
                            lambdaExecution: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', enum: ['passed', 'failed'], example: 'passed' },
                                message: { type: 'string', example: 'Lambda function is executing successfully' },
                                responseTime: { type: 'number', example: 0 }
                              }
                            },
                            environmentAccess: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', enum: ['passed', 'failed'], example: 'passed' },
                                message: { type: 'string', example: 'Environment variables accessible' },
                                responseTime: { type: 'number', example: 0 }
                              }
                            },
                            contextAccess: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', enum: ['passed', 'failed'], example: 'passed' },
                                message: { type: 'string', example: 'Lambda context accessible' },
                                responseTime: { type: 'number', example: 0 }
                              }
                            }
                          }
                        },
                        recommendations: {
                          type: 'array',
                          items: { type: 'string' },
                          example: ['All basic connectivity tests passed', 'System is ready for deployment']
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Error en el test de conectividad',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'AWS connectivity test failed' }
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
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'appointment-1727174400000-abc123def' },
          patientName: { type: 'string', example: 'Juan Pérez' },
          patientEmail: { type: 'string', example: 'juan.perez@email.com' },
          patientPhone: { type: 'string', example: '+34666123456' },
          doctorName: { type: 'string', example: 'Dr. María García' },
          doctorSpecialty: { type: 'string', example: 'Cardiología' },
          appointmentDate: { type: 'string', example: '2025-12-15' },
          appointmentTime: { type: 'string', example: '10:00' },
          duration: { type: 'number', example: 45 },
          status: { type: 'string', enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
          appointmentType: { type: 'string', enum: ['consultation', 'follow-up', 'procedure', 'emergency'] },
          notes: { type: 'string', example: 'Primera consulta' },
          symptoms: { type: 'string', example: 'Dolor torácico' },
          roomNumber: { type: 'string', example: '205' },
          cost: { type: 'number', example: 150.00 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
};

export const swagger = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Generar HTML de Swagger UI
    const swaggerHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Appointment Backend API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
      html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
      *, *:before, *:after { box-sizing: inherit; }
      body { margin:0; background: #fafafa; }
      .swagger-ui .topbar { background-color: #1976d2; }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
      .info { margin: 20px 0; }
      .info h1 { color: #1976d2; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: window.location.origin + '/api-docs.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                tryItOutEnabled: true,
                filter: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
            });
        }
    </script>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
      body: swaggerHTML,
    };
  } catch (error) {
    console.error('Error generating Swagger UI:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Could not generate Swagger documentation'
      }),
    };
  }
};

export const apiDocs = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(swaggerDocument),
  };
};

/**
 * 📋 Swagger UI - Interfaz visual interactiva para documentación de API
 * GET /docs - Swagger UI HTML con todas las APIs documentadas incluyendo AWS Health
 */
export const docs = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const swaggerUIHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>🏥 Appointment Backend API - Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
    .swagger-ui .topbar {
      background-color: #1f4e79;
    }
    .swagger-ui .topbar .link {
      color: #ffffff;
    }
    .swagger-ui .info .title {
      color: #1f4e79;
    }
    .custom-header {
      background: linear-gradient(135deg, #1f4e79 0%, #2980b9 100%);
      color: white;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
    }
    .custom-header h1 {
      margin: 0;
      font-size: 2.5em;
    }
    .custom-header p {
      margin: 10px 0 0 0;
      font-size: 1.2em;
      opacity: 0.9;
    }
    .feature-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      margin: 5px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="custom-header">
    <h1>🏥 Appointment Backend API</h1>
    <p>Sistema completo de gestión de citas médicas con arquitectura serverless</p>
    <div>
      <span class="feature-badge">✅ 14 Endpoints</span>
      <span class="feature-badge">🔍 AWS Health Check</span>
      <span class="feature-badge">📊 Estadísticas en tiempo real</span>
      <span class="feature-badge">🚀 Serverless</span>
    </div>
  </div>
  
  <div id="swagger-ui"></div>
  
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        docExpansion: 'list',
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        filter: true,
        validatorUrl: null,
        showRequestHeaders: true,
        showCommonExtensions: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2
      });
    }
  </script>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: swaggerUIHtml,
    };
  } catch (error) {
    console.error('Error generating Swagger UI:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
      body: `
        <html>
          <head><title>Error - Swagger UI</title></head>
          <body>
            <h1>🚨 Error loading Swagger UI</h1>
            <p>Could not generate API documentation interface.</p>
            <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p><a href="/api-docs.json">View raw OpenAPI JSON</a></p>
          </body>
        </html>
      `,
    };
  }
};