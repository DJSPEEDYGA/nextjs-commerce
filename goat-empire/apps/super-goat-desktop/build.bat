@echo off
REM ============================================================
REM  SUPER GOAT ROYALTY APP - One-Click Build Script (Windows)
REM  Builds: EXE (NSIS installer), Portable EXE
REM  Usage:  build.bat           -> build for Windows
REM          build.bat all       -> build for all platforms
REM ============================================================

echo.
echo ============================================
echo   SUPER GOAT ROYALTY APP - FINAL LLM BUILD
echo   by DJ Speedy / GOAT Force
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install Node 18+ from https://nodejs.org
  exit /b 1
)
echo [OK] Node detected
node -v
echo.

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
) else (
  echo [OK] Dependencies already installed
)
echo.

set TARGET=%1
if "%TARGET%"=="" set TARGET=win

echo Building target: %TARGET%
echo.

if "%TARGET%"=="all"   ( call npm run build:all   & goto :done )
if "%TARGET%"=="win"   ( call npm run build:win   & goto :done )
if "%TARGET%"=="mac"   ( call npm run build:mac   & goto :done )
if "%TARGET%"=="linux" ( call npm run build:linux & goto :done )
call npm run build

:done
echo.
echo ============================================
echo   BUILD COMPLETE
echo   Output: .\dist\
echo ============================================
dir dist