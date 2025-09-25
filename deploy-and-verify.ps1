# 🚀 SCRIPT DE DESPLIEGUE Y VERIFICACIÓN AWS
# Archivo: deploy-and-verify.ps1

Write-Host "🚀 INICIANDO DESPLIEGUE A AWS..." -ForegroundColor Green

# Función para mostrar mensajes con colores
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# 1. VERIFICAR PREREQUISITOS
Write-Host "`n📋 VERIFICANDO PREREQUISITOS..." -ForegroundColor Yellow

# Verificar AWS CLI
try {
    $awsVersion = aws --version 2>$null
    Write-ColorOutput Green "✅ AWS CLI instalado: $awsVersion"
} catch {
    Write-ColorOutput Red "❌ AWS CLI no encontrado. Instalar desde: https://aws.amazon.com/cli/"
    exit 1
}

# Verificar credenciales
try {
    $identity = aws sts get-caller-identity 2>$null | ConvertFrom-Json
    Write-ColorOutput Green "✅ AWS Credenciales configuradas para usuario: $($identity.Arn)"
    Write-ColorOutput Green "   Account ID: $($identity.Account)"
} catch {
    Write-ColorOutput Red "❌ AWS Credenciales no configuradas. Ejecutar: aws configure"
    exit 1
}

# Verificar Node.js y npm
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-ColorOutput Green "✅ Node.js: $nodeVersion"
    Write-ColorOutput Green "✅ NPM: $npmVersion"
} catch {
    Write-ColorOutput Red "❌ Node.js/NPM no encontrado"
    exit 1
}

# 2. COMPILAR Y PREPARAR
Write-Host "`n🔧 COMPILANDO APLICACIÓN..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Error en compilación"
    exit 1
}
Write-ColorOutput Green "✅ Compilación exitosa"

# 3. DESPLEGAR A AWS
Write-Host "`n📦 DESPLEGANDO A AWS..." -ForegroundColor Yellow
Write-Host "   Esto puede tomar varios minutos..." -ForegroundColor Gray

# Ejecutar despliegue con output completo
$deployOutput = sls deploy --verbose 2>&1
Write-Host $deployOutput

if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "❌ Error en despliegue"
    exit 1
}

# Extraer información del despliegue
$apiGatewayUrl = ""
$deployOutput -split "`n" | ForEach-Object {
    if ($_ -match "endpoint: (.*)") {
        $apiGatewayUrl = $matches[1].Trim()
    }
}

Write-ColorOutput Green "✅ Despliegue exitoso!"
Write-ColorOutput Green "🌐 API Gateway URL: $apiGatewayUrl"

# 4. VERIFICAR RECURSOS EN AWS
Write-Host "`n📊 VERIFICANDO RECURSOS AWS..." -ForegroundColor Yellow

# Verificar Lambda Functions
Write-Host "`n🔍 Lambda Functions:" -ForegroundColor Cyan
$lambdaFunctions = aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `appointment-backend`)].{Name:FunctionName,Runtime:Runtime,State:State}' --output table
Write-Host $lambdaFunctions

# Verificar API Gateway
Write-Host "`n🔍 API Gateway:" -ForegroundColor Cyan
$apiGateways = aws apigatewayv2 get-apis --query 'Items[?starts_with(Name, `appointment-backend`)].{Name:Name,ApiId:ApiId,ProtocolType:ProtocolType}' --output table
Write-Host $apiGateways

# Verificar CloudFormation Stack
Write-Host "`n🔍 CloudFormation Stack:" -ForegroundColor Cyan
$cfStacks = aws cloudformation list-stacks --query 'StackSummaries[?starts_with(StackName, `appointment-backend`) && StackStatus != `DELETE_COMPLETE`].{Name:StackName,Status:StackStatus,Created:CreationTime}' --output table
Write-Host $cfStacks

# Verificar Log Groups
Write-Host "`n🔍 CloudWatch Log Groups:" -ForegroundColor Cyan
$logGroups = aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/appointment-backend" --query 'logGroups[].logGroupName' --output table
Write-Host $logGroups

# 5. TESTING POST-DESPLIEGUE
if ($apiGatewayUrl -ne "") {
    Write-Host "`n🧪 EJECUTANDO TESTS POST-DESPLIEGUE..." -ForegroundColor Yellow
    
    # Test Health Check
    Write-Host "   Probando Health Check..." -ForegroundColor Gray
    try {
        $healthResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/hello" -Method GET -TimeoutSec 30
        Write-ColorOutput Green "   ✅ Health Check OK: $($healthResponse.message)"
    } catch {
        Write-ColorOutput Red "   ❌ Health Check falló: $($_.Exception.Message)"
    }
    
    # Test AWS Health
    Write-Host "   Probando AWS Health Check..." -ForegroundColor Gray
    try {
        $awsHealthResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/aws-health" -Method GET -TimeoutSec 30
        Write-ColorOutput Green "   ✅ AWS Health Check OK: Status $($awsHealthResponse.status)"
    } catch {
        Write-ColorOutput Red "   ❌ AWS Health Check falló: $($_.Exception.Message)"
    }
    
    # Test Swagger UI
    Write-Host "   Probando Swagger UI..." -ForegroundColor Gray
    try {
        $swaggerResponse = Invoke-WebRequest -Uri "$apiGatewayUrl/docs" -Method GET -TimeoutSec 30
        if ($swaggerResponse.StatusCode -eq 200) {
            Write-ColorOutput Green "   ✅ Swagger UI accesible"
        }
    } catch {
        Write-ColorOutput Red "   ❌ Swagger UI no accesible: $($_.Exception.Message)"
    }
    
    # Test API Endpoints
    Write-Host "   Probando endpoints de la API..." -ForegroundColor Gray
    try {
        $appointmentsResponse = Invoke-RestMethod -Uri "$apiGatewayUrl/appointments" -Method GET -TimeoutSec 30
        Write-ColorOutput Green "   ✅ GET /appointments OK"
    } catch {
        Write-ColorOutput Red "   ❌ GET /appointments falló: $($_.Exception.Message)"
    }
}

# 6. RESUMEN FINAL
Write-Host "`n📋 RESUMEN DEL DESPLIEGUE" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-ColorOutput Green "✅ Aplicación desplegada exitosamente"
Write-ColorOutput Green "🌐 API URL: $apiGatewayUrl"
Write-ColorOutput Green "📚 Swagger UI: $apiGatewayUrl/docs"
Write-ColorOutput Green "🔗 API Docs JSON: $apiGatewayUrl/api-docs.json"

Write-Host "`n📊 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "1. Abrir AWS Console y verificar recursos"
Write-Host "2. Acceder a Swagger UI en: $apiGatewayUrl/docs"
Write-Host "3. Configurar CloudWatch Dashboards"
Write-Host "4. Configurar alarmas de monitoreo"

# 7. ABRIR RECURSOS EN NAVEGADOR
$openBrowser = Read-Host "`n¿Deseas abrir los recursos en el navegador? (y/N)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    if ($apiGatewayUrl -ne "") {
        Write-Host "🌐 Abriendo Swagger UI..." -ForegroundColor Green
        Start-Process "$apiGatewayUrl/docs"
    }
    
    Write-Host "🌐 Abriendo AWS Console..." -ForegroundColor Green
    Start-Process "https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions"
}

Write-Host "`n🎉 ¡DESPLIEGUE COMPLETADO!" -ForegroundColor Green