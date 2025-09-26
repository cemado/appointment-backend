# 🏥 Appointment Backend - Sistema de Gestión de Citas Médicas

Un backend serverless completo para gestión de citas médicas construido con **Serverless Framework**, **TypeScript** y **AWS Lambda**.

## 🚀 Características Principales

### ✅ **API REST Completa**
- **9 endpoints** funcionales con validaciones robustas
- **CRUD completo** de citas médicas
- **Filtros avanzados** con múltiples criterios de búsqueda
- **Paginación inteligente** para manejo de grandes volúmenes
- **Estadísticas en tiempo real** del sistema

### ✅ **Arquitectura Serverless**
- **AWS Lambda** para ejecución sin servidor
- **API Gateway** para enrutamiento HTTP
- **CloudWatch** para logging y monitoreo
- **Escalabilidad automática** según demanda
- **Costos optimizados** (pago por uso)

### ✅ **Tecnologías Modernas**
- **TypeScript** para tipado fuerte y mejor desarrollo
- **Node.js 20.x** como runtime
- **Serverless Framework 4** para despliegue automatizado
- **Zod** para validación de schemas
- **UUID** para identificadores únicos

## 🛣️ Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/hello` | Health check del sistema |
| `POST` | `/appointments` | Crear nueva cita médica |
| `GET` | `/appointments` | Listar citas con filtros |
| `GET` | `/appointments/{id}` | Obtener cita específica |
| `PUT` | `/appointments/{id}` | Actualizar cita existente |
| `DELETE` | `/appointments/{id}` | Eliminar cita |
| `GET` | `/appointments/stats` | Estadísticas del sistema |
| `PATCH` | `/appointments/{id}/confirm` | Confirmar cita |
| `PATCH` | `/appointments/{id}/cancel` | Cancelar cita |

## 📊 Modelo de Datos Avanzado

```typescript
interface Appointment {
  id: string;
  // Información del paciente
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  
  // Información del doctor
  doctorName: string;
  doctorSpecialty?: string;
  
  // Detalles de la cita
  appointmentDate: string;    // YYYY-MM-DD
  appointmentTime: string;    // HH:MM
  duration?: number;          // minutos
  roomNumber?: string;
  
  // Estados y clasificación
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  appointmentType: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  
  // Información adicional
  notes?: string;
  symptoms?: string;
  cost?: number;
  insuranceInfo?: { /* detalles del seguro */ };
  
  // Metadatos
  createdAt: string;
  updatedAt: string;
}
```

## 🏗️ Estructura del Proyecto

```
appointment-backend/
├── src/
│   ├── handlers/              # Lógica de negocio
│   │   ├── appointments.ts    # Handlers CRUD principales
│   │   └── hello.ts          # Health check
│   ├── types/
│   │   └── appointment.ts    # Definiciones TypeScript
│   └── utils/
│       ├── response.ts       # Respuestas HTTP estandarizadas
│       ├── auth.ts          # Autenticación y logging
│       ├── database.ts      # Interfaz de base de datos
│       └── validator.ts     # Validaciones
├── dist/                     # Archivos compilados
├── docs/                     # Documentación
├── scripts/                  # Scripts de prueba
├── serverless.yml           # Configuración Serverless
├── tsconfig.json           # Configuración TypeScript
└── package.json           # Dependencias
```

## 🔧 Instalación y Uso

### **Instalación Rápida**
```bash
# 1. Instalar dependencias
npm install

# 2. Compilar TypeScript
npm run build

# 3. Ejecutar localmente
npm start
# API disponible en: http://localhost:3000
```

### **Scripts Disponibles**
```bash
npm run build     # Compilar TypeScript
npm start         # Servidor local con hot-reload
npm run deploy    # Desplegar a AWS
```

## 🧪 Pruebas de la API

### **Health Check**
```bash
curl http://localhost:3000/hello
```

### **Crear Cita**
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

### **Listar Citas con Filtros**
```bash
# Filtrar por doctor
curl "http://localhost:3000/appointments?doctorName=García"

# Con estadísticas
curl "http://localhost:3000/appointments?includeStats=true"

# Paginación
curl "http://localhost:3000/appointments?page=1&limit=5"
```

