AGENT-007 PYTHON IMAGE RUNTIME FIX
==============================

This repair switched Agent-007's image runtime installer to:

  /Users/raspy/.local/bin/python3.11 (3.11.15)

It rebuilt:
- ComfyUI venv
- Diffusers venv

It did not install:
- Auto1111
- Forge
- InvokeAI

Those can be added later after the Python/runtime stack is stable and there is enough drive space.

Start:
  cd "/Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER"
  bash "./START-AGENT-007-IMAGE-RUNTIMES.sh"

Test:
  cd "/Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER"
  bash "./TEST-AGENT-007-IMAGE-RUNTIMES.sh"

Model folders:
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/checkpoints
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/flux
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/loras
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/vae
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/controlnet
  /Volumes/FKD1/AGENT-007-THOR-ONE-FOLDER/models/text_encoders
