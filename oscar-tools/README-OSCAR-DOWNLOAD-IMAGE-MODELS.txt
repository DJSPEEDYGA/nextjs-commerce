OSCAR IMAGE MODEL DOWNLOADER
============================

This script downloads or copies image-generation models into Oscar's shared image-model store.

Included file:
- OSCAR-DOWNLOAD-IMAGE-MODELS.sh

What it can do:
- Download a single file from Hugging Face
- Download a repo/folder snapshot from Hugging Face
- Download a model file from a direct URL
- Copy an existing local model file/folder into Oscar
- Log everything into MODEL-INDEX.txt

Usage:
1) Put this file on the same drive as Oscar.
2) Run:
   bash ./OSCAR-DOWNLOAD-IMAGE-MODELS.sh /path/to/OSCAR-THOR-ONE-FOLDER

Or interactive:
   bash ./OSCAR-DOWNLOAD-IMAGE-MODELS.sh

Then choose where the model should go:
- checkpoints
- flux
- loras
- vae
- controlnet
- embeddings
- upscalers
- clip
- text_encoders
- diffusers
- etc.

Important:
- This script does NOT bypass gated downloads.
- If a Hugging Face repo is gated, log in first:
    huggingface-cli login
  or export:
    HF_TOKEN=your_token_here
- Some direct URLs from Civitai or other sites may require their own tokens/cookies.
