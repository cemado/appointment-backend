# 🔍 VERIFICADOR DE RECURSOS AWS - DASHBOARD GUIDE
# Archivo: verify-aws-dashboard.ps1

Write-Host "🔍 VERIFICADOR DE RECURSOS AWS EN DASHBOARD" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Función para abrir URLs en el navegador
function Open-AWSConsole($service, $url, $description) {
    Write-Host "`n📊 $description" -ForegroundColor Yellow
    Write-Host "   URL: $url" -ForegroundColor Gray
    
    $open = Read-Host "   ¿Abrir en navegador? (y/N)"
    if ($open -eq "y" -or $open -eq "Y") {
        Start-Process $url
        Write-Host "   ✅ Abriendo $service..." -ForegroundColor Green
    }
}

# Obtener información del stack desplegado
Write-Host "`n📋 Obteniendo información del deployment..." -ForegroundColor Yellow

try {
    $stackInfo = sls info --verbose 2>$null
    Write-Host $stackInfo
} catch {
    Write-Host "⚠️ No se pudo obtener info del stack. Asegúrate de que esté desplegado." -ForegroundColor Red
}

# Obtener región y account ID
$region = "us-east-1"
$accountInfo = aws sts get-caller-identity 2>$null | ConvertFrom-Json
$accountId = $accountInfo.Account

Write-Host "`n📍 Información de la cuenta:" -ForegroundColor Cyan
Write-Host "   Account ID: $accountId" -ForegroundColor White
Write-Host "   Región: $region" -ForegroundColor White

# URLs de AWS Console para cada servicio
$baseConsoleUrl = "https://console.aws.amazon.com"

# 1. LAMBDA FUNCTIONS
$lambdaUrl = "$baseConsoleUrl/lambda/home?region=$region#/functions"
Open-AWSConsole "Lambda" $lambdaUrl "Lambda Functions - Verificar las 14 funciones desplegadas"

Write-Host "`n   🔍 Funciones Lambda a verificar:" -ForegroundColor Gray
$expectedFunctions = @(
    "appointment-backend-dev-hello",
    "appointment-backend-dev-createAppointment",
    "appointment-backend-dev-getAppointments", 
    "appointment-backend-dev-getAppointment",
    "appointment-backend-dev-updateAppointment",
    "appointment-backend-dev-deleteAppointment",
    "appointment-backend-dev-getAppointmentStats",
    "appointment-backend-dev-confirmAppointment",
    "appointment-backend-dev-cancelAppointment",
    "appointment-backend-dev-swaggerUI",
    "appointment-backend-dev-swaggerJSON",
    "appointment-backend-dev-awsHealth",
    "appointment-backend-dev-awsConfig",
    "appointment-backend-dev-awsConnectivity"
)

foreach ($func in $expectedFunctions) {
    Write-Host "     ✓ $func" -ForegroundColor Green
}

# 2. API GATEWAY
$apiGatewayUrl = "$baseConsoleUrl/apigateway/main/apis?region=$region"
Open-AWSConsole "API Gateway" $apiGatewayUrl "API Gateway - Verificar endpoints y configuración"

Write-Host "`n   🔍 Endpoints a verificar:" -ForegroundColor Gray
$expectedEndpoints = @(
    "GET /hello",
    "GET /docs", 
    "GET /api-docs.json",
    "POST /appointments",
    "GET /appointments",
    "GET /appointments/{id}",
    "PUT /appointments/{id}",
    "DELETE /appointments/{id}",
    "GET /appointments/stats",
    "PATCH /appointments/{id}/confirm",
    "PATCH /appointments/{id}/cancel",
    "GET /aws-health",
    "GET /aws-config",
    "GET /aws-connectivity"
)

foreach ($endpoint in $expectedEndpoints) {
    Write-Host "     ✓ $endpoint" -ForegroundColor Green
}

# 3. CLOUDFORMATION
$cloudFormationUrl = "$baseConsoleUrl/cloudformation/home?region=$region#/stacks"
Open-AWSConsole "CloudFormation" $cloudFormationUrl "CloudFormation - Ver stack y recursos creados"

# 4. CLOUDWATCH LOGS
$cloudWatchLogsUrl = "$baseConsoleUrl/cloudwatch/home?region=$region#logsV2:log-groups"
Open-AWSConsole "CloudWatch Logs" $cloudWatchLogsUrl "CloudWatch Logs - Ver logs de las funciones Lambda"

# 5. CLOUDWATCH METRICS
$cloudWatchMetricsUrl = "$baseConsoleUrl/cloudwatch/home?region=$region#metricsV2:"
Open-AWSConsole "CloudWatch Metrics" $cloudWatchMetricsUrl "CloudWatch Metrics - Ver métricas de rendimiento"

# 6. IAM ROLES
$iamUrl = "$baseConsoleUrl/iam/home#/roles"
Open-AWSConsole "IAM" $iamUrl "IAM Roles - Verificar roles de ejecución Lambda"

# Verificar recursos específicos mediante AWS CLI
Write-Host "`n🔍 VERIFICACIÓN MEDIANTE AWS CLI" -ForegroundColor Yellow

# Lista de funciones Lambda
Write-Host "`n📋 Funciones Lambda desplegadas:" -ForegroundColor Cyan
try {
    $lambdas = aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `appointment-backend-dev`)].{Name:FunctionName,Runtime:Runtime,LastModified:LastModified}' --output table
    Write-Host $lambdas
} catch {
    Write-Host "❌ Error obteniendo funciones Lambda" -ForegroundColor Red
}

