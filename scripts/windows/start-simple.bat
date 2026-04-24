@echo off
title GOAT Royalty Enhanced Platform
color 0A
cls

echo.
echo  ========================================
echo   GOAT Royalty Enhanced Platform
echo   Simple Web Server Launcher
echo  ========================================
echo.

REM Get the directory where this script is located
set "APP_DIR=%~dp0.."
cd /d "%APP_DIR%\web-app"

echo  [INFO] Starting web server on port 8080...
echo  [INFO] Open your browser to: http://localhost:8080
echo  [INFO] Enhanced Dashboard: http://localhost:8080/goat-royalty-enhanced.html
echo.
echo  Press Ctrl+C to stop the server
echo  ========================================
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% equ 0 (
    python -m http.server 8080
    goto :end
)

REM Try Python 2
py --version >nul 2>&1
if %errorlevel% equ 0 (
    py -m http.server 8080
    goto :end
)

REM Try py launcher
py -3 -m http.server 8080 2>nul
if %errorlevel% equ 0 goto :end

echo.
echo  [ERROR] Python not found!
echo  Please install Python from: https://www.python.org/downloads/
echo  Make sure to check "Add Python to PATH" during installation.
echo.
pause

:end