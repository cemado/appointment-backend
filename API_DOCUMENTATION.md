# Appointment Backend API - Documentación Completa

## 📋 Resumen del Proyecto

Este es un backend serverless para la gestión de citas médicas, construido con:

- **Serverless Framework** para despliegue en AWS Lambda
- **TypeScript** para tipado fuerte y mejor desarrollo
- **API Gateway** para enrutamiento HTTP
- **Node.js 20.x** como runtime
- **Arquitectura RESTful** con handlers CRUD completos

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

1. **CRUD Completo de Citas**
   - Crear citas con validaciones
   - Listar citas con filtros y paginación
   - Obtener cita específica por ID
   - Actualizar citas existentes
   - Eliminar citas

2. **Funcionalidades Avanzadas**
   - Confirmación y cancelación de citas
   - Estadísticas detalladas
   - Validación de disponibilidad de horarios
   - Filtros por múltiples criterios
   - Paginación de resultados

3. **Arquitectura Robusta**
   - Manejo centralizado de respuestas
   - Validaciones de datos
   - Logging de requests
   - Manejo de errores consistente
   - Tipos TypeScript completos

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   API Gateway   │────▶│  AWS Lambda     │────▶│  In-Memory DB   │
│  (HTTP Routes)  │    │   (Handlers)    │    │   (Temporary)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       │
         │                       ▼
┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │
│   Frontend      │    │    CloudWatch   │
│   Application   │    │     Logs        │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
```

## 🛣️ Endpoints de la API

### 1. Health Check
```
GET /hello
```
- **Descripción**: Verifica el estado de la API
- **Respuesta**: Información de endpoints disponibles

### 2. Crear Cita
```
POST /appointments
```
- **Body**:
```json
{
  "patientName": "string (required, min 2 chars)",
  "patientEmail": "string (required, valid email)",
  "patientPhone": "string (optional)",
  "doctorName": "string (required, min 2 chars)",
  "doctorSpecialty": "string (optional)",
  "appointmentDate": "string (required, YYYY-MM-DD)",
  "appointmentTime": "string (required, HH:MM)",
  "duration": "number (optional, default: 30)",
  "priority": "string (optional: low|medium|high|urgent, default: medium)",
  "appointmentType": "string (optional: consultation|follow-up|procedure|emergency)",
  "notes": "string (optional)",
  "symptoms": "string (optional)",
  "roomNumber": "string (optional)",
  "cost": "number (optional)",
  "insuranceInfo": {
    "provider": "string",
    "policyNumber": "string",
    "coverageType": "string"
  }
}
```

### 3. Listar Citas
```
GET /appointments?[query_params]
```
- **Query Parameters**:
  - `doctorName`: Filtrar por nombre del doctor
  - `patientEmail`: Filtrar por email del paciente
  - `status`: Filtrar por estado (scheduled|confirmed|in-progress|completed|cancelled|no-show)
  - `appointmentDate`: Filtrar por fecha específica
  - `dateFrom`: Filtrar desde fecha
  - `dateTo`: Filtrar hasta fecha
  - `priority`: Filtrar por prioridad
  - `appointmentType`: Filtrar por tipo de cita
  - `page`: Número de página (default: 1)
  - `limit`: Elementos por página (default: 10)
  - `includeStats`: Incluir estadísticas (true|false)

### 4. Obtener Cita Específica
```
GET /appointments/{id}
```

### 5. Actualizar Cita
```
PUT /appointments/{id}
```
- **Body**: Similar al POST pero todos los campos son opcionales

### 6. Eliminar Cita
```
DELETE /appointments/{id}
```

### 7. Obtener Estadísticas
```
GET /appointments/stats
```
- **Respuesta**:
```json
{
  "total": 50,
  "byStatus": { "scheduled": 20, "completed": 15, "cancelled": 5 },
  "byPriority": { "high": 10, "medium": 30, "low": 10 },
  "byType": { "consultation": 25, "follow-up": 15, "procedure": 10 },
  "byDoctor": { "Dr. Smith": 20, "Dr. Johnson": 30 },
  "upcomingToday": 5,
  "upcomingWeek": 15
}
```

### 8. Confirmar Cita
```
PATCH /appointments/{id}/confirm
```

### 9. Cancelar Cita
```
PATCH /appointments/{id}/cancel
```

## 🗂️ Estructura del Proyecto

```
appointment-backend/
├── src/
│   ├── handlers/
│   │   ├── appointments.ts     # Handlers CRUD principales
│   │   └── hello.ts           # Health check endpoint
│   ├── types/
│   │   └── appointment.ts     # Tipos TypeScript
│   └── utils/
│       ├── response.ts        # Utilidades de respuesta HTTP
│       ├── auth.ts           # Utilidades de autenticación
│       ├── database.ts       # Interfaz de base de datos
│       └── validator.ts      # Validaciones de datos
├── dist/                     # Archivos compilados
├── serverless.yml           # Configuración de Serverless
├── tsconfig.json           # Configuración de TypeScript
├── package.json           # Dependencias del proyecto
└── README.md             # Este archivo
```

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Compilar TypeScript
```bash
npm run build
```

### 3. Desarrollo Local
```bash
npm start
# La API estará disponible en http://localhost:3000
```

### 4. Despliegue a AWS
```bash
npm run deploy
```

## 🖥️ Pasos para macOS

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Instala AWS CLI:
   ```bash
   ./install-aws-macos.sh
   ```

3. Configura credenciales AWS:
   ```bash
   aws configure
   ```

4. Compila y ejecuta localmente:
   ```bash
   npm run build
   npm start
   ```

5. Despliega a AWS:
   ```bash
   npm run deploy
   ```

6. Verifica endpoints:
   ```bash
   ./test_endpoints_macos.sh
   ```

## 🧪 Pruebas de la API

### Ejemplos de Uso con cURL

#### Crear una cita:
```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Juan Pérez",
    "patientEmail": "juan@email.com",
    "doctorName": "Dr. García",
    "appointmentDate": "2025-01-15",
    "appointmentTime": "10:00",
    "priority": "high",
    "appointmentType": "consultation"
  }'
