@echo off
cd /d "%~dp0"
echo Instalando dependencias com npm.cmd (evita bloqueio do PowerShell)...
call npm.cmd install %*
if errorlevel 1 (
  echo Falhou. Tente abrir o CMD ou ajustar a politica de execucao do PowerShell.
  pause
  exit /b 1
)
echo Pronto.
pause
