# OSCAR-CHOOSE-STORAGE.ps1 — Interactive drive/storage picker for Oscar (Windows).
# Lets you choose which drive or folder to use for each data category
# and writes .oscar-storage-config.env so all Oscar scripts respect it.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\OSCAR-CHOOSE-STORAGE.ps1

$ErrorActionPreference = "Continue"
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Say([string]$Msg) { Write-Host "[INFO] $Msg" -ForegroundColor Cyan }
function Ok([string]$Msg) { Write-Host "[OK] $Msg" -ForegroundColor Green }
function Warn([string]$Msg) { Write-Host "[WARN] $Msg" -ForegroundColor Yellow }

# ── Detect drives ────────────────────────────────────────────────────
$Drives = @()
try {
    $disks = Get-CimInstance Win32_LogicalDisk -ErrorAction SilentlyContinue |
             Where-Object { $_.DriveType -in @(2,3,4,5) -and $_.DeviceID }
    foreach ($d in $disks) {
        $freeGB = [math]::Floor($d.FreeSpace / 1GB)
        $totalGB = [math]::Floor($d.Size / 1GB)
        if ($totalGB -lt 1) { continue }
        $label = if ($d.VolumeName) { $d.VolumeName } else { "(no label)" }
        $Drives += [PSCustomObject]@{
            Path    = $d.DeviceID
            Label   = $label
            FreeGB  = $freeGB
            TotalGB = $totalGB
        }
    }
} catch {
    Write-Host "[ERROR] Could not enumerate drives: $_" -ForegroundColor Red
    exit 1
}

# Also try Volumes API for USB drives with labels
try {
    $vols = Get-Volume -ErrorAction SilentlyContinue |
            Where-Object { $_.DriveLetter -and $_.DriveType -in @('Removable','Fixed') }
    foreach ($v in $vols) {
        $existing = $Drives | Where-Object { $_.Path -eq "$($v.DriveLetter):" }
        if (-not $existing -and $v.SizeRemaining -gt 1GB) {
            $Drives += [PSCustomObject]@{
                Path    = "$($v.DriveLetter):"
                Label   = if ($v.FileSystemLabel) { $v.FileSystemLabel } else { "(no label)" }
                FreeGB  = [math]::Floor($v.SizeRemaining / 1GB)
                TotalGB = [math]::Floor($v.Size / 1GB)
            }
        }
    }
} catch {}

if ($Drives.Count -eq 0) {
    Write-Host "[ERROR] No drives detected." -ForegroundColor Red
    exit 1
}

function Show-Drives {
    Write-Host ""
    Write-Host ("{0,-4} {1,-12} {2,-30} {3,10} {4,10}" -f "#", "DRIVE", "LABEL", "FREE", "TOTAL") -ForegroundColor White
    Write-Host ("=" * 70)
    for ($i = 0; $i -lt $Drives.Count; $i++) {
        $d = $Drives[$i]
        Write-Host ("{0,-4} {1,-12} {2,-30} {3,7} GB {4,7} GB" -f ($i+1), $d.Path, $d.Label, $d.FreeGB, $d.TotalGB)
    }
    Write-Host ""
}

function Pick-Drive([string]$Category, [string]$Description, [int]$DefaultIdx = 1, [string]$Subfolder = "") {
    Write-Host "  $Category" -ForegroundColor White -NoNewline
    Write-Host ""
    Write-Host "  $Description" -ForegroundColor Gray
    if ($Subfolder) { Write-Host "  (subfolder: $Subfolder)" -ForegroundColor DarkGray }
    $choice = Read-Host "  Choose drive number [$DefaultIdx]"
    if ([string]::IsNullOrWhiteSpace($choice)) { $choice = $DefaultIdx }
    if ($choice -eq "c" -or $choice -eq "C") {
        $custom = Read-Host "  Enter custom path"
        if ($custom) { return $custom }
    }
    $idx = [int]$choice - 1
    if ($idx -lt 0 -or $idx -ge $Drives.Count) {
        Warn "Invalid choice, using default."
        $idx = $DefaultIdx - 1
    }
    $base = $Drives[$idx].Path
    if ($Subfolder) { $result = Join-Path $base $Subfolder } else { $result = $base }
    Write-Host "  -> $result" -ForegroundColor Green
    Write-Host ""
    return $result
}

