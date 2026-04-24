@echo off
title GOAT Royalty - Agent Backend
color 0E
cls

echo.
echo  ========================================
echo   GOAT Royalty Agent Backend Startup
echo  ========================================
echo.

REM Check for Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Python not found!
    echo  Please install Python from: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo  [INFO] Python found
echo.

REM Get the workspace directory
set "WORKSPACE_DIR=%~dp0..\..\.."
cd /d "%WORKSPACE_DIR%"

echo  [INFO] Workspace Directory: %WORKSPACE_DIR%
echo.

REM Check for required files
if not exist "goat_intel.py" (
    echo  [ERROR] goat_intel.py not found!
    echo  Make sure you're in the correct directory
    echo.
    pause
    exit /b 1
)

if not exist "goat_brain.py" (
    echo  [ERROR] goat_brain.py not found!
    echo.
    pause
    exit /b 1
)

if not exist "money-penny-agent.py" (
    echo  [ERROR] money-penny-agent.py not found!
    echo.
    pause
    exit /b 1
)

echo  [OK] All agent files found
echo.

REM Create logs directory
if not exist "logs" mkdir logs

echo  [INFO] Starting GOAT Intel Server...
echo  [INFO] URL: http://localhost:5500
echo.

REM Start goat_intel.py in background
start /B python goat_intel.py > logs\goat_intel.log 2>&1

REM Wait for server to start
echo  [INFO] Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Check if server is running using curl if available
curl -s http://localhost:5500/ >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo  ========================================
    echo    Agent Backend Successfully Started!
    echo  ========================================
    echo.
    echo  Endpoints:
    echo    - Health Check: http://localhost:5500/
    echo    - Chat API:     http://localhost:5500/api/chat
    echo    - Tools API:    http://localhost:5500/api/tools
    echo    - Agents API:   http://localhost:5500/api/agents"
    echo.
    echo  Log files:
    echo    - goat_intel.log: logs\goat_intel.log
    echo.
    echo  Press Ctrl+C to stop the server
    echo.
    
    REM Keep the script running
    :: Wait indefinitely
    timeout /t 999999
) else (
    echo.
    echo  [ERROR] Server failed to start!
    echo  Check logs: logs\goat_intel.log
    echo.
    pause
    exit /b 1
)