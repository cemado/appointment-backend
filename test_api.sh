#!/bin/bash

# Script para probar la API de Appointment Backend
# Asegúrate de que la API esté corriendo en http://localhost:3000

BASE_URL="http://localhost:3000"
APPOINTMENT_ID=""

echo "🚀 Iniciando pruebas de la API de Appointment Backend"
echo "========================================================"

# 1. Health Check
echo -e "\n1️⃣  Testing Health Check..."
curl -s -X GET $BASE_URL/hello | jq '.'

# 2. Crear una cita
echo -e "\n2️⃣  Creating a new appointment..."
RESPONSE=$(curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Juan Pérez",
    "patientEmail": "juan.perez@email.com",
    "patientPhone": "+34666123456",
    "doctorName": "Dr. María García",
    "doctorSpecialty": "Cardiología",
    "appointmentDate": "2025-01-15",
    "appointmentTime": "10:00",
    "duration": 45,
    "priority": "high",
    "appointmentType": "consultation",
    "notes": "Primera consulta - dolor en el pecho",
    "symptoms": "Dolor torácico, palpitaciones",
    "roomNumber": "205",
    "cost": 150.00,
    "insuranceInfo": {
      "provider": "Sanitas",
      "policyNumber": "POL123456",
      "coverageType": "Complete"
    }
  }')

echo $RESPONSE | jq '.'
APPOINTMENT_ID=$(echo $RESPONSE | jq -r '.data.appointment.id')
echo "📝 Appointment ID created: $APPOINTMENT_ID"

# 3. Crear otra cita
echo -e "\n3️⃣  Creating another appointment..."
curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Ana López",
    "patientEmail": "ana.lopez@email.com",
    "doctorName": "Dr. Pedro Martín",
    "doctorSpecialty": "Dermatología",
    "appointmentDate": "2025-01-16",
    "appointmentTime": "14:30",
    "priority": "medium",
    "appointmentType": "follow-up",
    "notes": "Seguimiento de tratamiento"
  }' | jq '.'

# 4. Crear una tercera cita
echo -e "\n4️⃣  Creating a third appointment..."
curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Carlos Ruiz",
    "patientEmail": "carlos.ruiz@email.com",
    "doctorName": "Dr. María García",
    "doctorSpecialty": "Cardiología",
    "appointmentDate": "2025-01-17",
    "appointmentTime": "09:15",
    "priority": "urgent",
    "appointmentType": "emergency",
    "notes": "Emergencia cardíaca"
  }' | jq '.'

# 5. Listar todas las citas
echo -e "\n5️⃣  Listing all appointments..."
curl -s -X GET "$BASE_URL/appointments" | jq '.'

# 6. Listar citas con filtros
echo -e "\n6️⃣  Listing appointments with filters..."
curl -s -X GET "$BASE_URL/appointments?doctorName=García&includeStats=true" | jq '.'

# 7. Obtener cita específica
if [ ! -z "$APPOINTMENT_ID" ]; then
    echo -e "\n7️⃣  Getting specific appointment..."
    curl -s -X GET "$BASE_URL/appointments/$APPOINTMENT_ID" | jq '.'
fi

# 8. Actualizar cita
if [ ! -z "$APPOINTMENT_ID" ]; then
    echo -e "\n8️⃣  Updating appointment..."
    curl -s -X PUT "$BASE_URL/appointments/$APPOINTMENT_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "notes": "Nota actualizada - paciente reporta mejora",
        "status": "confirmed"
      }' | jq '.'
fi

# 9. Confirmar cita
if [ ! -z "$APPOINTMENT_ID" ]; then
    echo -e "\n9️⃣  Confirming appointment..."
    curl -s -X PATCH "$BASE_URL/appointments/$APPOINTMENT_ID/confirm" | jq '.'
fi

# 10. Obtener estadísticas
echo -e "\n🔟 Getting appointment statistics..."
curl -s -X GET "$BASE_URL/appointments/stats" | jq '.'

# 11. Listar citas con paginación
echo -e "\n1️⃣1️⃣ Listing appointments with pagination..."
curl -s -X GET "$BASE_URL/appointments?page=1&limit=2&includeStats=true" | jq '.'

# 12. Probar filtros por fecha
echo -e "\n1️⃣2️⃣ Testing date filters..."
curl -s -X GET "$BASE_URL/appointments?dateFrom=2025-01-15&dateTo=2025-01-17" | jq '.'

# 13. Cancelar cita (opcional)
# if [ ! -z "$APPOINTMENT_ID" ]; then
#     echo -e "\n1️⃣3️⃣ Cancelling appointment..."
#     curl -s -X PATCH "$BASE_URL/appointments/$APPOINTMENT_ID/cancel" | jq '.'
# fi

# 14. Eliminar cita (opcional)
# if [ ! -z "$APPOINTMENT_ID" ]; then
#     echo -e "\n1️⃣4️⃣ Deleting appointment..."
#     curl -s -X DELETE "$BASE_URL/appointments/$APPOINTMENT_ID" | jq '.'
# fi

echo -e "\n✅ Pruebas completadas!"
echo "========================================================"
echo "📋 Resumen de endpoints probados:"
echo "   ✓ GET /hello"
echo "   ✓ POST /appointments"
echo "   ✓ GET /appointments"
echo "   ✓ GET /appointments?filters"
echo "   ✓ GET /appointments/{id}"
echo "   ✓ PUT /appointments/{id}"
echo "   ✓ PATCH /appointments/{id}/confirm"
echo "   ✓ GET /appointments/stats"
echo ""
echo "🔧 Para ejecutar este script:"
echo "   chmod +x test_api.sh"
echo "   ./test_api.sh"
echo ""
echo "📝 Nota: Asegúrate de tener jq instalado para formatear JSON"
echo "   # Ubuntu/Debian: sudo apt install jq"
echo "   # macOS: brew install jq"
echo "   # Windows: descargar desde https://stedolan.github.io/jq/"