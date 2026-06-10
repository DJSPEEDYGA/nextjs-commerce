OSCAR + GOAT ONE-FOLDER DEPLOYMENT
Generated: Sun May 31 01:03:17 EDT 2026
Root at generation time: /Volumes/FKD1/OSCAR-THOR-ONE-FOLDER

WHAT THIS IS
This folder is meant to be the one place Oscar uses for his app files, GOAT Royalty App,
tools, crew data, model storage, downloads, logs, cache, runtime, and outputs.

IMPORTANT FILES
1. .oscar-one-folder.env
   Routes Oscar/GOAT/Ollama/Hugging Face/cache/temp/downloads into this folder.
   It is relocatable, so after moving this folder to Thor, it uses the new folder path.

2. START-OSCAR-ONE-FOLDER.sh
   Starts local services it can find: Ollama, drawing bridge, Oscar chat/tool bridge,
   GOAT Intel server, and GOAT web app.

3. TEST-OSCAR-ONE-FOLDER.sh
   Tests the basic needs: writable storage, local paths, GOAT app visibility,
   Oscar bridge visibility, local model store, and real PNG drawing output.

4. STOP-OSCAR-ONE-FOLDER.sh
   Stops services started by the one-folder launcher.

5. OSCAR-START-ALL-LLM-DOWNLOADS-ONE-FOLDER.sh
   Verifies local model storage by default. It will not download unless you explicitly run:
     OSCAR_ALLOW_ONLINE=1 bash ./OSCAR-START-ALL-LLM-DOWNLOADS-ONE-FOLDER.sh

HOW TO USE ON FKD1 STAGING
  cd "/Volumes/FKD1/OSCAR-THOR-ONE-FOLDER"
  bash ./START-OSCAR-ONE-FOLDER.sh
  bash ./TEST-OSCAR-ONE-FOLDER.sh

HOW TO USE AFTER MOVING TO NVIDIA THOR / JETSON LINUX
  1. Copy this whole folder to the Thor device, for example:
       /home/nvidia/OSCAR-THOR-ONE-FOLDER
     or an external/NVMe mount path you choose.

  2. On Thor:
       cd /path/to/OSCAR-THOR-ONE-FOLDER
       chmod +x *.sh
       bash ./START-OSCAR-ONE-FOLDER.sh
       bash ./TEST-OSCAR-ONE-FOLDER.sh

NOTES
- The deployer does not format, erase, partition, or mount raw disks.
- The launcher uses the folder it lives in. Moving the folder later is expected.
- On Thor/Linux ARM64, a macOS-only Ollama binary will not run. Place/install a Linux ARM64
  Ollama binary if the folder only contains Shared/bin/ollama-darwin.
- Online model downloads are blocked by default.
