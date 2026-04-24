@echo off
title GOAT Royalty Enhanced Platform - Full Server
color 0B
cls

echo.
echo  ========================================
echo   GOAT Royalty Enhanced Platform
echo   Full API Server Launcher
echo  ========================================
echo.

REM Get the directory where this script is located
set "APP_DIR=%~dp0.."
cd /d "%APP_DIR%"

REM Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found!
    echo  Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check for Ollama
echo  [CHECK] Verifying Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [WARNING] Ollama is not running!
    echo  Starting Ollama...
    start "" ollama serve
    timeout /t 5 >nul
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo  [INFO] Installing dependencies...
    call npm install
)

echo.
echo  [INFO] Starting GOAT Royalty API Server...
echo  [INFO] API Server: http://localhost:3001
echo  [INFO] Web App: http://localhost:3001/app
echo  [INFO] Health Check: http://localhost:3001/api/health
echo.
echo  Press Ctrl+C to stop the server
echo  ========================================
echo.

REM Start the API server
node server/api-server.js

pause