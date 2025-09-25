# 🌐 CÓMO REVISAR TU APLICACIÓN EN AWS DASHBOARD

## 🚀 **PASOS PARA DESPLEGAR Y VERIFICAR**

### **1. DESPLIEGA TU APLICACIÓN A AWS**
```powershell
# Opción 1: Despliegue simple
npm run deploy

# Opción 2: Despliegue con verificación automática (RECOMENDADO)
npm run deploy-verify
```

### **2. VERIFICA RECURSOS EN AWS DASHBOARD**
```powershell
# Script de verificación completa
npm run verify-aws
```

---

## 📊 **RECURSOS AWS A VERIFICAR EN EL DASHBOARD**

### **🔹 1. AWS LAMBDA**
**URL:** https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions

**Qué verificar:**
- ✅ **14 funciones Lambda** desplegadas con prefijo `appointment-backend-dev-`
- ✅ **Runtime:** Node.js 20.x
- ✅ **Estado:** Active
- ✅ **Memoria:** 128MB - 256MB según función
- ✅ **Timeout:** 10s - 30s según función

**Funciones esperadas:**
```
appointment-backend-dev-hello
appointment-backend-dev-createAppointment
appointment-backend-dev-getAppointments
appointment-backend-dev-getAppointment
appointment-backend-dev-updateAppointment
appointment-backend-dev-deleteAppointment
appointment-backend-dev-getAppointmentStats
appointment-backend-dev-confirmAppointment
appointment-backend-dev-cancelAppointment
appointment-backend-dev-swaggerUI
appointment-backend-dev-swaggerJSON
appointment-backend-dev-awsHealth
appointment-backend-dev-awsConfig
appointment-backend-dev-awsConnectivity
```

---

### **🔹 2. API GATEWAY**
**URL:** https://console.aws.amazon.com/apigateway/main/apis?region=us-east-1

**Qué verificar:**
- ✅ **API HTTP** con nombre `appointment-backend-dev`
- ✅ **14 rutas** configuradas
- ✅ **CORS** habilitado
- ✅ **Stage:** dev activo
- ✅ **Integración:** Lambda Function para cada ruta

**Endpoints esperados:**
```
GET    /hello
GET    /docs
GET    /api-docs.json
POST   /appointments
GET    /appointments
GET    /appointments/{id}
PUT    /appointments/{id}
DELETE /appointments/{id}
GET    /appointments/stats
PATCH  /appointments/{id}/confirm
PATCH  /appointments/{id}/cancel
GET    /aws-health
GET    /aws-config
GET    /aws-connectivity
```

---

### **🔹 3. CLOUDFORMATION**
**URL:** https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks

**Qué verificar:**
- ✅ **Stack:** `appointment-backend-dev`
- ✅ **Estado:** CREATE_COMPLETE
- ✅ **Recursos:** ~50+ recursos creados
- ✅ **Outputs:** API Gateway URL visible
- ✅ **Sin errores** en eventos

**Recursos principales en el stack:**
- AWS::Lambda::Function (14 funciones)
- AWS::ApiGatewayV2::Api (1 API)
- AWS::ApiGatewayV2::Route (14 rutas)
- AWS::ApiGatewayV2::Integration (14 integraciones)
- AWS::IAM::Role (1 rol de ejecución)
- AWS::Logs::LogGroup (14 grupos de logs)

---

### **🔹 4. CLOUDWATCH LOGS**
**URL:** https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups

**Qué verificar:**
- ✅ **14 Log Groups** con prefijo `/aws/lambda/appointment-backend-dev-`
- ✅ **Logs recientes** después de invocar funciones
- ✅ **Sin errores críticos** en los logs
- ✅ **Retention:** Configurado apropiadamente

**Grupos de logs esperados:**
```
/aws/lambda/appointment-backend-dev-hello
/aws/lambda/appointment-backend-dev-createAppointment
/aws/lambda/appointment-backend-dev-getAppointments
... (y 11 más)
```

---

### **🔹 5. CLOUDWATCH METRICS**
**URL:** https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#metricsV2:

**Métricas clave a monitorear:**
- ✅ **Lambda Invocations:** Número de invocaciones por función
- ✅ **Lambda Duration:** Tiempo de ejecución promedio
- ✅ **Lambda Errors:** Cantidad de errores (debe ser 0)
- ✅ **API Gateway 4XXError:** Errores de cliente
- ✅ **API Gateway 5XXError:** Errores de servidor

---

### **🔹 6. IAM ROLES**
**URL:** https://console.aws.amazon.com/iam/home#/roles

**Qué verificar:**
- ✅ **Rol:** `appointment-backend-dev-[region]-lambdaRole`
- ✅ **Políticas adjuntas:** CloudWatch Logs permissions
- ✅ **Trust relationships:** Lambda service
- ✅ **Permisos mínimos** necesarios

---

## 🧪 **TESTS DE FUNCIONALIDAD**

### **Test 1: Health Check**
```powershell
# Obtener URL de la API
$apiUrl = "https://[tu-api-id].execute-api.us-east-1.amazonaws.com"

# Test básico
Invoke-RestMethod -Uri "$apiUrl/hello" -Method GET
```

