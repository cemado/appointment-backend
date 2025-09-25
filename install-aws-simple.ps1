# AWS CLI Installer - Version Simplified
Write-Host "🚀 INSTALADOR AWS CLI" -ForegroundColor Green

# Verificar si ya está instalado
try {
    $version = aws --version 2>$null
    Write-Host "✅ AWS CLI ya instalado: $version" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "❌ AWS CLI no encontrado. Instalando..." -ForegroundColor Red
}

# Verificar permisos admin
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️ Se requieren permisos de administrador" -ForegroundColor Yellow
    Write-Host "Abriendo como administrador..." -ForegroundColor Yellow
    Start-Process PowerShell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit 0
}

# Descargar e instalar
$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$temp = "$env:TEMP\AWSCLIV2.msi"

Write-Host "📥 Descargando AWS CLI..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $temp

Write-Host "🔧 Instalando AWS CLI..." -ForegroundColor Yellow
$process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$temp`" /quiet /norestart" -Wait -PassThru

if ($process.ExitCode -eq 0) {
    Write-Host "✅ AWS CLI instalado!" -ForegroundColor Green
    Remove-Item $temp -Force
    
    Write-Host "`n🔑 CONFIGURAR CREDENCIALES:" -ForegroundColor Yellow
    Write-Host "1. Cierra y abre PowerShell" -ForegroundColor White
    Write-Host "2. Ejecuta: aws configure" -ForegroundColor White
    Write-Host "3. Ingresa tus credenciales AWS" -ForegroundColor White
} else {
    Write-Host "❌ Error en instalación" -ForegroundColor Red
}

Read-Host "Presiona Enter para cerrar"
