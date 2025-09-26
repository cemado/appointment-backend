#!/bin/bash
# Script para desplegar y verificar una aplicación Node.js en AWS usando Serverless Framework en macOSs
echo "🚀 Compilando aplicación..."
npm run build || exit 1
echo "📦 Desplegando a AWS..."
serverless deploy --verbose || exit 1
echo "🌐 Verificando endpoints..."
API_URL=$(serverless info --verbose | grep 'endpoints:' -A 1 | tail -n 1 | awk '{print $2}')
echo "Endpoint base: $API_URL"
curl -s "$API_URL/hello"
curl -s "$API_URL/aws-health"
curl -s "$API_URL/docs"