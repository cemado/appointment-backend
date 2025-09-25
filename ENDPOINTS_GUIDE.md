# 🛣️ GUÍA COMPLETA DE ENDPOINTS - Appointment Backend API

## 📍 **ENDPOINTS DISPONIBLES**

### **Base URL:** `http://localhost:3000` (desarrollo local)

---

## 1️⃣ **HEALTH CHECK**

### `GET /hello`
**Descripción:** Verificar el estado de la API y ver todos los endpoints disponibles.

```bash
curl http://localhost:3000/hello
```

**Respuesta:**
```json
{
  "success": true,
  "message": "API Health Check Successful",
  "data": {
    "message": "¡Hola! El Backend de Citas está funcionando correctamente",
    "timestamp": "2025-09-24T10:30:00.000Z",
    "version": "2.0.0",
    "endpoints": {
      "appointments": {
        "create": "POST /appointments",
        "list": "GET /appointments",
        "get": "GET /appointments/{id}",
        "update": "PUT /appointments/{id}",
        "delete": "DELETE /appointments/{id}",
        "stats": "GET /appointments/stats",
        "confirm": "PATCH /appointments/{id}/confirm",
        "cancel": "PATCH /appointments/{id}/cancel"
      }
    }
  }
}
```

---

## 2️⃣ **CREAR CITA MÉDICA**

### `POST /appointments`
**Descripción:** Crear una nueva cita médica con validaciones completas.

```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Juan Pérez",
    "patientEmail": "juan.perez@email.com",
    "patientPhone": "+34666123456",
    "doctorName": "Dr. María García",
    "doctorSpecialty": "Cardiología",
    "appointmentDate": "2025-12-15",
    "appointmentTime": "10:00",
    "duration": 45,
    "priority": "high",
    "appointmentType": "consultation",
    "notes": "Primera consulta - dolor en el pecho",
    "symptoms": "Dolor torácico, palpitaciones",
    "roomNumber": "205",
    "cost": 150.00,
    "insuranceInfo": {
      "provider": "Sanitas",
      "policyNumber": "POL123456",
      "coverageType": "Complete"
    }
  }'
```

**Campos Requeridos:**
- `patientName` (string, min 2 chars)
- `patientEmail` (string, email válido)
- `doctorName` (string, min 2 chars)
- `appointmentDate` (string, YYYY-MM-DD)
- `appointmentTime` (string, HH:MM)

**Campos Opcionales:**
- `patientPhone`, `doctorSpecialty`, `duration`, `priority`, `appointmentType`, `notes`, `symptoms`, `roomNumber`, `cost`, `insuranceInfo`

---

## 3️⃣ **LISTAR CITAS CON FILTROS**

### `GET /appointments`
**Descripción:** Obtener lista de citas con filtros avanzados y paginación.

**Parámetros de consulta disponibles:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `doctorName` | string | Filtrar por nombre del doctor | `García` |
| `patientEmail` | string | Filtrar por email del paciente | `juan@email.com` |
| `status` | string | Estado de la cita | `scheduled`, `confirmed`, `completed` |
| `appointmentDate` | string | Fecha específica | `2025-12-15` |
| `dateFrom` | string | Desde fecha | `2025-12-01` |
| `dateTo` | string | Hasta fecha | `2025-12-31` |
| `priority` | string | Nivel de prioridad | `low`, `medium`, `high`, `urgent` |
| `appointmentType` | string | Tipo de cita | `consultation`, `follow-up`, `procedure`, `emergency` |
| `page` | number | Número de página | `1` |
| `limit` | number | Elementos por página | `10` |
| `includeStats` | boolean | Incluir estadísticas | `true` |

**Ejemplos de uso:**

```bash
# Listar todas las citas
curl "http://localhost:3000/appointments"

# Filtrar por doctor
curl "http://localhost:3000/appointments?doctorName=García"

# Filtrar por estado y prioridad
curl "http://localhost:3000/appointments?status=scheduled&priority=high"

# Rango de fechas
curl "http://localhost:3000/appointments?dateFrom=2025-12-01&dateTo=2025-12-31"

# Con paginación
curl "http://localhost:3000/appointments?page=1&limit=5"

# Con estadísticas incluidas
curl "http://localhost:3000/appointments?includeStats=true"

# Múltiples filtros combinados
curl "http://localhost:3000/appointments?doctorName=García&status=scheduled&priority=high&page=1&limit=10&includeStats=true"
```

---

## 4️⃣ **OBTENER CITA ESPECÍFICA**

### `GET /appointments/{id}`
**Descripción:** Obtener detalles de una cita específica por su ID.

```bash
curl http://localhost:3000/appointments/appointment-1727174400000-abc123def
```

---

## 5️⃣ **ACTUALIZAR CITA EXISTENTE**

