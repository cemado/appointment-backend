# 🚀 INSTALACIÓN Y CONFIGURACIÓN DE AWS CLI

## 📋 **PASO 1: INSTALAR AWS CLI**

### **Opción 1: Instalador MSI (RECOMENDADO)**
1. **Descargar AWS CLI v2 para Windows:**
   - Ir a: https://awscli.amazonaws.com/AWSCLIV2.msi
   - O ejecutar el comando de descarga automática abajo

2. **Instalar automáticamente:**

### **Opción 2: Via PowerShell (Automático)**
Ejecutaremos un script que descarga e instala AWS CLI automáticamente.

### **Opción 3: Via Chocolatey (si tienes Chocolatey instalado)**
```powershell
choco install awscli
```

---

## 🔧 **PASO 2: VERIFICAR INSTALACIÓN**

Después de la instalación, reinicia PowerShell y verifica:
```powershell
aws --version
```

Deberías ver algo como:
```
aws-cli/2.x.x Python/3.x.x Windows/10 exe/AMD64 prompt/off
```

---

## 🔑 **PASO 3: CONFIGURAR CREDENCIALES AWS**

### **Necesitarás:**
1. **AWS Access Key ID**
2. **AWS Secret Access Key**
3. **Región por defecto** (recomendado: `us-east-1`)

### **Si no tienes credenciales AWS:**
1. Ve a [AWS Console](https://console.aws.amazon.com/)
2. Crea una cuenta gratuita si no tienes
3. Ve a IAM → Users → Create User
4. Asigna permisos administrativos (para desarrollo)
5. Genera Access Keys

### **Configurar credenciales:**
```powershell
aws configure
```

Te pedirá:
```
AWS Access Key ID [None]: [TU_ACCESS_KEY]
AWS Secret Access Key [None]: [TU_SECRET_KEY]
Default region name [None]: us-east-1
Default output format [None]: json
```

---

## ✅ **PASO 4: VERIFICAR CONFIGURACIÓN**

```powershell
# Verificar credenciales
aws sts get-caller-identity

# Verificar conexión
aws s3 ls
```

---

## 🎯 **RESULTADO ESPERADO**

Una vez configurado correctamente, deberías poder:
- ✅ Ejecutar comandos AWS CLI
- ✅ Ver tu información de cuenta
- ✅ Desplegar con Serverless Framework
- ✅ Acceder a servicios AWS desde tu aplicación

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