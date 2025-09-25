export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  doctorName: string;
  doctorSpecialty?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number; // en minutos
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  appointmentType: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  notes?: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  // Información adicional
  roomNumber?: string;
  cost?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverageType: string;
  };
}

export interface CreateAppointmentRequest {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  doctorName: string;
  doctorSpecialty?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  appointmentType?: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  notes?: string;
  symptoms?: string;
  roomNumber?: string;
  cost?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverageType: string;
  };
}

export interface UpdateAppointmentRequest {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number;
  status?: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  appointmentType?: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  notes?: string;
  symptoms?: string;
  roomNumber?: string;
  cost?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverageType: string;
  };
}

export interface AppointmentFilters {
  doctorName?: string;
  patientEmail?: string;
  status?: string;
  appointmentDate?: string;
  dateFrom?: string;
  dateTo?: string;
  priority?: string;
  appointmentType?: string;
}

export interface AppointmentStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byType: Record<string, number>;
  byDoctor: Record<string, number>;
  upcomingToday: number;
  upcomingWeek: number;
}

// Tipos para respuestas de API
export interface AppointmentListResponse {
  appointments: Appointment[];
  total: number;
  page?: number;
  limit?: number;
  filters?: AppointmentFilters;
  stats?: AppointmentStats;
}

export interface AppointmentResponse {
  appointment: Appointment;
}