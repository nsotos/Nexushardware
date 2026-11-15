# Script nativo de PowerShell para iniciar Backend y Frontend simultáneos
Write-Host "Iniciando NexusHardware..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Write-Host "Ambos servidores iniciados en ventanas separadas." -ForegroundColor Green
