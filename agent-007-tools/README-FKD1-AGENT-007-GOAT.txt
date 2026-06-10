AGENT-007 + GOAT FKD1 OFFLINE/LOCAL FIXED PACK
==========================================

Goal
----
These files make FKD1 the shared local drive for Agent-007, the GOAT Royalty App,
model storage, local tools, crew/profile data access, logs, caches, temp files,
build outputs, and download targets.

Default behavior
----------------
- Uses FKD1 first.
- Keeps Agent-007/GOAT offline by default.
- Does not git clone, install packages, or pull models from the internet unless
  you explicitly set GOAT_ALLOW_ONLINE=1 or AGENT-007_ALLOW_ONLINE=1.
- Uses existing GOAT/Agent-007 files and Ollama/GGUF models already on FKD1.
- Writes .agent-007-fkd1.env / .agent-007-fkd1.ps1 on FKD1 so launchers inherit the same paths.

Fast Mac/Linux test
-------------------
Put this pack on the FKD1 drive, open Terminal, then run:

  cd /Volumes/FKD1
  bash ./AGENT-007-FKD1-BASIC-NEEDS-TEST.sh

The test checks:
- FKD1 exists, is writable, and has enough free space.
- Agent-007 can see GOAT app files on the same drive.
- Agent-007 tool workspace points to FKD1.
- Ollama model storage is on FKD1.
- GOAT web pages start locally.
- Agent-007 bridge and crew/profile APIs respond.
- Agent-007 image rendering produces actual graphics, not only text descriptions.

If drawing fails, the report will say so clearly and also write a local fallback
PNG/SVG proof file to FKD1. If the fallback works, FKD1 write access is fine and
the issue is Agent-007's image-render tool routing or local image backend.

Fast Windows test
-----------------
Open PowerShell from the FKD1 drive and run:

  powershell -ExecutionPolicy Bypass -File .\AGENT-007-FKD1-BASIC-NEEDS-TEST.ps1

Install / launch
----------------
Mac/Linux:

  cd /Volumes/FKD1
  bash ./install.sh

Windows:

  Double-click install.bat

Model pack behavior
-------------------
To verify/use models already on FKD1 without internet:

  bash ./AGENT-007-START-ALL-LLM-DOWNLOADS.sh

To intentionally download missing models to FKD1, opt in explicitly:

  AGENT-007_ALLOW_ONLINE=1 bash ./AGENT-007-START-ALL-LLM-DOWNLOADS.sh

All 29-model pack downloads should have roughly 450GB free before starting.

Offline drawing fallback endpoint
---------------------------------
If Agent-007 still only describes pictures, start the local drawing fallback:

  bash ./AGENT-007-FKD1-START-DRAWING-BRIDGE.sh

It starts a zero-login, zero-API-key local endpoint at:

  http://127.0.0.1:3344/api/draw

It writes actual PNG/SVG files onto FKD1. It is a fallback renderer, not a full
image diffusion model. Use it to prove that Agent-007 can route a graphics job into
a real file instead of only replying with prose. The launcher exports:

  AGENT-007_IMAGE_RENDER_ENDPOINT=http://127.0.0.1:3344/api/draw
  GOAT_IMAGE_RENDER_ENDPOINT=http://127.0.0.1:3344/api/draw
  AGENT-007_IMAGE_OUTPUT_DIR=<FKD1 root>

Windows drawing fallback:

  powershell -ExecutionPolicy Bypass -File .\AGENT-007-FKD1-START-DRAWING-BRIDGE.ps1
