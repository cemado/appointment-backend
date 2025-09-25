# 📖 GUÍA COMPLETA: Cómo Acceder y Usar Swagger UI

## 🚀 **PASOS PARA LEVANTAR LA APLICACIÓN CON SWAGGER**

### **1. Instalar Dependencias (Primera vez solamente)**
```bash
npm install
```

### **2. Compilar el Código TypeScript**
```bash
npm run build
```

### **3. Levantar el Servidor Local**
```bash
npm start
```

**¡La aplicación estará corriendo en:** `http://localhost:3000`

---

## 📚 **ACCEDER A LA DOCUMENTACIÓN SWAGGER**

### **🎯 Interfaz Visual Interactiva de Swagger UI**
Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva:

```
🌐 http://localhost:3000/docs
```

**Esta interfaz te permite:**
- ✅ Ver todos los endpoints disponibles
- ✅ Probar cada endpoint directamente desde el navegador
- ✅ Ver ejemplos de requests y responses
- ✅ Validar parámetros y campos requeridos
- ✅ Explorar todos los schemas de datos

### **📄 Especificación OpenAPI JSON**
```
🌐 http://localhost:3000/api-docs.json
```
Este endpoint devuelve la especificación completa en formato JSON.

---

## 🎮 **CÓMO USAR SWAGGER UI**

### **Paso 1: Abrir la Documentación**
1. Asegúrate de que la aplicación esté corriendo (`npm start`)
2. Abre tu navegador
3. Ve a: `http://localhost:3000/docs`

### **Paso 2: Explorar los Endpoints**
La documentación estará organizada en **3 secciones principales:**

1. **🏥 Health Check** - Verificar estado de la API
2. **📋 Appointments** - Operaciones CRUD de citas
3. **📊 Statistics** - Estadísticas del sistema

### **Paso 3: Probar un Endpoint**
1. **Hacer clic en cualquier endpoint** (por ejemplo: `POST /appointments`)
2. **Hacer clic en "Try it out"** (botón azul)
3. **Completar los campos** requeridos en el ejemplo
4. **Hacer clic en "Execute"** (botón azul)
5. **Ver la respuesta** en tiempo real

### **Ejemplo Visual de Uso:**
```
1. Expandir "POST /appointments"
2. Clic en "Try it out"
3. Modificar el JSON de ejemplo:
   {
     "patientName": "Tu Nombre",
     "patientEmail": "tu@email.com",
     "doctorName": "Dr. Test",
     "appointmentDate": "2025-12-15",
     "appointmentTime": "10:00"
   }
4. Clic en "Execute"
5. Ver el resultado en la sección "Response"
```

---

## 📋 **LISTA COMPLETA DE ENDPOINTS DOCUMENTADOS EN SWAGGER**

| Método | Endpoint | Descripción | Tag |
|--------|----------|-------------|-----|
| `GET` | `/hello` | Health check del sistema | Health Check |
| `GET` | `/docs` | **Swagger UI** (Interfaz visual) | Documentation |
| `GET` | `/api-docs.json` | Especificación OpenAPI JSON | Documentation |
| `POST` | `/appointments` | Crear nueva cita médica | Appointments |
| `GET` | `/appointments` | Listar citas con filtros | Appointments |
| `GET` | `/appointments/{id}` | Obtener cita específica | Appointments |
| `PUT` | `/appointments/{id}` | Actualizar cita existente | Appointments |
| `DELETE` | `/appointments/{id}` | Eliminar cita | Appointments |
| `GET` | `/appointments/stats` | Obtener estadísticas | Statistics |
| `PATCH` | `/appointments/{id}/confirm` | Confirmar cita | Appointments |
| `PATCH` | `/appointments/{id}/cancel` | Cancelar cita | Appointments |

---

## 🔥 **FUNCIONALIDADES AVANZADAS DE SWAGGER UI**

