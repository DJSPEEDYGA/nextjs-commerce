# Agent-007 FKD1 basic-needs test for Windows PowerShell.
# Verifies FKD1 drive access, GOAT/Agent-007 files, local model store, running APIs,
# and whether Agent-007 returns/creates real graphics instead of text-only drawing.

# Load multi-drive storage config if present (from AGENT-007-CHOOSE-STORAGE.ps1).
$_ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$_StorageConfig = Join-Path $_ScriptRoot ".agent-007-storage-config.ps1"
if (Test-Path $_StorageConfig) { . $_StorageConfig }

$ErrorActionPreference = "Continue"
$script:PassCount = 0
$script:FailCount = 0
$script:WarnCount = 0
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$MinFreeGB = 20
if ($env:AGENT_007_MIN_FREE_GB) { [void][int]::TryParse($env:AGENT_007_MIN_FREE_GB, [ref]$MinFreeGB) }

function Pass([string]$Message) { $script:PassCount++; Write-Host "[PASS] $Message" -ForegroundColor Green }
function Fail([string]$Message) { $script:FailCount++; Write-Host "[FAIL] $Message" -ForegroundColor Red }
function Warn([string]$Message) { $script:WarnCount++; Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Info([string]$Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }

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

function Find-FirstDir([string[]]$Candidates) {
    foreach ($c in $Candidates) { if ($c -and (Test-Path $c -PathType Container)) { return (Resolve-Path $c).Path } }
    return $null
}

function Find-RecursiveDir([string]$Root, [string]$Name) {
    try {
        $hit = Get-ChildItem -LiteralPath $Root -Directory -Filter $Name -Recurse -Depth 5 -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($hit) { return $hit.FullName }
    } catch {}
    return $null
}

function Test-OllamaStore([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path $Path -PathType Container)) { return $false }
    return ((Test-Path (Join-Path $Path "manifests")) -or (Test-Path (Join-Path $Path "blobs")))
}

function Detect-OllamaStore([string]$DriveRoot, [string]$ScriptRoot) {
    $candidates = @(
        $env:OLLAMA_MODELS,
        $env:AGENT_007_MODEL_STORE,
        $DriveRoot,
        (Join-Path $DriveRoot "ollama_data"),
        (Join-Path $DriveRoot "Agent007Models\ollama_data"),
        (Join-Path $DriveRoot "Shared\models\ollama_data"),
        (Join-Path $ScriptRoot "Shared\models\ollama_data")
    ) | Where-Object { $_ }
    foreach ($candidate in $candidates) { if (Test-OllamaStore $candidate) { return $candidate } }
    return $DriveRoot
}

function Http-Check([string]$Label, [string]$Url, [string]$Contains = $null) {
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 15
        if ($res.StatusCode -eq 200) {
            if ($Contains -and ($res.Content -notmatch [regex]::Escape($Contains))) { Warn "$Label -> HTTP 200 but missing marker $Contains" }
            else { Pass "$Label -> HTTP 200" }
        } else { Fail "$Label -> HTTP $($res.StatusCode)" }
    } catch { Fail "$Label -> $($_.Exception.Message)" }
}

function Test-GraphicFile([string]$Path) {
    if (-not (Test-Path $Path -PathType Leaf)) { return $false }
    if ((Get-Item $Path).Length -le 32) { return $false }
    $ext = [IO.Path]::GetExtension($Path).ToLowerInvariant()
    if ($ext -eq ".svg") { return ((Get-Content -LiteralPath $Path -Raw -ErrorAction SilentlyContinue) -match '<svg') }
    if ($ext -eq ".png") {
        $bytes = [IO.File]::ReadAllBytes($Path)
        return ($bytes.Length -ge 8 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47)
    }
    if ($ext -eq ".jpg" -or $ext -eq ".jpeg") {
        $bytes = [IO.File]::ReadAllBytes($Path)
        return ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8)
    }
    return $true
}

function New-LocalSvgFallback([string]$Path) {
@"
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#111827"/>
  <circle cx="256" cy="260" r="110" fill="#d4af37" stroke="#fff1a8" stroke-width="12"/>
  <polygon points="165,160 210,70 220,185" fill="#f5d06a"/>
  <polygon points="347,160 302,70 292,185" fill="#f5d06a"/>
  <circle cx="220" cy="250" r="13" fill="#111827"/>
  <circle cx="292" cy="250" r="13" fill="#111827"/>
  <ellipse cx="256" cy="305" rx="24" ry="14" fill="#111827"/>
  <text x="256" y="455" text-anchor="middle" fill="#f9fafb" font-family="Arial" font-size="36">OSCAR GRAPHICS TEST</text>
</svg>
"@ | Set-Content -LiteralPath $Path -Encoding UTF8
}

