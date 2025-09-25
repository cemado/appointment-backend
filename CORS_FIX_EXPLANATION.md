# 🔧 CONFIGURACIÓN CORS CORREGIDA

## ❌ **PROBLEMA ANTERIOR:**
```yaml
httpApi:
  cors:
    allowedOrigins:
      - '*'  # ← PROBLEMA: No se puede usar '*' con allowCredentials: true
    allowCredentials: true
```

## ✅ **SOLUCIÓN APLICADA:**
```yaml
httpApi:
  cors:
    allowedOrigins:
      - https://localhost:3000
      - http://localhost:3000
      - https://127.0.0.1:3000
      - http://127.0.0.1:3000
    allowCredentials: true  # ← Ahora funciona con orígenes específicos
```

## 🚀 **PARA PRODUCCIÓN:**
Si necesitas permitir más dominios en producción, agrega:
```yaml
allowedOrigins:
  - https://mi-app.com
  - https://www.mi-app.com
  - https://app.mi-dominio.com
```

## 📊 **TIMEOUTS CORREGIDOS:**
- createAppointment: 30s → 25s
- getAppointments: 30s → 25s  
- updateAppointment: 30s → 25s

Esto previene conflictos con el límite de 30s de API Gateway.