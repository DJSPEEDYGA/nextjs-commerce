# Starts the offline FKD1 local drawing fallback endpoint on 127.0.0.1:3344.

# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.ps1).
$_ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$_StorageConfig = Join-Path $_ScriptRoot ".agent-007-storage-config.ps1"
if (Test-Path $_StorageConfig) { . $_StorageConfig }

$ErrorActionPreference = "Stop"
function Normalize-DriveRoot([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path)) { return $null }
    $candidate = $Path.Trim().Trim('"')
    if ($candidate -match '^[A-Za-z]:$') { $candidate = "$candidate\" }
    if ($candidate -notmatch '[\/]$') { $candidate = "$candidate\" }
    if (Test-Path $candidate) { return (Resolve-Path $candidate).Path.TrimEnd('\') }
    return $null
}
function Find-FKD1Root {
    foreach ($envPath in @($env:FKD1_ROOT, $env:FKD1_DRIVE)) {
        $root = Normalize-DriveRoot $envPath
        if ($root) { return $root }
    }
    try {
        $vol = Get-Volume -FileSystemLabel "FKD1" -ErrorAction SilentlyContinue | Where-Object { $_.DriveLetter } | Select-Object -First 1
        if ($vol -and $vol.DriveLetter) { return "$($vol.DriveLetter):" }
    } catch {}
    try {
        $disk = Get-CimInstance Win32_LogicalDisk -ErrorAction SilentlyContinue | Where-Object { $_.VolumeName -eq "FKD1" -and $_.DeviceID } | Select-Object -First 1
        if ($disk) { return $disk.DeviceID }
    } catch {}
    return $null
}
$DriveRoot = Find-FKD1Root
if (-not $DriveRoot) { throw "FKD1 drive not found. Mount it or set FKD1_ROOT." }
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Bridge = Join-Path $ScriptRoot "AGENT-007-FKD1-LOCAL-DRAWING-BRIDGE.py"
if (-not (Test-Path $Bridge)) { throw "Drawing bridge Python file not found: $Bridge" }
$Python = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $Python) { $Python = (Get-Command python3 -ErrorAction SilentlyContinue).Source }
if (-not $Python) { throw "Python not found." }
$LogDir = Join-Path $DriveRoot ".goat-logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$env:FKD1_ROOT = $DriveRoot
$env:GOAT_DATA_ROOT = $DriveRoot
$env:AGENT_007_IMAGE_RENDER_ENDPOINT = "http://127.0.0.1:3344/api/draw"
$env:GOAT_IMAGE_RENDER_ENDPOINT = $env:AGENT_007_IMAGE_RENDER_ENDPOINT
$env:AGENT_007_IMAGE_OUTPUT_DIR = $DriveRoot
try {
    Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3344/health" -TimeoutSec 3 | Out-Null
    Write-Host "Agent-007 FKD1 Local Drawing Bridge is already running at $($env:AGENT_007_IMAGE_RENDER_ENDPOINT)" -ForegroundColor Green
    exit 0
} catch {}
$Log = Join-Path $LogDir "oscar-local-drawing-bridge.log"
Start-Process -WindowStyle Hidden -FilePath $Python -ArgumentList @($Bridge, "--root", $DriveRoot) -RedirectStandardOutput $Log -RedirectStandardError $Log
Start-Sleep -Seconds 2
try {
    Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3344/health" -TimeoutSec 5 | Out-Null
    Write-Host "Agent-007 FKD1 Local Drawing Bridge started: $($env:AGENT_007_IMAGE_RENDER_ENDPOINT)" -ForegroundColor Green
    Write-Host "Output root: $DriveRoot"
} catch {
    throw "Drawing bridge did not start. Check $Log"
}