```

#### Listar citas con filtros:
```bash
curl "http://localhost:3000/appointments?doctorName=García&includeStats=true&limit=5"
```

#### Obtener estadísticas:
```bash
curl http://localhost:3000/appointments/stats
```

## 🔒 Seguridad y Mejores Prácticas

### Implementadas:
- ✅ Validación de datos de entrada
- ✅ Manejo de errores consistente
- ✅ CORS habilitado
- ✅ Logging de requests
- ✅ Validación de disponibilidad de horarios
- ✅ Tipado fuerte con TypeScript

### Recomendaciones para Producción:
- 🔄 Implementar autenticación JWT
- 🔄 Usar DynamoDB en lugar de memoria
- 🔄 Agregar rate limiting
- 🔄 Implementar tests unitarios
- 🔄 Configurar monitoring y alertas
- 🔄 Encriptación de datos sensibles

## 📊 Tipos de Datos

### Appointment Interface
```typescript
interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  doctorName: string;
  doctorSpecialty?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  appointmentType: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  notes?: string;
  symptoms?: string;
  createdAt: string;
  updatedAt: string;
  // ... campos adicionales
}
```

## 🚀 Funcionalidades Avanzadas

### 1. Sistema de Filtros
- Búsqueda por múltiples criterios
- Rangos de fechas
- Filtros combinados

### 2. Paginación
- Control de página y límite
- Metadatos de paginación en respuesta

### 3. Estadísticas en Tiempo Real
- Contadores por estado, prioridad, tipo
- Citas próximas (hoy, semana)
- Distribución por doctor

### 4. Validaciones Inteligentes
- Prevención de citas duplicadas
- Validación de fechas futuras
- Verificación de formatos

### 5. Estados de Cita Avanzados
- Múltiples estados del ciclo de vida
- Transiciones controladas
- Histórico de cambios

## 🎯 Próximos Pasos

1. **Integración con Base de Datos Real**: Migrar de memoria a DynamoDB
2. **Autenticación**: Implementar JWT y roles de usuario
3. **Notificaciones**: Emails y SMS para recordatorios
4. **Testing**: Suite completa de pruebas unitarias e integración
5. **Monitoring**: CloudWatch dashboards y alertas
6. **Performance**: Optimización y caching
7. **Mobile**: API endpoints específicos para móviles

---

**¡El sistema está listo para usar y fácilmente extensible para requisitos adicionales!**