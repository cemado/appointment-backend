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
const calculateStats = (): AppointmentStats => {
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
    const conflictingAppointment = appointments.find(apt => 
      apt.doctorName === data.doctorName &&
      apt.appointmentDate === data.appointmentDate &&
      apt.appointmentTime === data.appointmentTime &&
      (apt.status === 'scheduled' || apt.status === 'confirmed')
    );

    if (conflictingAppointment) {
      return errorResponse('Ya existe una cita programada para ese doctor en ese horario', 409);
    }

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

    appointments.push(appointment);

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
    logRequest(event, context);

    // Extraer parámetros de consulta
    const queryParams = event.queryStringParameters || {};
    const {
      doctorName,
      patientEmail,
      status,
      appointmentDate,
      dateFrom,
      dateTo,
      priority,
      appointmentType,
      page = '1',
      limit = '10',
      includeStats = 'false'
    } = queryParams;

    // Aplicar filtros
    let filteredAppointments = [...appointments];

    if (doctorName) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.doctorName.toLowerCase().includes(doctorName.toLowerCase())
      );
    }

    if (patientEmail) {
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.patientEmail.toLowerCase().includes(patientEmail.toLowerCase())
      );
    }

    if (status) {
      filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
    }

    if (appointmentDate) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate === appointmentDate);
    }

    if (dateFrom) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate >= dateFrom);
    }

    if (dateTo) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentDate <= dateTo);
    }

    if (priority) {
      filteredAppointments = filteredAppointments.filter(apt => apt.priority === priority);
    }

    if (appointmentType) {
      filteredAppointments = filteredAppointments.filter(apt => apt.appointmentType === appointmentType);
    }

    // Ordenar por fecha y hora
    filteredAppointments.sort((a, b) => {
      const dateTimeA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
      const dateTimeB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });

    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    const response: any = {
      appointments: paginatedAppointments,
      total: filteredAppointments.length,
      page: pageNum,
      limit: limitNum
    };

    // Incluir estadísticas si se solicita
    if (includeStats === 'true') {
      response.stats = calculateStats();
    }

    return successResponse(response, 'Citas obtenidas exitosamente');
  } catch (error) {
    console.error('Error listing appointments:', error);
    return errorResponse('Internal server error');
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

    const appointment = appointments.find(a => a.id === appointmentId);

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
    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

    if (appointmentIndex === -1) {
      return errorResponse('Appointment not found', 404);
    }

    // Si se está actualizando fecha/hora/doctor, verificar disponibilidad
    if (data.appointmentDate || data.appointmentTime || data.doctorName) {
      const existingAppointment = appointments[appointmentIndex];
      const checkDate = data.appointmentDate || existingAppointment.appointmentDate;
      const checkTime = data.appointmentTime || existingAppointment.appointmentTime;
      const checkDoctor = data.doctorName || existingAppointment.doctorName;

      const conflictingAppointment = appointments.find(apt => 
        apt.id !== appointmentId &&
        apt.doctorName === checkDoctor &&
        apt.appointmentDate === checkDate &&
        apt.appointmentTime === checkTime &&
        (apt.status === 'scheduled' || apt.status === 'confirmed')
      );

      if (conflictingAppointment) {
        return errorResponse('Ya existe una cita programada para ese doctor en ese horario', 409);
      }
    }

    // Actualizar solo los campos proporcionados
    const updatedAppointment: Appointment = {
      ...appointments[appointmentIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    appointments[appointmentIndex] = updatedAppointment;

    return successResponse(
      { appointment: updatedAppointment },
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

    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

    if (appointmentIndex === -1) {
      return errorResponse('Appointment not found', 404);
    }

    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];

    return successResponse(
      { appointment: deletedAppointment },
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

    const statistics = calculateStats();

    return successResponse(
      { stats: statistics },
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

    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

    if (appointmentIndex === -1) {
      return errorResponse('Appointment not found', 404);
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    };

    return successResponse(
      { appointment: appointments[appointmentIndex] },
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

    const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);

    if (appointmentIndex === -1) {
      return errorResponse('Appointment not found', 404);
    }

    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    };

    return successResponse(
      { appointment: appointments[appointmentIndex] },
      'Cita cancelada exitosamente'
    );
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return errorResponse('Internal server error');
  }
};