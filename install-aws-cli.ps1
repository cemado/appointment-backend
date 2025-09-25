# 🚀 INSTALADOR AUTOMÁTICO AWS CLI
# Archivo: install-aws-cli.ps1

Write-Host "🚀 INSTALADOR AUTOMÁTICO DE AWS CLI" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Verificar si AWS CLI ya está instalado
Write-Host "`n🔍 Verificando si AWS CLI ya está instalado..." -ForegroundColor Yellow

try {
    $awsVersion = aws --version 2>$null
    if ($awsVersion) {
        Write-Host "✅ AWS CLI ya está instalado: $awsVersion" -ForegroundColor Green
        $reinstall = Read-Host "`n¿Deseas reinstalar AWS CLI? (y/N)"
        if ($reinstall -ne "y" -and $reinstall -ne "Y") {
            Write-Host "⏭️ Saltando instalación..." -ForegroundColor Yellow
            exit 0
        }
    }
} catch {
    Write-Host "❌ AWS CLI no encontrado. Procediendo con la instalación..." -ForegroundColor Red
}

# Verificar permisos de administrador
Write-Host "`n🔐 Verificando permisos de administrador..." -ForegroundColor Yellow

$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️ Se requieren permisos de administrador para instalar AWS CLI" -ForegroundColor Yellow
    Write-Host "   Reinicia PowerShell como Administrador y ejecuta este script nuevamente" -ForegroundColor Yellow
    
    $runAsAdmin = Read-Host "`n¿Intentar ejecutar como administrador automáticamente? (y/N)"
    if ($runAsAdmin -eq "y" -or $runAsAdmin -eq "Y") {
        Start-Process PowerShell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
        exit 0
    } else {
        exit 1
    }
}

# Descargar e instalar AWS CLI
Write-Host "`n📥 Descargando AWS CLI v2..." -ForegroundColor Yellow

$awsCliUrl = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$tempPath = "$env:TEMP\AWSCLIV2.msi"

try {
    # Descargar AWS CLI MSI
    Write-Host "   Descargando desde: $awsCliUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $awsCliUrl -OutFile $tempPath -UseBasicParsing
    Write-Host "✅ Descarga completada" -ForegroundColor Green
    
    # Instalar AWS CLI
    Write-Host "`n🔧 Instalando AWS CLI..." -ForegroundColor Yellow
    Write-Host "   Esto puede tomar unos minutos..." -ForegroundColor Gray
    
    $installProcess = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$tempPath`" /quiet /norestart" -Wait -PassThru
    
    if ($installProcess.ExitCode -eq 0) {
        Write-Host "✅ AWS CLI instalado exitosamente!" -ForegroundColor Green
        
        # Limpiar archivo temporal
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        
        # Actualizar PATH
        Write-Host "`n🔄 Actualizando variables de entorno..." -ForegroundColor Yellow
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        
        Write-Host "✅ Variables de entorno actualizadas" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Error durante la instalación (Código: $($installProcess.ExitCode))" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "❌ Error durante la descarga/instalación: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar instalación
Write-Host "`n✅ Verificando instalación..." -ForegroundColor Yellow

# Esperar un momento para que el PATH se actualice
Start-Sleep -Seconds 3

# Intentar encontrar AWS CLI en ubicaciones comunes
$awsExePaths = @(
    "$env:ProgramFiles\Amazon\AWSCLIV2\aws.exe",
    "$env:ProgramFiles(x86)\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files\Amazon\AWSCLIV2\aws.exe",
    "C:\Program Files (x86)\Amazon\AWSCLIV2\aws.exe"
)

$awsCliFound = $false
foreach ($path in $awsExePaths) {
    if (Test-Path $path) {
        Write-Host "✅ AWS CLI encontrado en: $path" -ForegroundColor Green
        
        # Obtener versión
        try {
            $version = & $path --version 2>$null
            Write-Host "✅ Versión instalada: $version" -ForegroundColor Green
            $awsCliFound = $true
            break
        } catch {
            Write-Host "⚠️ AWS CLI encontrado pero error al obtener versión" -ForegroundColor Yellow
        }
    }
}

if (-not $awsCliFound) {
    Write-Host "⚠️ AWS CLI instalado pero no encontrado en PATH" -ForegroundColor Yellow
    Write-Host "   Cierra y abre nuevamente PowerShell, luego ejecuta: aws --version" -ForegroundColor Yellow
}

# Instrucciones de configuración
Write-Host "`n🔑 PRÓXIMO PASO: CONFIGURAR CREDENCIALES AWS" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host "`n📋 Para configurar AWS CLI necesitas:" -ForegroundColor Yellow
Write-Host "   1. AWS Access Key ID" -ForegroundColor White
Write-Host "   2. AWS Secret Access Key" -ForegroundColor White
Write-Host "   3. Región (recomendado: us-east-1)" -ForegroundColor White

Write-Host "`n🌐 Si no tienes credenciales AWS:" -ForegroundColor Yellow
Write-Host "   1. Ve a: https://console.aws.amazon.com/" -ForegroundColor White
Write-Host "   2. Crea cuenta gratuita (si no tienes)" -ForegroundColor White
Write-Host "   3. Ve a IAM → Users → Create User" -ForegroundColor White
Write-Host "   4. Asigna permisos AdministratorAccess" -ForegroundColor White
Write-Host "   5. Genera Access Keys" -ForegroundColor White

Write-Host "`n⚡ Comandos para configurar:" -ForegroundColor Cyan
Write-Host "   aws configure" -ForegroundColor White
Write-Host "   aws sts get-caller-identity" -ForegroundColor White

$configureNow = Read-Host "`n¿Deseas configurar AWS CLI ahora? (y/N)"

if ($configureNow -eq "y" -or $configureNow -eq "Y") {
    Write-Host "`n🔧 Iniciando configuración de AWS CLI..." -ForegroundColor Green
    
    # Reiniciar PowerShell para asegurar que AWS CLI esté en PATH
    Write-Host "`n🔄 Para asegurar que AWS CLI funcione correctamente," -ForegroundColor Yellow
    Write-Host "   se abrirá una nueva ventana de PowerShell." -ForegroundColor Yellow
    Write-Host "   En la nueva ventana, ejecuta:" -ForegroundColor Yellow
    Write-Host "`n   aws configure" -ForegroundColor Cyan
    Write-Host "`n   Luego regresa aquí para continuar con el despliegue." -ForegroundColor Yellow
    
    Start-Sleep -Seconds 3
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "Write-Host 'AWS CLI instalado. Ejecuta: aws configure' -ForegroundColor Green; Write-Host 'Luego ejecuta: aws sts get-caller-identity' -ForegroundColor Yellow"
}

Write-Host "`n🎉 INSTALACIÓN DE AWS CLI COMPLETADA!" -ForegroundColor Green
Write-Host "`nSiguientes pasos:" -ForegroundColor Yellow
Write-Host "1. Cierra y abre nuevamente PowerShell" -ForegroundColor White
Write-Host "2. Ejecuta: aws configure" -ForegroundColor White
Write-Host "3. Ejecuta: npm run deploy" -ForegroundColor White