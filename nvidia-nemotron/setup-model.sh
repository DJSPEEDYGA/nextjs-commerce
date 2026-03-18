#!/usr/bin/env bash
# NVIDIA Nemotron-3-Nano-30B-A3B — Model Setup Script
# Usage: bash setup-model.sh [--full|--pointer|--hf-cli]

set -euo pipefail

MODE="${1:---hf-cli}"
MODEL_ID="nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16"
MODEL_DIR="./models/nemotron-nano"

echo "============================================"
echo "  NVIDIA Nemotron-3-Nano-30B-A3B Setup"
echo "============================================"
echo ""

case "$MODE" in
    --full)
        echo "📦 Full clone with model weights..."
        echo "   This will download ~60GB of model files."
        echo ""
        
        # Check for git-xet
        if ! command -v git-xet &> /dev/null; then
            echo "⚠️  git-xet not found. Installing..."
            if command -v winget &> /dev/null; then
                winget install git-xet
            else
                echo "   Please install git-xet: https://hf.co/docs/hub/git-xet"
                exit 1
            fi
        fi
        
        git clone "https://huggingface.co/$MODEL_ID" "$MODEL_DIR"
        echo "✅ Model cloned to $MODEL_DIR"
        ;;
        
    --pointer)
        echo "📋 Clone without large files (pointers only)..."
        echo "   Useful for inspecting model config without downloading weights."
        echo ""
        GIT_LFS_SKIP_SMUDGE=1 git clone "https://huggingface.co/$MODEL_ID" "$MODEL_DIR"
        echo "✅ Model config cloned to $MODEL_DIR (no weights)"
        ;;
        
    --hf-cli)
        echo "📥 Download via HuggingFace CLI..."
        echo ""
        
        # Check for hf CLI
        if ! command -v hf &> /dev/null; then
            echo "⚠️  HuggingFace CLI not found. Installing..."
            if command -v pip &> /dev/null; then
                pip install huggingface-hub[cli]
            elif command -v pip3 &> /dev/null; then
                pip3 install huggingface-hub[cli]
            else
                echo "   Windows: powershell -ExecutionPolicy ByPass -c \"irm https://hf.co/cli/install.ps1 | iex\""
                echo "   Linux/macOS: pip install huggingface-hub[cli]"
                exit 1
            fi
        fi
        
        hf download "$MODEL_ID" --local-dir "$MODEL_DIR"
        echo "✅ Model downloaded to $MODEL_DIR"
        ;;
        
    *)
        echo "Usage: bash setup-model.sh [--full|--pointer|--hf-cli]"
        echo ""
        echo "Options:"
        echo "  --full     Full git clone with all model weights (~60GB)"
        echo "  --pointer  Clone without weights (config/metadata only)"
        echo "  --hf-cli   Download via HuggingFace CLI (recommended)"
        exit 0
        ;;
esac

echo ""
echo "============================================"
echo "  Next Steps"
echo "============================================"
echo ""
echo "1. Cloud API (no local GPU needed):"
echo "   export NVIDIA_API_KEY=<your_key>"
echo "   nat run --config_file configs/nemotron-workflow.yml --input 'Hello!'"
echo ""
echo "2. Local inference with vLLM:"
echo "   python -m vllm.entrypoints.openai.api_server \\"
echo "     --model $MODEL_DIR --port 8000"
echo ""
echo "3. Local inference with TensorRT-LLM:"
echo "   See: https://github.com/NVIDIA/TensorRT-LLM"
echo ""