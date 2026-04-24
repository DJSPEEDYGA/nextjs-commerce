@echo off
title GOAT Royalty - Ollama Setup
color 0E
cls

echo.
echo  ========================================
echo   GOAT Royalty - Ollama AI Setup
echo  ========================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo  [INFO] Ollama not found. Downloading...
    echo.
    echo  Opening Ollama download page...
    start https://ollama.com/download
    echo.
    echo  Please:
    echo  1. Download and install Ollama
    echo  2. Run this script again after installation
    echo.
    pause
    exit /b 0
)

echo  [OK] Ollama is installed
echo.

REM Start Ollama service
echo  [INFO] Starting Ollama service...
start /B ollama serve >nul 2>&1
timeout /t 3 >nul

REM List installed models
echo  [INFO] Checking installed models...
ollama list
echo.

REM Ask which models to install
echo  ========================================
echo   Available AI Models for GOAT Royalty
echo  ========================================
echo.
echo  Recommended models:
echo  [1] llama3.1:8b      - Best overall (4.7 GB)
echo  [2] mistral-nemo:12b - Advanced reasoning (7.1 GB)
echo  [3] qwen2.5:14b      - Multilingual (8.2 GB)
echo  [4] Install ALL recommended models (~20 GB)
echo  [5] Skip - I'll install models manually
echo.
echo  ----------------------------------------

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo  [INFO] Installing llama3.1:8b...
    ollama pull llama3.1:8b
)
if "%choice%"=="2" (
    echo.
    echo  [INFO] Installing mistral-nemo:12b...
    ollama pull mistral-nemo:12b
)
if "%choice%"=="3" (
    echo.
    echo  [INFO] Installing qwen2.5:14b...
    ollama pull qwen2.5:14b
)
if "%choice%"=="4" (
    echo.
    echo  [INFO] Installing all recommended models...
    echo.
    echo  [1/3] Installing llama3.1:8b...
    ollama pull llama3.1:8b
    echo.
    echo  [2/3] Installing mistral-nemo:12b...
    ollama pull mistral-nemo:12b
    echo.
    echo  [3/3] Installing qwen2.5:14b...
    ollama pull qwen2.5:14b
)
if "%choice%"=="5" (
    echo.
    echo  [INFO] Skipping model installation.
    echo  You can install models manually with: ollama pull ^<model-name^>
)

echo.
echo  ========================================
echo   Setup Complete!
echo  ========================================
echo.
echo  Installed models:
ollama list
echo.
echo  To start using GOAT Royalty with AI features:
echo  1. Run start-simple.bat for frontend-only
echo  2. Run start-full.bat for full AI features
echo.
pause