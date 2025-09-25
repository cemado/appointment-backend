# AWS CLI Installer for Windows
Write-Host "AWS CLI INSTALLER" -ForegroundColor Green

# Check if AWS CLI is already installed
try {
    $version = aws --version 2>$null
    Write-Host "AWS CLI already installed: $version" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "AWS CLI not found. Installing..." -ForegroundColor Red
}

# Check admin permissions
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Administrator permissions required" -ForegroundColor Yellow
    Write-Host "Opening as administrator..." -ForegroundColor Yellow
    Start-Process PowerShell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit 0
}

# Download and install
$url = "https://awscli.amazonaws.com/AWSCLIV2.msi"
$temp = "$env:TEMP\AWSCLIV2.msi"

Write-Host "Downloading AWS CLI..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $url -OutFile $temp
    Write-Host "Download completed" -ForegroundColor Green
} catch {
    Write-Host "Download failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Installing AWS CLI..." -ForegroundColor Yellow
$process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$temp`" /quiet /norestart" -Wait -PassThru

if ($process.ExitCode -eq 0) {
    Write-Host "AWS CLI installed successfully!" -ForegroundColor Green
    Remove-Item $temp -Force -ErrorAction SilentlyContinue
    
    Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Close and reopen PowerShell" -ForegroundColor White
    Write-Host "2. Run: aws configure" -ForegroundColor White
    Write-Host "3. Enter your AWS credentials" -ForegroundColor White
    Write-Host "4. Run: aws sts get-caller-identity" -ForegroundColor White
    Write-Host "5. Run: npm run deploy" -ForegroundColor White
} else {
    Write-Host "Installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
    exit 1
}

Read-Host "`nPress Enter to close"