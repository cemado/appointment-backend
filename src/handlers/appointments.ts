import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentFilters,
  AppointmentStats
} from '../types/appointment';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/response';
import { logRequest } from '../utils/auth';
import { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../utils/database';
import { DYNAMODB_TABLE_NAME } from '../commons/constants';

// Simulamos una base de datos en memoria (en producción usarías DynamoDB)
let appointments: Appointment[] = [];

// Función para generar ID único
const generateId = (): string => {
  return `appointment-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Función para validar datos básicos
const validateAppointmentData = (data: CreateAppointmentRequest): string[] => {
  const errors: string[] = [];
  
  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.push('El nombre del paciente debe tener al menos 2 caracteres');
  }
  
  if (!data.patientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patientEmail)) {
    errors.push('Email inválido');
  }
  
  if (!data.doctorName || data.doctorName.trim().length < 2) {
    errors.push('El nombre del doctor debe tener al menos 2 caracteres');
  }
  
  if (!data.appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.appointmentDate)) {
    errors.push('Fecha debe estar en formato YYYY-MM-DD');
  }
  
  if (!data.appointmentTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.appointmentTime)) {
    errors.push('Hora debe estar en formato HH:MM');
  }

  // Validar que la fecha no sea en el pasado
  if (data.appointmentDate) {
    const appointmentDateTime = new Date(`${data.appointmentDate}T${data.appointmentTime || '00:00'}`);
    if (appointmentDateTime < new Date()) {
      errors.push('La fecha y hora de la cita no puede ser en el pasado');
    }
  }
  
  return errors;
};

// Función para calcular estadísticas
const calculateStats = (appointments: Appointment[]): AppointmentStats => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const stats: AppointmentStats = {
    total: appointments.length,
    byStatus: {},
    byPriority: {},
    byType: {},
    byDoctor: {},
    upcomingToday: 0,
    upcomingWeek: 0
  };

  appointments.forEach(appointment => {
    // Por estado
    stats.byStatus[appointment.status] = (stats.byStatus[appointment.status] || 0) + 1;
    
    // Por prioridad
    stats.byPriority[appointment.priority] = (stats.byPriority[appointment.priority] || 0) + 1;
    
    // Por tipo
    stats.byType[appointment.appointmentType] = (stats.byType[appointment.appointmentType] || 0) + 1;
    
    // Por doctor
    stats.byDoctor[appointment.doctorName] = (stats.byDoctor[appointment.doctorName] || 0) + 1;
    
    // Citas de hoy
    if (appointment.appointmentDate === today && appointment.status !== 'cancelled') {
      stats.upcomingToday++;
    }
    
    // Citas de la próxima semana
    if (appointment.appointmentDate >= today && appointment.appointmentDate <= nextWeek && appointment.status !== 'cancelled') {
      stats.upcomingWeek++;
    }
  });

  return stats;
};

export const create = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const data: CreateAppointmentRequest = JSON.parse(event.body);

    // Validar datos
    const validationErrors = validateAppointmentData(data);
    if (validationErrors.length > 0) {
      return validationErrorResponse(validationErrors);
    }

    // Verificar disponibilidad (no permitir citas duplicadas en el mismo horario con el mismo doctor)
    // (Este filtro solo aplica si tienes todos los datos en memoria, para DynamoDB deberías hacer una consulta)
    // Aquí solo guardamos la cita

    const appointment: Appointment = {
      id: generateId(),
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      doctorName: data.doctorName,
      doctorSpecialty: data.doctorSpecialty,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      duration: data.duration || 30,
      status: 'scheduled',
      priority: data.priority || 'medium',
      appointmentType: data.appointmentType || 'consultation',
      notes: data.notes,
      symptoms: data.symptoms,
      roomNumber: data.roomNumber,
      cost: data.cost,
      insuranceInfo: data.insuranceInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en DynamoDB
    await ddbDocClient.send(
      new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: appointment,
      })
    );

    return successResponse(
      { appointment },
      'Cita creada exitosamente',
      201
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return errorResponse('Internal server error');
  }
};

export const list = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const query = event.queryStringParameters || {};
    const {
      doctorName,
      patientEmail,
      status,
      appointmentDate,
      priority,
      appointmentType,
      limit = '10',
      lastKey,
      includeStats // <-- Nuevo parámetro
    } = query;

    // Construir filtros para DynamoDB Scan
    let filterExpressions: string[] = [];
    let expressionAttributeValues: Record<string, any> = {};
    let expressionAttributeNames: Record<string, string> = {};

    if (status) {
      filterExpressions.push('#status = :status');
      expressionAttributeValues[':status'] = status;
      expressionAttributeNames['#status'] = 'status';
    }
    if (doctorName) {
      filterExpressions.push('doctorName = :doctorName');
      expressionAttributeValues[':doctorName'] = doctorName;
    }
    if (patientEmail) {
      filterExpressions.push('patientEmail = :patientEmail');
      expressionAttributeValues[':patientEmail'] = patientEmail;
    }
    if (appointmentDate) {
      filterExpressions.push('appointmentDate = :appointmentDate');
      expressionAttributeValues[':appointmentDate'] = appointmentDate;
    }
    if (priority) {
      filterExpressions.push('priority = :priority');
      expressionAttributeValues[':priority'] = priority;
    }
    if (appointmentType) {
      filterExpressions.push('appointmentType = :appointmentType');
      expressionAttributeValues[':appointmentType'] = appointmentType;
    }

    // Configurar el comando Scan
    const scanParams: any = {
      TableName: DYNAMODB_TABLE_NAME,
      Limit: parseInt(limit, 10)
    };

    if (filterExpressions.length > 0) {
      scanParams.FilterExpression = filterExpressions.join(' AND ');
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
      if (Object.keys(expressionAttributeNames).length > 0) {
        scanParams.ExpressionAttributeNames = expressionAttributeNames;
      }
    }

    // Si recibimos lastKey, lo usamos para paginación
    if (lastKey) {
      try {
        scanParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
      } catch (err) {
        // Si el lastKey no es válido, lo ignoramos
      }
    }

    // Ejecutar el Scan
    const result = await ddbDocClient.send(new ScanCommand(scanParams));
    const appointments = result.Items || [];
    const nextKey = result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null;

    // Si se solicita includeStats, calcular estadísticas
    let stats: AppointmentStats | undefined;
    if (includeStats === 'true') {
      stats = calculateStats(appointments as Appointment[]);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        appointments,
        count: appointments.length,
        nextKey,
        filters: { doctorName, patientEmail, status, appointmentDate, priority, appointmentType },
        limit: parseInt(limit, 10),
        ...(stats ? { stats } : {}) // Solo incluir si existe
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error listing appointments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

export const get = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    const appointmentId = event.pathParameters?.id;

    if (!appointmentId) {
      return errorResponse('Appointment ID is required', 400);
    }

    // Buscar el registro en DynamoDB
    const result = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );

    const appointment = result.Item;

    if (!appointment) {
      return errorResponse('Appointment not found', 404);
    }

    return successResponse({ appointment }, 'Cita obtenida exitosamente');
  } catch (error) {
    console.error('Error getting appointment:', error);
    return errorResponse('Internal server error');
  }
};

export const update = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    const appointmentId = event.pathParameters?.id;

    if (!appointmentId) {
      return errorResponse('Appointment ID is required', 400);
    }

    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const data: UpdateAppointmentRequest = JSON.parse(event.body);

    // Verificar si existe la cita
    const getResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );
    const existingAppointment = getResult.Item;

    if (!existingAppointment) {
      return errorResponse('Appointment not found', 404);
    }

    // Si se está actualizando fecha/hora/doctor, verificar disponibilidad
    if (data.appointmentDate || data.appointmentTime || data.doctorName) {
      const scanParams: any = {
        TableName: DYNAMODB_TABLE_NAME,
        FilterExpression:
          'id <> :id AND doctorName = :doctorName AND appointmentDate = :appointmentDate AND appointmentTime = :appointmentTime AND (#status = :scheduled OR #status = :confirmed)',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':id': appointmentId,
          ':doctorName': data.doctorName || existingAppointment.doctorName,
          ':appointmentDate': data.appointmentDate || existingAppointment.appointmentDate,
          ':appointmentTime': data.appointmentTime || existingAppointment.appointmentTime,
          ':scheduled': 'scheduled',
          ':confirmed': 'confirmed'
        }
      };
      const conflictResult = await ddbDocClient.send(new ScanCommand(scanParams));
      if (conflictResult.Items && conflictResult.Items.length > 0) {
        return errorResponse('Ya existe una cita programada para ese doctor en ese horario', 409);
      }
    }

    // Construir expresión de actualización dinámica
    const updateFields = Object.keys(data);
    const updateExpression =
      'set ' +
      updateFields.map((field) => `#${field} = :${field}`).join(', ') +
      ', #updatedAt = :updatedAt';

    const expressionAttributeNames = updateFields.reduce(
      (acc, field) => ({ ...acc, [`#${field}`]: field }),
      { '#updatedAt': 'updatedAt' }
    );

    const expressionAttributeValues = updateFields.reduce(
      (acc, field) => ({ ...acc, [`:${field}`]: (data as any)[field] }),
      { ':updatedAt': new Date().toISOString() }
    );

    // Actualizar en DynamoDB
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      })
    );

    // Obtener el registro actualizado
    const updatedResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );

    return successResponse(
      { appointment: updatedResult.Item },
      'Cita actualizada exitosamente'
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return errorResponse('Internal server error');
  }
};

