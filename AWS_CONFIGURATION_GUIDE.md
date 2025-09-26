# 📋 GUÍA DE CONFIGURACIÓN AWS Y ARCHIVOS DE CONFIGURACIÓN

## 🎯 **RESUMEN DE CONFIGURACIÓN**

### **📂 ¿DÓNDE SE GUARDAN LOS ARCHIVOS DE CONFIGURACIÓN?**

El proyecto tiene varios lugares para la configuración:

#### **1. 🔧 Variables de Entorno (.env)**
- **Archivo**: `.env` (desarrollo local)
- **Ejemplo**: `.env.example` (template)
- **Uso**: Configuración específica del ambiente

#### **2. ⚙️ Configuración de Serverless (serverless.yml)**
- **Archivo**: `serverless.yml`
- **Uso**: Configuración de despliegue AWS, funciones Lambda, API Gateway

#### **3. 🛠️ Configuración de TypeScript (tsconfig.json)**
- **Archivo**: `tsconfig.json`
- **Uso**: Configuración del compilador TypeScript

#### **4. 📦 Configuración de NPM (package.json)**
- **Archivo**: `package.json`
- **Uso**: Dependencias, scripts, metadatos del proyecto

---

## 🔍 **SERVICIOS DE VERIFICACIÓN AWS CREADOS**

### **✅ Endpoints Nuevos para Verificar AWS:**

| Endpoint | Función | Descripción |
|----------|---------|-------------|
| `GET /aws-health` | Health Check completo | Verifica estado general de AWS |
| `GET /aws-config` | Mostrar configuración | Muestra configuración actual |
| `GET /aws-connectivity` | Test de conectividad | Prueba conexión a servicios AWS |

---

## 🚀 **CÓMO USAR LOS SERVICIOS DE VERIFICACIÓN**

### **1. Compilar y Levantar:**
```bash
npm run build
npm start
```

### **2. Verificar Estado de AWS:**
```bash
# Health Check completo
curl http://localhost:3000/aws-health

# Ver configuración actual
curl http://localhost:3000/aws-config

# Probar conectividad
curl http://localhost:3000/aws-connectivity
```

### **3. Respuestas Esperadas:**

#### **🔍 AWS Health Check Response:**
```json
{
  "success": true,
  "message": "AWS Health Check HEALTHY",
  "data": {
    "region": "us-east-1",
    "accountId": "123456789012",
    "stage": "dev",
    "lambdaContext": {
      "functionName": "appointment-backend-dev-awsHealth",
      "functionVersion": "$LATEST",
      "memoryLimitInMB": 128,
      "remainingTimeInMillis": 14500
    },
    "environment": {
      "nodeEnv": "development",
      "awsRegion": "us-east-1"
    },
    "timestamp": "2025-09-24T15:30:00.000Z",
    "status": "healthy",
    "checks": {
      "lambdaExecution": true,
      "environmentVariables": true,
      "awsServices": true
    }
  }
}
```

---

## 🔧 **CONFIGURACIÓN DE AWS CREDENTIALS**

### **📋 Opciones para Configurar AWS:**

#### **1. 🎯 AWS CLI (Recomendado):**
```bash
# Instalar AWS CLI
npm install -g @aws-cli/cli-node

# Configurar credenciales
aws configure
```

#### **2. 📄 Variables de Entorno:**
```bash
# En .env
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key  
AWS_REGION=us-east-1
AWS_PROFILE=default
```

#### **3. 🔑 Archivo de Credenciales (~/.aws/credentials):**
```ini
[default]
aws_access_key_id = tu-access-key
aws_secret_access_key = tu-secret-key
region = us-east-1
```

#### **4. 👤 Perfil específico:**
```bash
# En serverless.yml ya está configurado
provider:
  profile: ${opt:profile, 'default'}

# Desplegar con perfil específico
sls deploy --profile mi-perfil
```

---

## 💡 **¿ES NECESARIO UN .ENV?**

### **✅ SÍ, es altamente recomendado:**

