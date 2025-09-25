# 🚀 GUÍA COMPLETA: DESPLIEGUE A AWS Y VERIFICACIÓN EN DASHBOARD

## 📋 **RECURSOS AWS REQUERIDOS SEGÚN EL RETO TÉCNICO**

Según la documentación del reto técnico, necesitamos implementar los siguientes recursos AWS:

### **🎯 ARQUITECTURA SERVERLESS REQUERIDA:**
1. **AWS Lambda** - Funciones serverless para lógica de negocio
2. **Amazon API Gateway** - Endpoints REST para la API
3. **Amazon DynamoDB** - Base de datos NoSQL para persistencia
4. **Amazon CloudWatch** - Logs y monitoreo
5. **AWS IAM** - Roles y permisos
6. **AWS S3** - (Opcional) Para assets estáticos

---

## 🔧 **PASO 1: CONFIGURACIÓN PRE-DESPLIEGUE**

### **✅ Verificar Prerequisitos:**
```powershell
# 1. Verificar AWS CLI instalado
aws --version

# 2. Verificar credenciales configuradas
aws sts get-caller-identity

# 3. Verificar compilación local
npm run build
```

### **🔑 Configurar Credenciales AWS (si no está hecho):**
```powershell
# Configurar AWS CLI
aws configure
# AWS Access Key ID: [tu-access-key]
# AWS Secret Access Key: [tu-secret-key]
# Default region name: us-east-1
# Default output format: json
```

---

## 🚀 **PASO 2: DESPLIEGUE A AWS**

### **📦 Comando de Despliegue:**
```powershell
# Desde la raíz del proyecto
npm run deploy
# o directamente
sls deploy --verbose
```

### **⏱️ Lo que sucederá durante el despliegue:**
1. ✅ **CloudFormation Stack** se creará
2. ✅ **Lambda Functions** se desplegarán (14 funciones)
3. ✅ **API Gateway** se configurará con todos los endpoints
4. ✅ **IAM Roles** se crearán automáticamente
5. ✅ **CloudWatch Logs** se habilitarán para cada función

---

## 📊 **PASO 3: VERIFICACIÓN EN AWS DASHBOARD**

### **🌐 1. AWS LAMBDA - Verificar Funciones Desplegadas**

