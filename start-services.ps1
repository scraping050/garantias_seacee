# Script para iniciar todos los servicios del proyecto
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INICIANDO SERVICIOS DEL PROYECTO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Base de Datos MySQL
Write-Host "[1/3] Verificando Base de Datos MySQL..." -ForegroundColor Yellow
try {
    $mysqlProcess = Get-Process mysqld -ErrorAction SilentlyContinue
    if ($mysqlProcess) {
        Write-Host "OK MySQL esta corriendo (PID: $($mysqlProcess.Id))" -ForegroundColor Green
    }
    else {
        Write-Host "MySQL no esta corriendo. Intentando iniciar..." -ForegroundColor Yellow
        if (Test-Path "C:\laragon\laragon.exe") {
            Start-Process "C:\laragon\laragon.exe"
            Start-Sleep -Seconds 3
        }
    }
}
catch {
    Write-Host "No se pudo verificar MySQL" -ForegroundColor Red
}

Write-Host ""

# 2. Iniciar Backend FastAPI
Write-Host "[2/3] Iniciando Backend FastAPI..." -ForegroundColor Yellow
$backendPath = "C:\laragon\www\BRAYAN\proyecto_garantias"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal
Write-Host "OK Backend iniciado en http://localhost:8000" -ForegroundColor Green
Start-Sleep -Seconds 5

# 3. Iniciar Frontend Next.js
Write-Host "[3/3] Iniciando Frontend Next.js..." -ForegroundColor Yellow
$frontendPath = "C:\laragon\www\BRAYAN\proyecto_garantias\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Write-Host "OK Frontend iniciado en http://localhost:3000" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SERVICIOS INICIADOS EXITOSAMENTE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK Base de Datos: MySQL (localhost:3306)" -ForegroundColor White
Write-Host "OK Backend API:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "OK Frontend:      http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Abriendo navegador..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
Write-Host "(Los servidores seguirán corriendo en sus propias ventanas)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
