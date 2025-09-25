import { z } from 'zod';

// Schema de validación para crear cita
export const createAppointmentSchema = z.object({
  patientName: z.string().min(2, 'El nombre del paciente debe tener al menos 2 caracteres'),
  patientEmail: z.string().email('Email inválido'),
  doctorName: z.string().min(2, 'El nombre del doctor debe tener al menos 2 caracteres'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  appointmentTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora debe estar en formato HH:MM'),
  notes: z.string().optional()
});

// Schema de validación para actualizar cita
export const updateAppointmentSchema = z.object({
  patientName: z.string().min(2).optional(),
  patientEmail: z.string().email().optional(),
  doctorName: z.string().min(2).optional(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  appointmentTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  notes: z.string().optional()
});

// Validador de UUID
export const uuidSchema = z.string().uuid('ID inválido');

// Función helper para validar datos
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return { success: false, errors };
  }
};