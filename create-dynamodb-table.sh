#!/bin/bash

# Parámetros
TABLE_NAME="appointments-table"
REGION="us-east-1"

echo "🚀 Creando tabla '$TABLE_NAME' en DynamoDB (región $REGION)..."

aws dynamodb create-table \
  --table-name "$TABLE_NAME" \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

echo "✅ Tabla '$TABLE_NAME' creada exitosamente."