### **✅ Filtro de Endpoints**
- Puedes usar la barra de búsqueda para filtrar endpoints
- Buscar por tag (Health Check, Appointments, Statistics)

### **✅ Ejemplos Automáticos**
- Cada endpoint muestra ejemplos de request/response
- Los campos requeridos están marcados claramente
- Validaciones automáticas de formato

### **✅ Esquemas de Datos**
- En la parte inferior puedes ver todos los "Schemas"
- Definiciones completas de `Appointment` y otros objetos
- Tipos de datos y ejemplos

### **✅ Pruebas Directas**
- **"Try it out"** te permite hacer requests reales
- Responses en tiempo real con códigos de estado
- Headers y body completos

---

## 🧪 **FLUJO RECOMENDADO PARA PROBAR LA API**

### **1. Verificar que funciona**
```
GET /hello
```

### **2. Crear tu primera cita**
```
POST /appointments
```
Usar el ejemplo y cambiar los datos por los tuyos.

### **3. Ver todas las citas**
```
GET /appointments
```

### **4. Obtener estadísticas**
```
GET /appointments/stats
```

### **5. Filtrar citas**
```
GET /appointments?doctorName=García&includeStats=true
```

### **6. Probar confirmación**
```
PATCH /appointments/{id}/confirm
```
(Usar un ID de cita creada anteriormente)

---

## 💡 **TIPS PARA USAR SWAGGER EFICIENTEMENTE**

### **🎯 Para Desarrolladores:**
- **Usa los ejemplos** como base y modifica solo lo necesario
- **Lee las validaciones** en la descripción de cada campo
- **Prueba casos de error** usando datos inválidos
- **Exporta la especificación** usando el JSON endpoint

### **🎯 Para Testing:**
- **Combina filtros** para probar funcionalidad avanzada
- **Usa paginación** con diferentes límites
- **Prueba todos los estados** de citas disponibles
- **Valida las estadísticas** después de crear varias citas

---

## 🚨 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **❌ "Cannot reach the API"**
```bash
# Verifica que el servidor esté corriendo
npm start

# Debería mostrar: "Server ready: http://localhost:3000"
```

### **❌ "404 Not Found" en /docs**
```bash
# Recompila el código
npm run build

# Reinicia el servidor
npm start
```

### **❌ Swagger UI no carga correctamente**
- Verifica que tengas conexión a internet (usa CDNs)
- Prueba abrir en modo incógnito
- Limpia caché del navegador

---

## 📊 **CAPTURAS DE PANTALLA DE LA INTERFAZ**

### **Página Principal de Swagger:**
```
🏥 Appointment Backend API
Version: 2.0.0

📌 Health Check
  GET /hello - Health check del sistema

📌 Appointments  
  POST /appointments - Crear nueva cita médica
  GET /appointments - Listar citas con filtros
  GET /appointments/{id} - Obtener cita específica
  PUT /appointments/{id} - Actualizar cita existente
  DELETE /appointments/{id} - Eliminar cita
  PATCH /appointments/{id}/confirm - Confirmar cita
  PATCH /appointments/{id}/cancel - Cancelar cita

📌 Statistics
  GET /appointments/stats - Obtener estadísticas del sistema
```

---

## 🎉 **¡CONCLUSIÓN!**

Ahora tienes una **documentación interactiva completa** de tu API con Swagger UI que incluye:

✅ **11 endpoints** completamente documentados
✅ **Interfaz visual** para probar en tiempo real
✅ **Ejemplos automáticos** para cada endpoint
✅ **Validaciones** y esquemas de datos
✅ **Filtros y búsqueda** en la documentación
✅ **Especificación OpenAPI 3.0** estándar

### **🚀 URLs Importantes:**
- **API**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/docs` 
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

### **🏆 Para comenzar:**
```bash
npm install
npm run build  
npm start
# Luego abrir: http://localhost:3000/docs
```

**¡Disfruta explorando y probando tu API con Swagger UI!** 🎯