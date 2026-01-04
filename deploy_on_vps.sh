#!/bin/bash
# Script para ejecutar EN EL VPS directamente
# Guarda como deploy.sh en el VPS y ejecuta: bash deploy.sh

cd /home/prd-mcqs-jcq/htdocs/mcqs-jcq.cloud

echo "==================================================="
echo "1. Actualizando código desde GitHub..."
echo "==================================================="
git pull origin main

echo ""
echo "==================================================="
echo "2. Creando .env.production para frontend..."
echo "==================================================="
echo 'NEXT_PUBLIC_API_URL=https://back.mcqs-jcq.cloud' > frontend/.env.production
cat frontend/.env.production

echo ""
echo "==================================================="
echo "3. Instalando dependencias NPM..."
echo "==================================================="
cd frontend
npm install

echo ""
echo "==================================================="
echo "4. Reconstruyendo frontend (puede tardar ~2 min)..."
echo "==================================================="
rm -rf .next
npm run build

echo ""
echo "==================================================="
echo "5. Reiniciando servicios PM2..."
echo "==================================================="
pm2 restart fastapi-mcqs
pm2 restart nextjs-mcqs

echo ""
echo "==================================================="
echo "6. Estado de servicios:"
echo "==================================================="
pm2 status

echo ""
echo "✅ DESPLIEGUE COMPLETADO"
echo "Abre: https://mcqs-jcq.cloud"