# ── Main ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        OSCAR MULTI-DRIVE STORAGE CONFIGURATOR           ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose which drive or folder for each type of Oscar data."
Write-Host "Large files (LLM models) can go on big drives; small files can stay local."

Show-Drives
Write-Host "Enter a drive number for each category, or 'c' for a custom path."
Write-Host ""

# Find FKD1 default
$defaultIdx = 1
for ($i = 0; $i -lt $Drives.Count; $i++) {
    if ($Drives[$i].Label -eq "FKD1") { $defaultIdx = $i + 1; break }
}

$ChosenApp         = Pick-Drive "Oscar App / Home" "Main Oscar folder: tools, crew data, scripts." $defaultIdx "OSCAR-THOR-ONE-FOLDER"
$ChosenLLM         = Pick-Drive "LLM Models (Ollama)" "Ollama model blobs (~400GB for 29-model pack)." $defaultIdx "models\ollama"
$ChosenGGUF        = Pick-Drive "GGUF Models" "Hugging Face GGUF files." $defaultIdx "models\gguf"
$ChosenImageModels = Pick-Drive "Image Models" "Checkpoints, FLUX, LoRA, VAE, ControlNet." $defaultIdx "models\image"
$ChosenOutputs     = Pick-Drive "Outputs" "Generated images, renders." $defaultIdx "outputs"
$ChosenDownloads   = Pick-Drive "Downloads" "General download targets." $defaultIdx "downloads"
$ChosenCache       = Pick-Drive "Cache" "HF cache, pip, torch." $defaultIdx "cache"
$ChosenLogs        = Pick-Drive "Logs" "Service logs." $defaultIdx "logs"
$ChosenRuntime     = Pick-Drive "Runtime" "Venvs, Ollama runtime, temp." $defaultIdx "runtime"
$ChosenGoat        = Pick-Drive "GOAT App Data" "GOAT Royalty App data." $defaultIdx "data"

# ── Summary ──────────────────────────────────────────────────────────
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "  OSCAR STORAGE CONFIGURATION SUMMARY" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "  App / Home:      $ChosenApp"
Write-Host "  LLM Models:      $ChosenLLM"
Write-Host "  GGUF Models:     $ChosenGGUF"
Write-Host "  Image Models:    $ChosenImageModels"
Write-Host "  Outputs:         $ChosenOutputs"
Write-Host "  Downloads:       $ChosenDownloads"
Write-Host "  Cache:           $ChosenCache"
Write-Host "  Logs:            $ChosenLogs"
Write-Host "  Runtime:         $ChosenRuntime"
Write-Host "  GOAT Data:       $ChosenGoat"
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor White

# ── Write config ─────────────────────────────────────────────────────
$configContent = @"
# Oscar Multi-Drive Storage Configuration
# Generated by OSCAR-CHOOSE-STORAGE.ps1 on $(Get-Date)

export OSCAR_DRIVE_APP="$ChosenApp"
export OSCAR_DRIVE_LLM_MODELS="$ChosenLLM"
export OSCAR_DRIVE_GGUF="$ChosenGGUF"
export OSCAR_DRIVE_IMAGE_MODELS="$ChosenImageModels"
export OSCAR_DRIVE_OUTPUTS="$ChosenOutputs"
export OSCAR_DRIVE_DOWNLOADS="$ChosenDownloads"
export OSCAR_DRIVE_CACHE="$ChosenCache"
export OSCAR_DRIVE_LOGS="$ChosenLogs"
export OSCAR_DRIVE_RUNTIME="$ChosenRuntime"
export OSCAR_DRIVE_GOAT_DATA="$ChosenGoat"

export FKD1_ROOT="`$OSCAR_DRIVE_APP"
export OSCAR_HOME="`$OSCAR_DRIVE_APP"
export OLLAMA_MODELS="`$OSCAR_DRIVE_LLM_MODELS"
export OSCAR_MODEL_STORE="`$OSCAR_DRIVE_LLM_MODELS"
export OSCAR_GGUF_STORE="`$OSCAR_DRIVE_GGUF"
export GOAT_DATA_ROOT="`$OSCAR_DRIVE_GOAT_DATA"
export GOAT_DOWNLOAD_DIR="`$OSCAR_DRIVE_DOWNLOADS"
"@

# Write to Oscar home
New-Item -ItemType Directory -Force -Path $ChosenApp | Out-Null
$configPath = Join-Path $ChosenApp ".oscar-storage-config.env"
Set-Content -Path $configPath -Value $configContent -Encoding UTF8
Ok "Storage config saved: $configPath"

