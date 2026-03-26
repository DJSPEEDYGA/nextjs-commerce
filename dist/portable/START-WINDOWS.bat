@echo off
title SUPER GOAT ROYALTIES APP v3.0.0
color 0A
echo.
echo ================================================
echo    SUPER GOAT ROYALTIES APP v3.0.0
echo    AI-Powered Music Royalty Management Platform
echo ================================================
echo.
echo Starting server on port 4001...
echo.
echo Open your browser to: http://localhost:4001
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --production
    echo.
)

:: Start the server
node server.js

pause