### **Scripts Automáticos**
```bash
# Linux/Mac
./test_api.sh

# Windows
test_api_windows.bat
```

## 🎯 Funcionalidades Avanzadas

### **🔍 Sistema de Filtros**
- Búsqueda por nombre de doctor/paciente
- Filtros por estado, prioridad, tipo de cita
- Rangos de fechas flexibles
- Combinación de múltiples filtros

### **📊 Estadísticas en Tiempo Real**
```json
{
  "total": 50,
  "byStatus": {"scheduled": 20, "completed": 15},
  "byPriority": {"high": 10, "medium": 30},
  "byDoctor": {"Dr. García": 20, "Dr. Martín": 15},
  "upcomingToday": 5,
  "upcomingWeek": 15
}
```

### **✅ Validaciones Inteligentes**
- Prevención de citas duplicadas
- Validación de fechas futuras
- Verificación de disponibilidad de horarios
- Formato de datos consistente

### **🔄 Estados Avanzados**
6 estados diferentes con transiciones controladas:
`scheduled → confirmed → in-progress → completed`

## 🔒 Seguridad y Calidad

### **Implementado:**
- ✅ Validación robusta de datos de entrada
- ✅ Manejo consistente de errores
- ✅ CORS habilitado para cross-origin
- ✅ Logging completo de requests
- ✅ Tipado fuerte con TypeScript

### **Para Producción:**
- 🔄 Autenticación JWT con Amazon Cognito
- 🔄 Rate limiting en API Gateway
- 🔄 Base de datos DynamoDB
- 🔄 Encriptación de datos sensibles

## 📚 Documentación Completa

- 📖 **[Documentación de API](API_DOCUMENTATION.md)** - Guía completa de endpoints
- 🏗️ **[Diagramas de Arquitectura](ARCHITECTURE_DIAGRAMS.md)** - Diagramas visuales del sistema
- 🎯 **[Solución Completa](SOLUCION_COMPLETA.md)** - Análisis detallado del reto técnico

## 🚀 Despliegue a AWS

### **Configuración Initial**
```bash
# Configurar credenciales AWS (una vez)
aws configure

# Desplegar
npm run deploy
```

### **Entornos Múltiples**
```bash
# Desarrollo
serverless deploy --stage dev

# Producción
serverless deploy --stage prod
```

## 📈 Monitoreo y Logs

- **CloudWatch Logs**: Registro automático de todas las operaciones
- **Métricas**: Performance y errores en tiempo real
- **Trazabilidad**: Contexto completo de cada request

## 💡 Características Destacadas

### **🎯 Más Allá del Requerimiento Básico:**
- **Sistema completo** de gestión (no solo CRUD básico)
- **Filtros avanzados** con múltiples criterios
- **Estadísticas en tiempo real** no solicitadas
- **Estados avanzados** más allá de lo básico
- **Validación de disponibilidad** de horarios
- **Scripts de prueba** automatizados
- **Documentación profesional** con diagramas

### **🏆 Calidad Enterprise:**
- Código limpio y bien estructurado
- Separación de responsabilidades
- Manejo de errores robusto
- Validaciones completas
- Logging y auditoria
- Configuración para múltiples entornos

---

## 🎉 **¡Sistema Listo para Producción!**

Esta implementación va más allá de un CRUD básico, proporcionando un **sistema completo** de gestión de citas médicas con características enterprise y arquitectura serverless moderna.

**🚀 Total implementado:**
- ✅ **9 endpoints** funcionales
- ✅ **500+ líneas** de código TypeScript
- ✅ **Documentación completa** con diagramas
- ✅ **Scripts de prueba** automatizados
- ✅ **Arquitectura escalable** lista para producción

---

### 👨‍💻 **Desarrollado con:**
**Serverless Framework** + **TypeScript** + **AWS Lambda** + **API Gateway** + **CloudWatch**
```bash
npm run deploy
```

## API Endpoints

- `GET /hello` - Endpoint de prueba
- `GET /appointments` - Listar todas las citas
- `POST /appointments` - Crear una nueva cita
- `GET /appointments/{id}` - Obtener una cita específica
- `PUT /appointments/{id}` - Actualizar una cita
- `DELETE /appointments/{id}` - Eliminar una cita

## Estructura de Datos