#### **🎯 Ventajas del .env:**
- ✅ **Separación de configuración** del código
- ✅ **Diferentes configuraciones** por ambiente
- ✅ **Seguridad** - no se sube al git
- ✅ **Facilidad de desarrollo** local
- ✅ **Configuración específica** por desarrollador

#### **📂 Estructura de archivos .env:**
```
proyecto/
├── .env                 # ← Configuración local (gitignored)
├── .env.example         # ← Template de ejemplo
├── .env.development     # ← Configuración desarrollo
├── .env.production      # ← Configuración producción
└── serverless.yml       # ← Configuración despliegue
```

---

## 🔒 **BUENAS PRÁCTICAS DE SEGURIDAD**

### **❌ NUNCA subir al git:**
- ❌ `.env` con datos reales
- ❌ Credenciales AWS
- ❌ Tokens o secrets
- ❌ IDs de cuenta

### **✅ SIEMPRE usar:**
- ✅ `.env.example` como template
- ✅ Variables de entorno en CI/CD
- ✅ AWS IAM roles en Lambda
- ✅ Secrets Manager para datos sensibles

---

## 🧪 **SCRIPTS DE PRUEBA AWS**

### **📝 Script de Windows (test_aws.bat):**
```batch
@echo off
echo Testing AWS Health Endpoints...

echo.
echo 1. AWS Health Check:
curl -s http://localhost:3000/aws-health

echo.
echo 2. AWS Configuration:
curl -s http://localhost:3000/aws-config

echo.
echo 3. AWS Connectivity:
curl -s http://localhost:3000/aws-connectivity

echo.
echo Tests completed!
pause
```

### **📝 Script de Linux/Mac (test_aws.sh):**
```bash
#!/bin/bash
echo "Testing AWS Health Endpoints..."

echo ""
echo "1. AWS Health Check:"
curl -s http://localhost:3000/aws-health | jq .

echo ""
echo "2. AWS Configuration:"
curl -s http://localhost:3000/aws-config | jq .

echo ""
echo "3. AWS Connectivity:"
curl -s http://localhost:3000/aws-connectivity | jq .

echo ""
echo "Tests completed!"
```

---

## 🚀 **DESPLIEGUE A AWS**

### **📋 Comandos de Despliegue:**
```bash
# Despliegue básico
npm run deploy

# Despliegue con perfil específico
sls deploy --profile mi-perfil

# Despliegue en stage específico
sls deploy --stage production

# Despliegue en región específica
sls deploy --region eu-west-1
```

### **🔍 Verificar Despliegue:**
```bash
# Ver información del stack
sls info

# Ver logs en tiempo real
sls logs -f awsHealth -t

# Probar endpoints remotos
curl https://tu-api-id.execute-api.us-east-1.amazonaws.com/aws-health
```

---

## 🏆 **CHECKLIST DE CONFIGURACIÓN**

### **✅ Antes de desarrollar:**
- [ ] Copiar `.env.example` → `.env`
- [ ] Configurar AWS credentials
- [ ] Verificar `npm install`
- [ ] Ejecutar `npm run build`
- [ ] Probar `npm start`

### **✅ Antes de desplegar:**
- [ ] Verificar AWS credentials
- [ ] Compilar código: `npm run build`
- [ ] Probar local: todos los endpoints
- [ ] Configurar perfil AWS correcto
- [ ] Revisar `serverless.yml`

### **✅ Después del despliegue:**
- [ ] Verificar `sls info`
- [ ] Probar endpoints remotos
- [ ] Verificar logs con `sls logs`
- [ ] Documentar URLs de producción

---

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

1. **🔧 Configurar AWS CLI** si no lo tienes
2. **🧪 Probar endpoints locales** con los nuevos servicios
3. **🚀 Hacer primer despliegue** a AWS
4. **📊 Verificar métricas** en CloudWatch
5. **🔒 Configurar DynamoDB** para persistencia real
6. **📧 Agregar notificaciones** por email/SMS

---

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

---

**🎉 ¡Tu sistema está listo para verificar la conexión con AWS!** 🚀