# Also write PowerShell-native env file
$ps1Content = @"
# Oscar Multi-Drive Storage Configuration (PowerShell)
# Generated by OSCAR-CHOOSE-STORAGE.ps1 on $(Get-Date)

`$env:OSCAR_DRIVE_APP = "$ChosenApp"
`$env:OSCAR_DRIVE_LLM_MODELS = "$ChosenLLM"
`$env:OSCAR_DRIVE_GGUF = "$ChosenGGUF"
`$env:OSCAR_DRIVE_IMAGE_MODELS = "$ChosenImageModels"
`$env:OSCAR_DRIVE_OUTPUTS = "$ChosenOutputs"
`$env:OSCAR_DRIVE_DOWNLOADS = "$ChosenDownloads"
`$env:OSCAR_DRIVE_CACHE = "$ChosenCache"
`$env:OSCAR_DRIVE_LOGS = "$ChosenLogs"
`$env:OSCAR_DRIVE_RUNTIME = "$ChosenRuntime"
`$env:OSCAR_DRIVE_GOAT_DATA = "$ChosenGoat"

`$env:FKD1_ROOT = `$env:OSCAR_DRIVE_APP
`$env:OSCAR_HOME = `$env:OSCAR_DRIVE_APP
`$env:OLLAMA_MODELS = `$env:OSCAR_DRIVE_LLM_MODELS
`$env:OSCAR_MODEL_STORE = `$env:OSCAR_DRIVE_LLM_MODELS
`$env:OSCAR_GGUF_STORE = `$env:OSCAR_DRIVE_GGUF
`$env:GOAT_DATA_ROOT = `$env:OSCAR_DRIVE_GOAT_DATA
`$env:GOAT_DOWNLOAD_DIR = `$env:OSCAR_DRIVE_DOWNLOADS
`$env:OSCAR_OUTPUT_DIR = `$env:OSCAR_DRIVE_OUTPUTS
`$env:OSCAR_IMAGE_OUTPUT_DIR = "`$(`$env:OSCAR_DRIVE_OUTPUTS)\images"
`$env:OSCAR_IMAGE_MODEL_ROOT = `$env:OSCAR_DRIVE_IMAGE_MODELS
`$env:OSCAR_LOG_DIR = `$env:OSCAR_DRIVE_LOGS
`$env:OSCAR_RUNTIME_DIR = `$env:OSCAR_DRIVE_RUNTIME
`$env:OLLAMA_HOME = `$env:OSCAR_DRIVE_RUNTIME
`$env:HF_HOME = "`$(`$env:OSCAR_DRIVE_CACHE)\huggingface"
`$env:TORCH_HOME = "`$(`$env:OSCAR_DRIVE_CACHE)\torch"
`$env:PIP_CACHE_DIR = "`$(`$env:OSCAR_DRIVE_CACHE)\pip"
"@

$ps1Path = Join-Path $ChosenApp ".oscar-storage-config.ps1"
Set-Content -Path $ps1Path -Value $ps1Content -Encoding UTF8
Ok "PowerShell config saved: $ps1Path"

# ── Create directories ───────────────────────────────────────────────
Say "Creating storage directories..."
$dirs = @(
    $ChosenApp, $ChosenLLM, $ChosenGGUF,
    $ChosenImageModels,
    "$ChosenImageModels\checkpoints", "$ChosenImageModels\flux",
    "$ChosenImageModels\loras", "$ChosenImageModels\vae",
    "$ChosenImageModels\controlnet", "$ChosenImageModels\embeddings",
    "$ChosenImageModels\upscalers", "$ChosenImageModels\clip",
    "$ChosenImageModels\text_encoders", "$ChosenImageModels\diffusers",
    $ChosenOutputs, "$ChosenOutputs\images",
    $ChosenDownloads, $ChosenCache,
    "$ChosenCache\huggingface", "$ChosenCache\pip", "$ChosenCache\torch",
    $ChosenLogs, $ChosenRuntime, "$ChosenRuntime\pids",
    $ChosenGoat
)
foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d -ErrorAction SilentlyContinue | Out-Null
}
Ok "Storage directories created."

Write-Host ""
Write-Host "DONE! Your Oscar scripts will now use the drives you chose." -ForegroundColor Green
Write-Host "Config file: $configPath"
Write-Host ""
Write-Host "To reconfigure later, run this script again."
Write-Host ""
