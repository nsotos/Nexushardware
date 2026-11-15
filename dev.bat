@echo off
echo ========================================================
echo Iniciando NexusHardware (Backend y Frontend simultaneos)
echo ========================================================
echo.
start "NexusHardware - Backend (Puerto 4000)" cmd /k "cd backend && npm run dev"
start "NexusHardware - Frontend (Puerto 3000)" cmd /k "cd frontend && npm run dev"
echo Servidores iniciados en ventanas independientes.
