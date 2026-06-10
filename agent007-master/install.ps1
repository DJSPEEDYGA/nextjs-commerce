# ============================================================
# Agent-007 - Universal Installer (Windows)
# Run in PowerShell (as Administrator):  ./install.ps1
# ============================================================
$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Agent-007 installer (Windows)" -ForegroundColor Yellow
Write-Host "Master folder: $Here"

# --- 1. Python ---
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Python via winget..."
  winget install -e --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements
}

# --- 2. Python venv + deps ---
Write-Host "Setting up Python venv..."
python -m venv "$Here\.venv"
& "$Here\.venv\Scripts\python.exe" -m pip install --upgrade pip | Out-Null
if (Test-Path "$Here\core\requirements.txt") {
  & "$Here\.venv\Scripts\python.exe" -m pip install -r "$Here\core\requirements.txt"
}

# --- 3. Ollama ---
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Ollama via winget..."
  winget install -e --id Ollama.Ollama --accept-source-agreements --accept-package-agreements
} else {
  Write-Host "Ollama already installed." -ForegroundColor Green
}

# --- 4. Config ---
if (-not (Test-Path "$Here\config\agent007.env")) {
  Copy-Item "$Here\config\agent007.env.example" "$Here\config\agent007.env"
  Write-Host "Created config\agent007.env - edit it for your setup."
}

# --- 5. Pull models ---
Write-Host "Pulling Ollama models (big download)..."
Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 3
foreach ($m in @("llama3","mistral","codellama")) {
  Write-Host "  pull $m"
  ollama pull $m
}

Write-Host "============================================================" -ForegroundColor Green
Write-Host "Agent-007 installed." -ForegroundColor Green
Write-Host "Start him:  & '$Here\.venv\Scripts\python.exe' '$Here\core\chat_server.py'"
Write-Host "He'll be at: http://127.0.0.1:3333"
Write-Host "============================================================" -ForegroundColor Green
