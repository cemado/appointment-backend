# 🔑 CONFIGURACIÓN DE CREDENCIALES AWS

## 📋 **QUÉ NECESITAS:**

### **1. Cuenta AWS**
- Si no tienes cuenta: https://aws.amazon.com/
- Crear cuenta gratuita (incluye 12 meses de capa gratuita)

### **2. Credenciales AWS**
Necesitas obtener:
- **AWS Access Key ID** (ejemplo: AKIAIOSFODNN7EXAMPLE)
- **AWS Secret Access Key** (ejemplo: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)

---

## 🔧 **CÓMO OBTENER CREDENCIALES:**

### **Opción 1: Usuario IAM (RECOMENDADO PARA DESARROLLO)**

1. **Ir a AWS Console:** https://console.aws.amazon.com/
2. **Buscar "IAM"** en la barra de búsqueda
3. **Ir a "Users" → "Create user"**
4. **Nombre de usuario:** `serverless-dev-user`
5. **Permisos:** Seleccionar "Attach policies directly"
6. **Política:** Buscar y seleccionar `AdministratorAccess`
7. **Crear usuario**
8. **En el usuario creado → "Security credentials"**
9. **"Create access key" → "Command Line Interface (CLI)"**
10. **Copiar Access Key ID y Secret Access Key**

### **Opción 2: Root User (SOLO PARA TESTING)**
⚠️ **NO recomendado para producción**

1. **Ir a AWS Console**
2. **Cuenta (arriba derecha) → Security credentials**
3. **Access keys → Create access key**
4. **Confirmar y crear**

---

## ⚡ **COMANDOS DESPUÉS DE INSTALAR AWS CLI:**

### **1. Verificar instalación:**
```powershell
aws --version
```

### **2. Configurar credenciales:**
```powershell
aws configure
```

Te preguntará:
```
AWS Access Key ID [None]: [PEGAR_TU_ACCESS_KEY]
AWS Secret Access Key [None]: [PEGAR_TU_SECRET_KEY]  
Default region name [None]: us-east-1
Default output format [None]: json
```

### **3. Verificar configuración:**
```powershell
aws sts get-caller-identity
```

Deberías ver:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/serverless-dev-user"
}
```

---

## 🚀 **DESPUÉS DE CONFIGURAR:**

### **1. Probar conexión:**
```powershell
aws s3 ls
```

### **2. Desplegar aplicación:**
```powershell
npm run deploy
```

### **3. Verificar recursos:**
```powershell
npm run verify-aws
```

---

## 🔒 **MEJORES PRÁCTICAS DE SEGURIDAD:**

### **Para Desarrollo:**
- ✅ Usar usuario IAM específico
- ✅ Permisos mínimos necesarios
- ✅ Rotar credenciales regularmente
- ✅ No compartir credenciales

### **Para Producción:**
- ✅ Usar IAM Roles
- ✅ AWS SSO
- ✅ Temporary credentials
- ✅ Multi-Factor Authentication (MFA)

---

## 🆘 **SOLUCIÓN DE PROBLEMAS:**

### **Error: "Access Denied"**
```powershell
# Verificar credenciales
aws configure list
aws sts get-caller-identity
```

### **Error: "Region not found"**
```powershell
# Configurar región
aws configure set region us-east-1
```

### **Error: "Command not found"**
```powershell
# Reiniciar PowerShell después de instalar
# O verificar PATH
$env:PATH -split ';' | Where-Object { $_ -like '*AWS*' }
```

---

## ✅ **VERIFICAR QUE TODO FUNCIONA:**

```powershell
# 1. AWS CLI instalado
aws --version

# 2. Credenciales configuradas  
aws sts get-caller-identity

# 3. Compilación funciona
npm run build

# 4. Despliegue funciona
npm run deploy

# 5. Endpoints funcionan
npm run test:endpoints
```

Una vez que completes estos pasos, podrás desplegar tu aplicación a AWS y verificar todos los recursos en el dashboard!