export const remove = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    const appointmentId = event.pathParameters?.id;

    if (!appointmentId) {
      return errorResponse('Appointment ID is required', 400);
    }

    // Verificar si existe la cita antes de eliminar
    const getResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );
    const existingAppointment = getResult.Item;

    if (!existingAppointment) {
      return errorResponse('Appointment not found', 404);
    }

    // Eliminar el registro en DynamoDB
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );

    return successResponse(
      { appointment: existingAppointment },
      'Cita eliminada exitosamente'
    );
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return errorResponse('Internal server error');
  }
};

// Nuevo endpoint para obtener estadísticas
export const stats = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    // Obtener todas las citas desde DynamoDB
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: DYNAMODB_TABLE_NAME
      })
    );
    const appointments: Appointment[] = (result.Items || []).map(item => item as Appointment);

    // Calcular estadísticas
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const stats: AppointmentStats = {
      total: appointments.length,
      byStatus: {},
      byPriority: {},
      byType: {},
      byDoctor: {},
      upcomingToday: 0,
      upcomingWeek: 0
    };

    appointments.forEach(appointment => {
      // Por estado
      stats.byStatus[appointment.status] = (stats.byStatus[appointment.status] || 0) + 1;

      // Por prioridad
      stats.byPriority[appointment.priority] = (stats.byPriority[appointment.priority] || 0) + 1;

      // Por tipo
      stats.byType[appointment.appointmentType] = (stats.byType[appointment.appointmentType] || 0) + 1;

      // Por doctor
      stats.byDoctor[appointment.doctorName] = (stats.byDoctor[appointment.doctorName] || 0) + 1;

      // Citas de hoy
      if (appointment.appointmentDate === today && appointment.status !== 'cancelled') {
        stats.upcomingToday++;
      }

      // Citas de la próxima semana
      if (
        appointment.appointmentDate >= today &&
        appointment.appointmentDate <= nextWeek &&
        appointment.status !== 'cancelled'
      ) {
        stats.upcomingWeek++;
      }
    });

    return successResponse(
      { stats },
      'Estadísticas obtenidas exitosamente'
    );
  } catch (error) {
    console.error('Error getting stats:', error);
    return errorResponse('Internal server error');
  }
};

