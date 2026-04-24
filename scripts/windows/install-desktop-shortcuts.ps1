# GOAT Royalty Enhanced Platform - Desktop Shortcut Installer
# Run this script as Administrator

param(
    [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

# Configuration
$AppName = "GOAT Royalty"
$AppFolder = "GOAT Royalty Enhanced"
$InstallPath = Split-Path -Parent $PSScriptRoot
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$StartMenuPath = [Environment]::GetFolderPath("Programs")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GOAT Royalty - Desktop Shortcut Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($Uninstall) {
    Write-Host "[INFO] Removing shortcuts..." -ForegroundColor Yellow
    
    # Remove desktop shortcuts
    $shortcuts = @(
        "$DesktopPath\$AppName - Dashboard.lnk",
        "$DesktopPath\$AppName - Simple Server.lnk",
        "$DesktopPath\$AppName - Full Server.lnk",
        "$DesktopPath\$AppName - Setup Ollama.lnk"
    )
    
    foreach ($shortcut in $shortcuts) {
        if (Test-Path $shortcut) {
            Remove-Item $shortcut -Force
            Write-Host "  Removed: $shortcut" -ForegroundColor Green
        }
    }
    
    # Remove start menu folder
    $startMenuFolder = "$StartMenuPath\$AppFolder"
    if (Test-Path $startMenuFolder) {
        Remove-Item $startMenuFolder -Recurse -Force
        Write-Host "  Removed: $startMenuFolder" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "[OK] Shortcuts removed successfully!" -ForegroundColor Green
    exit 0
}

# Create shortcuts
$WshShell = New-Object -ComObject WScript.Shell

# Desktop shortcuts
$shortcuts = @(
    @{
        Name = "$AppName - Dashboard"
        Target = "http://localhost:8080/goat-royalty-enhanced.html"
        Description = "Open GOAT Royalty Enhanced Dashboard"
        Icon = "shell32.dll,14"
    },
    @{
        Name = "$AppName - Simple Server"
        Target = "$InstallPath\scripts\windows\start-simple.bat"
        Description = "Start GOAT Royalty Simple Web Server"
        Icon = "shell32.dll,15"
    },
    @{
        Name = "$AppName - Full Server"
        Target = "$InstallPath\scripts\windows\start-full.bat"
        Description = "Start GOAT Royalty Full API Server"
        Icon = "shell32.dll,77"
    },
    @{
        Name = "$AppName - Setup Ollama"
        Target = "$InstallPath\scripts\windows\setup-ollama.bat"
        Description = "Setup Ollama AI for GOAT Royalty"
        Icon = "shell32.dll,71"
    }
)

Write-Host "[INFO] Creating desktop shortcuts..." -ForegroundColor Yellow

foreach ($shortcutInfo in $shortcuts) {
    $shortcutPath = "$DesktopPath\$($shortcutInfo.Name).lnk"
    $shortcut = $WshShell.CreateShortcut($shortcutPath)
    
    if ($shortcutInfo.Target -like "http*") {
        # URL shortcut
        $shortcut.TargetPath = $shortcutInfo.Target
    } else {
        # File shortcut
        $shortcut.TargetPath = $shortcutInfo.Target
        $shortcut.WorkingDirectory = Split-Path -Parent $shortcutInfo.Target
    }
    
    $shortcut.Description = $shortcutInfo.Description
    $shortcut.Save()
    
    Write-Host "  Created: $($shortcutInfo.Name)" -ForegroundColor Green
}

# Start Menu folder
Write-Host ""
Write-Host "[INFO] Creating Start Menu entries..." -ForegroundColor Yellow

$startMenuFolder = "$StartMenuPath\$AppFolder"
if (-not (Test-Path $startMenuFolder)) {
    New-Item -ItemType Directory -Path $startMenuFolder | Out-Null
}

foreach ($shortcutInfo in $shortcuts) {
    $shortcutPath = "$startMenuFolder\$($shortcutInfo.Name).lnk"
    $shortcut = $WshShell.CreateShortcut($shortcutPath)
    
    if ($shortcutInfo.Target -like "http*") {
        $shortcut.TargetPath = $shortcutInfo.Target
    } else {
        $shortcut.TargetPath = $shortcutInfo.Target
        $shortcut.WorkingDirectory = Split-Path -Parent $shortcutInfo.Target
    }
    
    $shortcut.Description = $shortcutInfo.Description
    $shortcut.Save()
    
    Write-Host "  Created: $($shortcutInfo.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Desktop shortcuts created:" -ForegroundColor White
Write-Host "  - GOAT Royalty - Dashboard (opens web app)" -ForegroundColor Gray
Write-Host "  - GOAT Royalty - Simple Server (frontend only)" -ForegroundColor Gray
Write-Host "  - GOAT Royalty - Full Server (with AI features)" -ForegroundColor Gray
Write-Host "  - GOAT Royalty - Setup Ollama (install AI models)" -ForegroundColor Gray
Write-Host ""
Write-Host "To uninstall shortcuts, run:" -ForegroundColor Yellow
Write-Host "  .\install-desktop-shortcuts.ps1 -Uninstall" -ForegroundColor Gray
Write-Host ""