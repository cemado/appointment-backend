# 📋 CHECKLIST POST-INSTALACIÓN AWS CLI

## ✅ **VERIFICAR INSTALACIÓN:**
```powershell
# Reiniciar PowerShell y verificar
aws --version
```

## 🔑 **CONFIGURAR CREDENCIALES:**
```powershell
aws configure
```

**Datos a ingresar:**
- AWS Access Key ID: [tu-access-key-id]
- AWS Secret Access Key: [tu-secret-access-key]  
- Default region name: us-east-1
- Default output format: json

## 🧪 **PROBAR CONEXIÓN:**
```powershell
aws sts get-caller-identity
```

## 🚀 **DESPLEGAR APLICACIÓN:**
```powershell
npm run deploy
```

## 📊 **VERIFICAR RECURSOS AWS:**
```powershell
npm run verify-aws
```

---

## 🎯 **RESULTADO ESPERADO:**

Después del despliegue tendrás:
- ✅ 14 funciones Lambda activas
- ✅ API Gateway con endpoints funcionales  
- ✅ CloudWatch Logs configurado
- ✅ Swagger UI público
- ✅ AWS Health Check endpoints

**URL de tu aplicación:**
`https://[api-id].execute-api.us-east-1.amazonaws.com/docs`

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