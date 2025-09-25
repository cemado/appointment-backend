@echo off
REM Script para probar la API de Appointment Backend en Windows
REM Asegúrate de que la API esté corriendo en http://localhost:3000

set BASE_URL=http://localhost:3000
set APPOINTMENT_ID=

echo 🚀 Iniciando pruebas de la API de Appointment Backend
echo ========================================================

REM 1. Health Check
echo.
echo 1️⃣  Testing Health Check...
curl -s -X GET %BASE_URL%/hello

REM 2. Crear una cita
echo.
echo 2️⃣  Creating a new appointment...
curl -s -X POST %BASE_URL%/appointments ^
  -H "Content-Type: application/json" ^
  -d "{\"patientName\": \"Juan Pérez\", \"patientEmail\": \"juan.perez@email.com\", \"patientPhone\": \"+34666123456\", \"doctorName\": \"Dr. María García\", \"doctorSpecialty\": \"Cardiología\", \"appointmentDate\": \"2025-01-15\", \"appointmentTime\": \"10:00\", \"duration\": 45, \"priority\": \"high\", \"appointmentType\": \"consultation\", \"notes\": \"Primera consulta - dolor en el pecho\", \"symptoms\": \"Dolor torácico, palpitaciones\", \"roomNumber\": \"205\", \"cost\": 150.00, \"insuranceInfo\": {\"provider\": \"Sanitas\", \"policyNumber\": \"POL123456\", \"coverageType\": \"Complete\"}}"

REM 3. Crear otra cita
echo.
echo 3️⃣  Creating another appointment...
curl -s -X POST %BASE_URL%/appointments ^
  -H "Content-Type: application/json" ^
  -d "{\"patientName\": \"Ana López\", \"patientEmail\": \"ana.lopez@email.com\", \"doctorName\": \"Dr. Pedro Martín\", \"doctorSpecialty\": \"Dermatología\", \"appointmentDate\": \"2025-01-16\", \"appointmentTime\": \"14:30\", \"priority\": \"medium\", \"appointmentType\": \"follow-up\", \"notes\": \"Seguimiento de tratamiento\"}"

REM 4. Crear una tercera cita
echo.
echo 4️⃣  Creating a third appointment...
curl -s -X POST %BASE_URL%/appointments ^
  -H "Content-Type: application/json" ^
  -d "{\"patientName\": \"Carlos Ruiz\", \"patientEmail\": \"carlos.ruiz@email.com\", \"doctorName\": \"Dr. María García\", \"doctorSpecialty\": \"Cardiología\", \"appointmentDate\": \"2025-01-17\", \"appointmentTime\": \"09:15\", \"priority\": \"urgent\", \"appointmentType\": \"emergency\", \"notes\": \"Emergencia cardíaca\"}"

REM 5. Listar todas las citas
echo.
echo 5️⃣  Listing all appointments...
curl -s -X GET "%BASE_URL%/appointments"

REM 6. Listar citas con filtros
echo.
echo 6️⃣  Listing appointments with filters...
curl -s -X GET "%BASE_URL%/appointments?doctorName=García&includeStats=true"

REM 7. Obtener estadísticas
echo.
echo 7️⃣  Getting appointment statistics...
curl -s -X GET "%BASE_URL%/appointments/stats"

REM 8. Listar citas con paginación
echo.
echo 8️⃣  Listing appointments with pagination...
curl -s -X GET "%BASE_URL%/appointments?page=1&limit=2&includeStats=true"

REM 9. Probar filtros por fecha
echo.
echo 9️⃣  Testing date filters...
curl -s -X GET "%BASE_URL%/appointments?dateFrom=2025-01-15&dateTo=2025-01-17"

echo.
echo ✅ Pruebas completadas!
echo ========================================================
echo 📋 Resumen de endpoints probados:
echo    ✓ GET /hello
echo    ✓ POST /appointments
echo    ✓ GET /appointments
echo    ✓ GET /appointments?filters
echo    ✓ GET /appointments/stats
echo.
echo 🔧 Para ejecutar este script:
echo    test_api_windows.bat
echo.
echo 📝 Nota: Este script usa curl. Asegúrate de tenerlo instalado
echo    Si no tienes curl, puedes usar Postman o Thunder Client en VS Code

pause