**Ir a:** [AWS Lambda Console](https://console.aws.amazon.com/lambda)

**Verificar estas 14 funciones:**
- `appointment-backend-dev-hello`
- `appointment-backend-dev-createAppointment`
- `appointment-backend-dev-getAppointments`
- `appointment-backend-dev-getAppointment`
- `appointment-backend-dev-updateAppointment`
- `appointment-backend-dev-deleteAppointment`
- `appointment-backend-dev-getAppointmentStats`
- `appointment-backend-dev-confirmAppointment`
- `appointment-backend-dev-cancelAppointment`
- `appointment-backend-dev-swaggerUI`
- `appointment-backend-dev-swaggerJSON`
- `appointment-backend-dev-awsHealth`
- `appointment-backend-dev-awsConfig`
- `appointment-backend-dev-awsConnectivity`

**✅ Verificar:**
- Runtime: Node.js 20.x
- Memory: 128MB - 256MB según función
- Timeout: 10s - 30s según función
- Handler: dist/handlers/[archivo].[función]

---

### **🌍 2. API GATEWAY - Verificar Endpoints**

**Ir a:** [API Gateway Console](https://console.aws.amazon.com/apigateway)

**Buscar:** `appointment-backend-dev` API

**Verificar estos endpoints:**
- `GET /hello`
- `GET /docs`
- `GET /api-docs.json`
- `POST /appointments`
- `GET /appointments`
- `GET /appointments/{id}`
- `PUT /appointments/{id}`
- `DELETE /appointments/{id}`
- `GET /appointments/stats`
- `PATCH /appointments/{id}/confirm`
- `PATCH /appointments/{id}/cancel`
- `GET /aws-health`
- `GET /aws-config`
- `GET /aws-connectivity`

**✅ Verificar:**
- Stage: dev
- CORS habilitado
- Integration type: Lambda Function

---

### **📋 3. CLOUDFORMATION - Verificar Stack**

**Ir a:** [CloudFormation Console](https://console.aws.amazon.com/cloudformation)

**Buscar:** `appointment-backend-dev`

**Verificar recursos creados:**
- AWS::Lambda::Function (14 funciones)
- AWS::ApiGatewayV2::Api (1 API)
- AWS::ApiGatewayV2::Route (14 rutas)
- AWS::IAM::Role (1 rol de ejecución)
- AWS::Logs::LogGroup (14 grupos de logs)

---

### **📊 4. CLOUDWATCH - Verificar Logs y Métricas**

**Ir a:** [CloudWatch Console](https://console.aws.amazon.com/cloudwatch)

**Log Groups a verificar:**
- `/aws/lambda/appointment-backend-dev-hello`
- `/aws/lambda/appointment-backend-dev-createAppointment`
- `/aws/lambda/appointment-backend-dev-awsHealth`
- (y 11 más...)

**Métricas a verificar:**
- Lambda Invocations
- Lambda Duration
- Lambda Errors
- API Gateway 4XXError
- API Gateway 5XXError

---

### **🔑 5. IAM - Verificar Roles y Permisos**

**Ir a:** [IAM Console](https://console.aws.amazon.com/iam)

**Verificar rol:** `appointment-backend-dev-[region]-lambdaRole`

**Permisos incluidos:**
- `AWSLambdaBasicExecutionRole`
- CloudWatch Logs (CreateLogGroup, CreateLogStream, PutLogEvents)

---

## 🧪 **PASO 4: TESTING POST-DESPLIEGUE**

### **🌐 URLs de Producción:**
Después del despliegue, obtendrás URLs como:
```
https://[api-id].execute-api.us-east-1.amazonaws.com/
```

### **✅ Tests a Realizar:**
```powershell
# 1. Health Check
Invoke-RestMethod -Uri "https://[api-id].execute-api.us-east-1.amazonaws.com/hello"

# 2. AWS Health Check
Invoke-RestMethod -Uri "https://[api-id].execute-api.us-east-1.amazonaws.com/aws-health"

# 3. Swagger UI
# Abrir en navegador: https://[api-id].execute-api.us-east-1.amazonaws.com/docs

# 4. Crear cita de prueba
$body = @{
    patientName = "Juan Perez"
    patientEmail = "juan@test.com"
    doctorName = "Dr. Garcia"
    appointmentDate = "2025-12-15"
    appointmentTime = "10:00"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://[api-id].execute-api.us-east-1.amazonaws.com/appointments" -Method POST -Body $body -ContentType "application/json"

# 5. Listar citas
Invoke-RestMethod -Uri "https://[api-id].execute-api.us-east-1.amazonaws.com/appointments"

# 6. Ver estadísticas
Invoke-RestMethod -Uri "https://[api-id].execute-api.us-east-1.amazonaws.com/appointments/stats"
```

---

## 📈 **PASO 5: MONITOREO EN TIEMPO REAL**

### **📊 CloudWatch Dashboards:**
1. **Ir a CloudWatch > Dashboards**
2. **Crear dashboard personalizado**
3. **Agregar widgets para:**
   - Lambda invocations por función
   - API Gateway requests
   - Error rates
   - Response times

### **🔔 CloudWatch Alarms:**
```powershell
# Configurar alarmas para:
- Lambda errors > 5% en 5 minutos
- API Gateway 5XX errors > 10 en 5 minutos
- Lambda duration > 10 segundos
```

---

## 🎯 **CHECKLIST DE VERIFICACIÓN COMPLETA**

### **✅ AWS Lambda:**
- [ ] 14 funciones desplegadas
- [ ] Runtime Node.js 20.x
- [ ] Configuración de memoria correcta
- [ ] Timeouts apropiados
- [ ] Variables de entorno configuradas

### **✅ API Gateway:**
- [ ] API creada con nombre correcto
- [ ] 14 endpoints configurados
- [ ] CORS habilitado
- [ ] Stage 'dev' activo
- [ ] URLs públicas funcionando

### **✅ CloudWatch:**
- [ ] Log groups creados para cada función
- [ ] Logs generándose correctamente
- [ ] Métricas visibles en dashboard
- [ ] No errores en logs

### **✅ IAM:**
- [ ] Rol de ejecución creado
- [ ] Permisos mínimos necesarios
- [ ] Acceso a CloudWatch Logs

### **✅ Funcionalidad:**
- [ ] Health check respondiendo
- [ ] CRUD de citas funcionando
- [ ] Swagger UI accesible
- [ ] AWS Health endpoints operativos
- [ ] Estadísticas generándose

---

## 🚨 **TROUBLESHOOTING COMÚN**

### **❌ Error: "Access Denied"**
```powershell
# Verificar credenciales
aws sts get-caller-identity
aws configure list
```

### **❌ Error: "Role not found"**
```powershell
# Verificar permisos IAM
aws iam list-attached-role-policies --role-name [role-name]
```

### **❌ Error: "Function not found"**
```powershell
# Verificar despliegue
sls info --verbose
aws lambda list-functions --region us-east-1
```

---

## 📱 **COMANDOS RÁPIDOS DE VERIFICACIÓN**

### **🔍 Verificar Stack Completo:**
```powershell
# Ver información del stack
sls info

# Listar todas las funciones
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `appointment-backend`)].FunctionName'

# Ver API Gateway
aws apigatewayv2 get-apis --query 'Items[?starts_with(Name, `appointment-backend`)].{Name:Name,ApiId:ApiId}'

# Ver logs más recientes
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/appointment-backend"
```

### **📊 Métricas en CloudWatch:**
```powershell
# Ver invocaciones de Lambda en las últimas 24 horas
aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Invocations --dimensions Name=FunctionName,Value=appointment-backend-dev-hello --start-time $(Get-Date).AddDays(-1) --end-time $(Get-Date) --period 3600 --statistics Sum
```

---

## 🎉 **RESULTADO ESPERADO**

Al final de esta guía tendrás:

✅ **Aplicación completamente desplegada** en AWS
✅ **14 funciones Lambda** operativas
✅ **API Gateway** con todos los endpoints
✅ **Monitoreo completo** en CloudWatch
✅ **Swagger UI** accesible desde internet
✅ **AWS Health Check** verificando conectividad
✅ **Logs detallados** para debugging
✅ **Métricas y alarms** para monitoreo

**🌐 URL final de tu aplicación:**
`https://[api-id].execute-api.us-east-1.amazonaws.com/docs`