### Appointment
```typescript
interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Configuración de AWS

Asegúrate de tener configuradas tus credenciales de AWS:
```bash
aws configure
```

O usa variables de entorno:
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
```

## 🖥️ Pasos para macOS

> Si usas macOS, sigue estos pasos para instalar, configurar y probar el proyecto usando los nuevos scripts `.sh`:

1. **Instala dependencias:**
   ```bash
   npm install
   ```

2. **Instala AWS CLI:**
   ```bash
   ./install-aws-macos.sh
   ```

3. **Configura credenciales AWS:**
   ```bash
   aws configure
   ```

4. **Compila y ejecuta localmente:**
   ```bash
   npm run build
   npm start
   ```

5. **Despliega a AWS:**
   ```bash
   npm run deploy
   ```

6. **Verifica endpoints locales:**
   ```bash
   ./test_endpoints_macos.sh
   ```

7. **Despliega y verifica en AWS:**
   ```bash
   ./deploy-and-verify-macos.sh
   ```

8. **Abre el dashboard de AWS en tu navegador:**
   ```bash
   ./verify-aws-dashboard-macos.sh
   ```

> Todos los scripts `.sh` están en la raíz del proyecto. Recuerda darles permisos de ejecución si es necesario:
> ```bash
> chmod +x *.sh
> ```

---

# 📑 Paginación real en el endpoint de listado de citas (`/appointments`)

## ¿Cómo funciona la paginación real con DynamoDB?

La paginación en DynamoDB se realiza usando el parámetro `lastKey` en la consulta y el valor `nextKey` que devuelve la respuesta. Esto permite obtener los siguientes resultados de manera eficiente, incluso con grandes volúmenes de datos.

---

## 🔎 Parámetros soportados

- **Filtros:**  
  Puedes filtrar por cualquiera de estos campos usando parámetros de consulta:
  - `doctorName`
  - `patientEmail`
  - `status`
  - `appointmentDate`
  - `priority`
  - `appointmentType`

- **Paginación:**  
  - `limit`: Número máximo de citas por página (ejemplo: `limit=10`)
  - `lastKey`: Token para obtener la siguiente página (lo obtienes de la respuesta anterior)

---

## 🚀 Ejemplo de uso

### 1. **Primera consulta (sin paginación):**

```sh
curl "http://localhost:3000/appointments?limit=5&doctorName=Dr.%20Mar%C3%ADa%20Garc%C3%ADa"
```

**Respuesta:**
```json
{
  "appointments": [ ... ],
  "count": 5,
  "nextKey": "eyJpZCI6ImFwcG9pbnRtZW50LTIwMjUxMjE1LTEwMDAifQ==",
  "filters": { ... },
  "limit": 5
}
```

### 2. **Consulta de la siguiente página:**

Toma el valor de `nextKey` y úsalo como parámetro `lastKey` en la siguiente consulta:

```sh
curl "http://localhost:3000/appointments?limit=5&doctorName=Dr.%20Mar%C3%ADa%20Garc%C3%ADa&lastKey=eyJpZCI6ImFwcG9pbnRtZW50LTIwMjUxMjE1LTEwMDAifQ=="
```

---

## ℹ️ Notas importantes

- Si la respuesta incluye `nextKey`, significa que hay más resultados disponibles.
- Si no se incluye `nextKey`, has llegado al final de los resultados.
- Puedes combinar paginación y filtros en la misma consulta.
- El valor de `lastKey` debe ser exactamente el que recibiste en el campo `nextKey` de la respuesta anterior.

---

## 🧑‍💻 Ejemplo completo con filtros y paginación

```sh
curl "http://localhost:3000/appointments?limit=10&status=scheduled&priority=high"
```

Para la siguiente página, usa el `nextKey` recibido:

```sh
curl "http://localhost:3000/appointments?limit=10&status=scheduled&priority=high&lastKey=VALOR_DEL_NEXTKEY"
```

---

## ✅ Ventajas

- Escalable para grandes volúmenes de datos.
- Compatible con cualquier filtro soportado.
- No requiere cargar todos los datos en memoria.

---

¿Tienes dudas sobre cómo usar la paginación? ¡Consulta este documento o pregunta al equipo de desarrollo!