OSCAR COMFYUI MAC RESCUE
========================

This installed a clean legacy ComfyUI copy here:

  /Volumes/FKD1/OSCAR-THOR-ONE-FOLDER/image-runtimes/ComfyUI-Mac-Legacy

It is pinned to a pre-comfy_kitchen source revision:

  38d049382533c6662d815b08ca3395e96cca9f57

This is for Macs where pip only offers Torch up to 2.2.2 and current ComfyUI crashes with:

  AttributeError: module 'torch.library' has no attribute 'custom_op'

Start in foreground:

  cd "/Volumes/FKD1/OSCAR-THOR-ONE-FOLDER"
  bash "./START-OSCAR-COMFYUI-FOREGROUND.sh"

Keep that Terminal open, then open:

  http://127.0.0.1:8188

Test:

  cd "/Volumes/FKD1/OSCAR-THOR-ONE-FOLDER"
  bash "./TEST-OSCAR-IMAGE-RUNTIMES.sh"

Shared model folders still live in:

  /Volumes/FKD1/OSCAR-THOR-ONE-FOLDER/models