### **Test 2: AWS Health**
```powershell
Invoke-RestMethod -Uri "$apiUrl/aws-health" -Method GET
```

### **Test 3: Swagger UI**
Abrir en navegador: `https://[tu-api-id].execute-api.us-east-1.amazonaws.com/docs`

### **Test 4: Operaciones CRUD**
```powershell
# Crear cita
$appointmentData = @{
    patientName = "Juan Pérez"
    patientEmail = "juan@test.com"
    doctorName = "Dr. García"
    appointmentDate = "2025-12-15"
    appointmentTime = "10:00"
    priority = "high"
} | ConvertTo-Json

$newAppointment = Invoke-RestMethod -Uri "$apiUrl/appointments" -Method POST -Body $appointmentData -ContentType "application/json"

# Listar citas
Invoke-RestMethod -Uri "$apiUrl/appointments" -Method GET

# Ver estadísticas
Invoke-RestMethod -Uri "$apiUrl/appointments/stats" -Method GET
```

---

## 📈 **DASHBOARD PERSONALIZADO**

### **Crear CloudWatch Dashboard**
Ejecuta el script de verificación para crear un dashboard personalizado:
```powershell
npm run verify-aws
```

Este dashboard incluirá:
- 📊 Invocaciones de Lambda por función
- ⏱️ Duración promedio de ejecución
- 🚨 Cantidad de errores
- 📈 Tendencias de uso

---

## ✅ **CHECKLIST DE VERIFICACIÓN COMPLETA**

### **AWS Lambda:**
- [ ] 14 funciones desplegadas correctamente
- [ ] Runtime Node.js 20.x configurado
- [ ] Variables de entorno configuradas
- [ ] Timeouts y memoria apropiados
- [ ] Estado "Active" en todas las funciones

### **API Gateway:**
- [ ] API HTTP creada con nombre correcto
- [ ] 14 endpoints configurados y funcionales
- [ ] CORS habilitado para desarrollo
- [ ] Stage 'dev' activo y desplegado
- [ ] URL pública accesible

### **CloudFormation:**
- [ ] Stack en estado CREATE_COMPLETE
- [ ] Todos los recursos creados sin errores
- [ ] Outputs muestran la URL de la API
- [ ] Sin drift en la configuración

### **CloudWatch:**
- [ ] Log groups creados para cada función
- [ ] Logs generándose al invocar funciones
- [ ] Métricas visibles en dashboard
- [ ] Sin errores críticos en logs

### **Funcionalidad:**
- [ ] Health check respondiendo correctamente
- [ ] AWS Health endpoints funcionando
- [ ] Swagger UI accesible públicamente
- [ ] CRUD de citas operativo
- [ ] Estadísticas generándose

---

## 🎯 **ARQUITECTURA CUMPLIDA**

Según el reto técnico, la arquitectura implementada incluye:

✅ **Serverless Framework** - Gestión de infraestructura como código
✅ **AWS Lambda** - Compute serverless para lógica de negocio
✅ **API Gateway** - Endpoints REST para la API
✅ **CloudWatch** - Logs y monitoreo completo
✅ **IAM** - Roles y permisos de seguridad
✅ **CloudFormation** - Infraestructura versionada

**Funcionalidades adicionales implementadas:**
✅ **Swagger UI** - Documentación interactiva
✅ **AWS Health Checks** - Verificación de conectividad
✅ **TypeScript** - Tipado fuerte y mejor desarrollo
✅ **Error Handling** - Manejo robusto de errores
✅ **Validación** - Validación de datos con Zod
✅ **Logging** - Logs estructurados para debugging

---

## 🌐 **URLS IMPORTANTES**

Después del despliegue tendrás acceso a:

- **🌍 API Base:** `https://[api-id].execute-api.us-east-1.amazonaws.com/`
- **📚 Swagger UI:** `https://[api-id].execute-api.us-east-1.amazonaws.com/docs`
- **📄 API Docs:** `https://[api-id].execute-api.us-east-1.amazonaws.com/api-docs.json`
- **🏥 Health Check:** `https://[api-id].execute-api.us-east-1.amazonaws.com/hello`
- **🔍 AWS Health:** `https://[api-id].execute-api.us-east-1.amazonaws.com/aws-health`

---

## 📞 **SOPORTE Y TROUBLESHOOTING**

### **Problemas comunes:**

**❌ "Access Denied"**
```powershell
# Verificar credenciales
aws sts get-caller-identity
aws configure list
```

**❌ "Function not found"**
```powershell
# Verificar despliegue
sls info --verbose
aws lambda list-functions --region us-east-1
```

**❌ "CORS Error"**
- Verificar configuración CORS en serverless.yml
- Confirmar que headers están incluidos en responses

**❌ "Cold Start lento"**
- Normal en primeras invocaciones
- Configurar warming si es necesario para producción

---

## 🎉 **¡FELICITACIONES!**

Tu aplicación serverless de gestión de citas médicas está completamente desplegada y funcionando en AWS con:

- ✅ **14 endpoints funcionales**
- ✅ **Documentación interactiva**
- ✅ **Monitoreo completo**
- ✅ **Arquitectura escalable**
- ✅ **Mejores prácticas implementadas**