function Verify-ActualImageOutput([string]$DriveRoot) {
    $out = Join-Path $DriveRoot "oscar-image-render-smoke-$Stamp.png"
    Remove-Item -LiteralPath $out -Force -ErrorAction SilentlyContinue
    $payload = @{
        prompt = "Create a simple gold goat head icon on a dark studio background. This is a graphics smoke test, not a text description."
        outputPath = $out
        path = $out
        format = "png"
        offline = $true
        save = $true
        width = 512
        height = 512
    } | ConvertTo-Json -Depth 6
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3333/api/goat/image-render-bridge" -Method Post -Body $payload -ContentType "application/json" -TimeoutSec 60
        if (Test-GraphicFile $out) { Pass "Agent-007 image-render bridge created an actual graphic: $out"; return }
        if ($res.Content -match 'data:image|base64') { Pass "Agent-007 image-render bridge returned image data in response"; return }
    } catch {}

    foreach ($action in @("image_render", "draw_image", "generate_image", "render_image")) {
        $payload2 = @{
            action = $action
            prompt = "Create a simple gold goat head icon on a dark studio background. This is a graphics smoke test, not a text description."
            outputPath = $out
            path = $out
            format = "png"
            offline = $true
            save = $true
            width = 512
            height = 512
        } | ConvertTo-Json -Depth 6
        try {
            $res = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3333/api/tools" -Method Post -Body $payload2 -ContentType "application/json" -TimeoutSec 60
            if (Test-GraphicFile $out) { Pass "Agent-007 /api/tools action '$action' created an actual graphic: $out"; return }
            if ($res.Content -match 'data:image|base64') { Pass "Agent-007 /api/tools action '$action' returned image data in response"; return }
        } catch {}
    }

    Fail "Agent-007 did not create or return a real graphic file. This confirms the description-only drawing issue still needs fixing in Agent-007's image tool/back-end."
    $fallback = Join-Path $DriveRoot "oscar-local-graphics-fallback-$Stamp.svg"
    New-LocalSvgFallback $fallback
    if (Test-GraphicFile $fallback) { Warn "Local SVG fallback can create graphics on FKD1, so disk access works. Fallback proof: $fallback" }
}

$DriveRoot = Find-FKD1Root
if (-not $DriveRoot) {
    Write-Host "[FAIL] FKD1 drive was not found. Mount the drive or set FKD1_ROOT to its path." -ForegroundColor Red
    exit 1
}
$Log = Join-Path $DriveRoot "oscar-basic-needs-test-$Stamp.txt"
Start-Transcript -Path $Log -Append | Out-Null

Write-Host "============================================================"
Write-Host "OSCAR FKD1 BASIC NEEDS TEST"
Write-Host "============================================================"
Write-Host "Timestamp: $(Get-Date)"
Write-Host "FKD1 root:  $DriveRoot"
Write-Host "Report:     $Log"
Write-Host ""

try {
    $testFile = Join-Path $DriveRoot ".oscar-basic-needs-write-test"
    "ok" | Set-Content -LiteralPath $testFile -Encoding ASCII
    Remove-Item -LiteralPath $testFile -Force
    Pass "FKD1 is writable"
} catch { Fail "FKD1 is not writable: $($_.Exception.Message)" }

try {
    $drive = Get-PSDrive -Name $DriveRoot.Substring(0,1) -ErrorAction Stop
    $freeGB = [math]::Floor($drive.Free / 1GB)
    if ($freeGB -ge $MinFreeGB) { Pass "FKD1 free space OK: $freeGB GB available; $MinFreeGB GB required" } else { Fail "FKD1 free space too low: $freeGB GB available; $MinFreeGB GB required" }
    if ($freeGB -lt 450) { Warn "Less than 450GB free. That may be too tight for downloading all ~400GB of 29-model packs." }
} catch { Fail "Could not read FKD1 free space: $($_.Exception.Message)" }

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Agent007Root = Find-FirstDir @($env:AGENT_007_ROOT, $DriveRoot, $ScriptRoot, (Join-Path $DriveRoot "USB-Uncensored-LLM-main"), (Join-Path $DriveRoot "GOAT-Royalty-App"))
if ($Agent007Root -and (Test-Path (Join-Path $Agent007Root "Shared\chat_server.py"))) { Pass "Agent-007 root found: $Agent007Root" } else { Fail "Agent-007 root with Shared\chat_server.py not found on FKD1" }
$Shared = if ($Agent007Root) { Join-Path $Agent007Root "Shared" } else { Join-Path $DriveRoot "Shared" }