### `PUT /appointments/{id}`
**Descripción:** Actualizar una cita existente (todos los campos son opcionales).

```bash
curl -X PUT http://localhost:3000/appointments/appointment-1727174400000-abc123def \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Nota actualizada - paciente reporta mejora",
    "status": "confirmed",
    "priority": "medium"
  }'
```

---

## 6️⃣ **ELIMINAR CITA**

### `DELETE /appointments/{id}`
**Descripción:** Eliminar una cita específica.

```bash
curl -X DELETE http://localhost:3000/appointments/appointment-1727174400000-abc123def
```

---

## 7️⃣ **OBTENER ESTADÍSTICAS**

### `GET /appointments/stats`
**Descripción:** Obtener estadísticas en tiempo real del sistema.

```bash
curl http://localhost:3000/appointments/stats
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "stats": {
      "total": 15,
      "byStatus": {
        "scheduled": 8,
        "confirmed": 4,
        "completed": 2,
        "cancelled": 1
      },
      "byPriority": {
        "high": 3,
        "medium": 8,
        "low": 3,
        "urgent": 1
      },
      "byType": {
        "consultation": 10,
        "follow-up": 3,
        "procedure": 1,
        "emergency": 1
      },
      "byDoctor": {
        "Dr. María García": 8,
        "Dr. Pedro Martín": 4,
        "Dr. Ana López": 3
      },
      "upcomingToday": 2,
      "upcomingWeek": 6
    }
  }
}
```

---

## 8️⃣ **CONFIRMAR CITA**

### `PATCH /appointments/{id}/confirm`
**Descripción:** Confirmar una cita (cambiar estado a 'confirmed').

```bash
curl -X PATCH http://localhost:3000/appointments/appointment-1727174400000-abc123def/confirm
```

---

## 9️⃣ **CANCELAR CITA**

### `PATCH /appointments/{id}/cancel`
**Descripción:** Cancelar una cita (cambiar estado a 'cancelled').

```bash
curl -X PATCH http://localhost:3000/appointments/appointment-1727174400000-abc123def/cancel
```

---

## 🔄 **ESTADOS POSIBLES DE CITAS**

| Estado | Descripción |
|--------|-------------|
| `scheduled` | Cita programada (inicial) |
| `confirmed` | Cita confirmada por el paciente |
| `in-progress` | Consulta en curso |
| `completed` | Consulta finalizada |
| `cancelled` | Cita cancelada |
| `no-show` | Paciente no se presentó |

---

## 🎯 **PRIORIDADES DISPONIBLES**

| Prioridad | Descripción |
|-----------|-------------|
| `low` | Prioridad baja |
| `medium` | Prioridad media (default) |
| `high` | Prioridad alta |
| `urgent` | Urgente |

---

## 🏥 **TIPOS DE CITA DISPONIBLES**

| Tipo | Descripción |
|------|-------------|
| `consultation` | Consulta regular (default) |
| `follow-up` | Seguimiento |
| `procedure` | Procedimiento médico |
| `emergency` | Emergencia |

---

## 📝 **EJEMPLOS DE RESPUESTAS**

### **Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "appointment": {
      "id": "appointment-1727174400000-abc123def",
      "patientName": "Juan Pérez",
      "patientEmail": "juan.perez@email.com",
      "doctorName": "Dr. María García",
      "appointmentDate": "2025-12-15",
      "appointmentTime": "10:00",
      "status": "scheduled",
      "priority": "high",
      "createdAt": "2025-09-24T10:30:00.000Z",
      "updatedAt": "2025-09-24T10:30:00.000Z"
    }
  }
}
```

### **Respuesta de Error:**
```json
{
  "success": false,
  "error": "Error de validación",
  "errors": [
    "El nombre del paciente debe tener al menos 2 caracteres",
    "Email inválido"
  ]
}
```

---

## 🧪 **SCRIPT DE PRUEBAS RÁPIDAS**

```bash
# 1. Health Check
curl http://localhost:3000/hello

# 2. Crear cita de prueba
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{"patientName": "Test User", "patientEmail": "test@test.com", "doctorName": "Dr. Test", "appointmentDate": "2025-12-15", "appointmentTime": "10:00"}'

# 3. Listar todas las citas
curl http://localhost:3000/appointments

# 4. Obtener estadísticas
curl http://localhost:3000/appointments/stats
```

---

## ⚡ **COMANDOS PARA LEVANTAR LA APLICACIÓN**

```bash
# Instalar dependencias (solo primera vez)
npm install

# Compilar TypeScript
npm run build

# Levantar servidor local
npm start

# La API estará disponible en: http://localhost:3000
```

Una vez levantada, puedes probar cualquiera de los endpoints listados arriba.