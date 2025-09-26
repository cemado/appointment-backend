#!/bin/bash
# Script para instalar AWS CLI en macOS
echo "🚀 Instalando AWS CLI en macOS..."
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
rm AWSCLIV2.pkg
echo "✅ AWS CLI instalado. Ejecuta: aws --version"