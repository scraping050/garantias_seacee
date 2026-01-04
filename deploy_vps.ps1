$password = "prd-mcqs-jcq"
$sshUser = "prd-mcqs-jcq"
$sshHost = "72.61.219.79"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "INICIANDO DESPLIEGUE AUTOMATIZADO AL VPS" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Función para ejecutar comando SSH
function Run-SSHCommand {
    param($command, $description)
    Write-Host "► $description..." -ForegroundColor Yellow
    $result = echo $password | ssh -o StrictHostKeyChecking=no "$sshUser@$sshHost" $command 2>&1
    Write-Host $result
    Write-Host ""
}

# PASO 1: Git Pull
Run-SSHCommand "cd /home/prd-mcqs-jcq/htdocs/mcqs-jcq.cloud && git pull origin main" "Actualizando código desde GitHub"

# PASO 2: Crear .env.production
Run-SSHCommand "echo 'NEXT_PUBLIC_API_URL=https://back.mcqs-jcq.cloud' > /home/prd-mcqs-jcq/htdocs/mcqs-jcq.cloud/frontend/.env.production" "Creando archivo .env.production"

# PASO 3: NPM Install
Run-SSHCommand "cd /home/prd-mcqs-jcq/htdocs/mcqs-jcq.cloud/frontend && npm install" "Instalando dependencias NPM"

# PASO 4: NPM Build (esto puede tardar)
Write-Host "► Reconstruyendo Frontend (puede tardar 1-2 minutos)..." -ForegroundColor Yellow
$buildResult = echo $password | ssh -o StrictHostKeyChecking=no "$sshUser@$sshHost" "cd /home/prd-mcqs-jcq/htdocs/mcqs-jcq.cloud/frontend && rm -rf .next && npm run build" 2>&1
Write-Host $buildResult
Write-Host ""

# PASO 5: Restart Backend
Run-SSHCommand "pm2 restart fastapi-mcqs" "Reiniciando Backend (FastAPI)"

# PASO 6: Restart Frontend
Run-SSHCommand "pm2 restart nextjs-mcqs" "Reiniciando Frontend (Next.js)"

# PASO 7: Status
Run-SSHCommand "pm2 status" "Verificando estado de servicios"

Write-Host "==================================================" -ForegroundColor Green
Write-Host "✅ DESPLIEGUE COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Abre tu navegador en: https://mcqs-jcq.cloud" -ForegroundColor Cyan
Write-Host "El login debería funcionar correctamente ahora." -ForegroundColor Cyan
