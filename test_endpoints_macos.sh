#!/bin/bash
# Script to test local API endpoints on macOS
echo "🔬 Probando endpoints locales..."
API_URL="http://localhost:3000"
echo "Health Check:"
curl -s "$API_URL/hello"
echo ""
echo "AWS Health:"
curl -s "$API_URL/aws-health"
echo ""
echo "Swagger Docs:"
curl -s "$API_URL/docs"