$GoatRoot = Find-FirstDir @($env:GOAT_APP_ROOT, $env:OSCAR_GOAT_APP_ROOT, (Join-Path $DriveRoot "GOAT-Royalty-App"), (Join-Path $DriveRoot "goat-royalty-portable-2.0.0"), (Join-Path $DriveRoot "USB-Uncensored-LLM-main\goat-royalty-portable-2.0.0"), $DriveRoot, $ScriptRoot)
if (-not ($GoatRoot -and (Test-Path (Join-Path $GoatRoot "web-app")))) {
    $foundWeb = Find-RecursiveDir $DriveRoot "web-app"
    if ($foundWeb) { $GoatRoot = Split-Path -Parent $foundWeb }
}
if ($GoatRoot -and (Test-Path (Join-Path $GoatRoot "web-app"))) { Pass "GOAT app root found: $GoatRoot" } else { Fail "GOAT app root with web-app folder not found on FKD1" }

$env:FKD1_ROOT = $DriveRoot
$env:GOAT_DATA_ROOT = $DriveRoot
$env:GOAT_DOWNLOAD_DIR = $DriveRoot
$env:GOAT_APP_ROOT = $GoatRoot
$env:AGENT_007_ROOT = $Agent007Root
$env:OSCAR_GOAT_APP_ROOT = $GoatRoot
$env:AGENT_007_BRIDGE_WORKSPACE = $DriveRoot
$env:AGENT_007_TOOL_WORKSPACE = $DriveRoot
$env:AGENT_007_ASSET_ROOT = $DriveRoot
$env:AGENT_007_OFFLINE = "1"
$env:GOAT_OFFLINE = "1"
$env:HF_HUB_OFFLINE = "1"
$env:TRANSFORMERS_OFFLINE = "1"
$env:OLLAMA_MODELS = Detect-OllamaStore $DriveRoot $ScriptRoot
$env:AGENT_007_MODEL_STORE = $env:OLLAMA_MODELS
$env:OLLAMA_HOME = Join-Path $DriveRoot ".ollama-runtime"
$env:OLLAMA_RUNNERS_DIR = Join-Path $env:OLLAMA_HOME "runners"
$env:OLLAMA_TMPDIR = Join-Path $env:OLLAMA_HOME "tmp"
$env:OLLAMA_HOST = "127.0.0.1:11434"
New-Item -ItemType Directory -Force -Path $env:OLLAMA_RUNNERS_DIR, $env:OLLAMA_TMPDIR, (Join-Path $DriveRoot ".goat-logs") | Out-Null

Pass "FKD1 environment configured for Agent-007/GOAT"
if (Test-OllamaStore $env:OLLAMA_MODELS) { Pass "Ollama model store found: $($env:OLLAMA_MODELS)" } else { Warn "Ollama model store not found at $($env:OLLAMA_MODELS); set OLLAMA_MODELS if models are elsewhere." }

Write-Host ""
Write-Host "============================================================"
Write-Host "RUNNING API CHECKS"
Write-Host "============================================================"
Http-Check "Ollama tags API" "http://127.0.0.1:11434/api/tags" '"models"'
Http-Check "Agent-007 tool policy" "http://127.0.0.1:3333/api/tools" '"actions"'
Http-Check "Agent-007 workspace bridge" "http://127.0.0.1:3333/api/workspace" '"root"'
Http-Check "GOAT image render bridge status" "http://127.0.0.1:3333/api/goat/image-render-bridge" '"ok"'
Http-Check "Money Penny profile" "http://127.0.0.1:3333/api/money-penny/profile" '"ok"'
Http-Check "Lexicon Lexi profile" "http://127.0.0.1:3333/api/lexicon-lexi/profile" '"ok"'
Http-Check "Ms Vanessa profile" "http://127.0.0.1:3333/api/ms-vanessa/profile" '"ok"'
Http-Check "Ms Nexus profile" "http://127.0.0.1:3333/api/ms-nexus/profile" '"ok"'
Http-Check "Sir Codex profile" "http://127.0.0.1:3333/api/sir-codex/profile" '"ok"'
Http-Check "GOAT web hub" "http://127.0.0.1:8765/index.html"

Write-Host ""
Write-Host "============================================================"
Write-Host "GRAPHICS / DRAWING CHECK"
Write-Host "============================================================"
Verify-ActualImageOutput $DriveRoot

Write-Host ""
Write-Host "============================================================"
Write-Host "SUMMARY"
Write-Host "============================================================"
Write-Host "Pass: $script:PassCount"
Write-Host "Warn: $script:WarnCount"
Write-Host "Fail: $script:FailCount"
Write-Host "Report saved to: $Log"
if ($script:FailCount -eq 0) { Write-Host "OSCAR BASIC NEEDS STATUS: PASS" -ForegroundColor Green } else { Write-Host "OSCAR BASIC NEEDS STATUS: CHECK FAILURES ABOVE" -ForegroundColor Red }
Stop-Transcript | Out-Null
if ($script:FailCount -eq 0) { exit 0 } else { exit 1 }