// Endpoint para confirmar cita
export const confirm = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    const appointmentId = event.pathParameters?.id;

    if (!appointmentId) {
      return errorResponse('Appointment ID is required', 400);
    }

    // Verificar si existe la cita
    const getResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );
    const existingAppointment = getResult.Item;

    if (!existingAppointment) {
      return errorResponse('Appointment not found', 404);
    }

    // Actualizar el estado a 'confirmed'
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status', },
        ExpressionAttributeValues: { ':status': 'confirmed', ':updatedAt': new Date().toISOString() },
        ReturnValues: 'ALL_NEW'
      })
    );

    // Obtener el registro actualizado
    const updatedResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );

    return successResponse(
      { appointment: updatedResult.Item },
      'Cita confirmada exitosamente'
    );
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return errorResponse('Internal server error');
  }
};

// Endpoint para cancelar cita
export const cancel = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    logRequest(event, context);

    const appointmentId = event.pathParameters?.id;

    if (!appointmentId) {
      return errorResponse('Appointment ID is required', 400);
    }

    // Verificar si existe la cita
    const getResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );
    const existingAppointment = getResult.Item;

    if (!existingAppointment) {
      return errorResponse('Appointment not found', 404);
    }

    // Actualizar el estado a 'cancelled'
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId },
        UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': 'cancelled', ':updatedAt': new Date().toISOString() },
        ReturnValues: 'ALL_NEW'
      })
    );

    // Obtener el registro actualizado
    const updatedResult = await ddbDocClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Key: { id: appointmentId }
      })
    );

    return successResponse(
      { appointment: updatedResult.Item },
      'Cita cancelada exitosamente'
    );
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return errorResponse('Internal server error');
  }
};