# API Gateway APIs
Write-Host "`n📋 APIs de API Gateway:" -ForegroundColor Cyan
try {
    $apis = aws apigatewayv2 get-apis --query 'Items[?starts_with(Name, `appointment-backend`)].{Name:Name,ApiId:ApiId,CreatedDate:CreatedDate}' --output table
    Write-Host $apis
    
    # Obtener API ID para mostrar rutas
    $apiId = aws apigatewayv2 get-apis --query 'Items[?starts_with(Name, `appointment-backend`)].ApiId' --output text
    if ($apiId) {
        Write-Host "`n📋 Rutas de la API:" -ForegroundColor Cyan
        $routes = aws apigatewayv2 get-routes --api-id $apiId --query 'Items[].{Route:RouteKey,Target:Target}' --output table
        Write-Host $routes
    }
} catch {
    Write-Host "❌ Error obteniendo APIs" -ForegroundColor Red
}

# CloudFormation Stacks
Write-Host "`n📋 CloudFormation Stacks:" -ForegroundColor Cyan
try {
    $stacks = aws cloudformation list-stacks --query 'StackSummaries[?starts_with(StackName, `appointment-backend`) && StackStatus != `DELETE_COMPLETE`].{Name:StackName,Status:StackStatus,Created:CreationTime}' --output table
    Write-Host $stacks
} catch {
    Write-Host "❌ Error obteniendo stacks de CloudFormation" -ForegroundColor Red
}

# Log Groups
Write-Host "`n📋 CloudWatch Log Groups:" -ForegroundColor Cyan
try {
    $logGroups = aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/appointment-backend" --query 'logGroups[].{Name:logGroupName,Created:creationTime,Size:storedBytes}' --output table
    Write-Host $logGroups
} catch {
    Write-Host "❌ Error obteniendo log groups" -ForegroundColor Red
}

# Crear dashboard personalizado de CloudWatch
Write-Host "`n📊 ¿Crear dashboard personalizado de CloudWatch?" -ForegroundColor Yellow
$createDashboard = Read-Host "   Esto creará un dashboard con métricas de tu aplicación (y/N)"

if ($createDashboard -eq "y" -or $createDashboard -eq "Y") {
    $dashboardBody = @'
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Invocations", "FunctionName", "appointment-backend-dev-createAppointment" ],
                    [ ".", ".", ".", "appointment-backend-dev-getAppointments" ],
                    [ ".", ".", ".", "appointment-backend-dev-hello" ],
                    [ ".", ".", ".", "appointment-backend-dev-awsHealth" ]
                ],
                "period": 300,
                "stat": "Sum",
                "region": "us-east-1",
                "title": "Lambda Invocations"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 6,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Duration", "FunctionName", "appointment-backend-dev-createAppointment" ],
                    [ ".", ".", ".", "appointment-backend-dev-getAppointments" ]
                ],
                "period": 300,
                "stat": "Average",
                "region": "us-east-1",
                "title": "Lambda Duration"
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 12,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/Lambda", "Errors", "FunctionName", "appointment-backend-dev-createAppointment" ],
                    [ ".", ".", ".", "appointment-backend-dev-getAppointments" ]
                ],
                "period": 300,
                "stat": "Sum",
                "region": "us-east-1",
                "title": "Lambda Errors"
            }
        }
    ]
}
'@

    try {
        $dashboardName = "AppointmentBackend-Dashboard"
        aws cloudwatch put-dashboard --dashboard-name $dashboardName --dashboard-body $dashboardBody
        Write-Host "✅ Dashboard creado: $dashboardName" -ForegroundColor Green
        
        $dashboardUrl = "$baseConsoleUrl/cloudwatch/home?region=$region#dashboards:name=$dashboardName"
        Write-Host "🌐 Ver dashboard: $dashboardUrl" -ForegroundColor Green
        
        $openDash = Read-Host "¿Abrir dashboard? (y/N)"
        if ($openDash -eq "y" -or $openDash -eq "Y") {
            Start-Process $dashboardUrl
        }
    } catch {
        Write-Host "❌ Error creando dashboard: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Resumen de verificación
Write-Host "`n📋 CHECKLIST DE VERIFICACIÓN" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

$checklistItems = @(
    "[ ] Lambda Functions: 14 funciones desplegadas",
    "[ ] API Gateway: API con 14 endpoints activos", 
    "[ ] CloudFormation: Stack creado y en estado CREATE_COMPLETE",
    "[ ] CloudWatch: Log groups creados para cada función",
    "[ ] CloudWatch: Métricas visibles (Invocations, Duration, Errors)",
    "[ ] IAM: Rol de ejecución con permisos correctos",
    "[ ] API: Endpoints respondiendo correctamente",
    "[ ] Swagger UI: Documentación accesible públicamente"
)

foreach ($item in $checklistItems) {
    Write-Host $item -ForegroundColor Yellow
}

Write-Host "`n🎯 PRÓXIMOS PASOS RECOMENDADOS:" -ForegroundColor Cyan
Write-Host "1. Configurar alarmas de CloudWatch para errores > 5%" -ForegroundColor White
Write-Host "2. Crear backup automático de configuración" -ForegroundColor White  
Write-Host "3. Configurar monitoreo de costos en AWS Billing" -ForegroundColor White
Write-Host "4. Implementar DynamoDB para persistencia de datos" -ForegroundColor White
Write-Host "5. Configurar CI/CD pipeline para deployments automáticos" -ForegroundColor White

Write-Host "`n✅ Verificación de recursos AWS completada!" -ForegroundColor Green