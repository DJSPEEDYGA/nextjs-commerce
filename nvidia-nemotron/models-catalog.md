# NVIDIA Nemotron Model Family — Full Catalog

> Complete listing of NVIDIA Nemotron models available on HuggingFace

## Nemotron-3 Nano Series (Compact / Edge)

| Model | Parameters | Active | Precision | Downloads | HuggingFace |
|-------|-----------|--------|-----------|-----------|-------------|
| **Nemotron-3-Nano-30B-A3B-BF16** | 32B | 3B (MoE) | BF16 | 928k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16) |
| **Nemotron-3-Nano-30B-A3B-FP8** | 32B | 3B (MoE) | FP8 | 1.52M | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-FP8) |
| **Nemotron-3-Nano-4B-BF16** | 4B | 4B | BF16 | 1.53k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16) |
| **Nemotron-3-Nano-4B-GGUF** | 4B | 4B | GGUF | 605 | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-GGUF) |

## Nemotron-3 Super Series (High Performance)

| Model | Parameters | Active | Precision | Downloads | HuggingFace |
|-------|-----------|--------|-----------|-----------|-------------|
| **Nemotron-3-Super-120B-A12B-BF16** | 124B | 12B (MoE) | BF16 | 36.8k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) |
| **Nemotron-3-Super-120B-A12B-FP8** | 124B | 12B (MoE) | FP8 | 210k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8) |
| **Nemotron-3-Super-120B-A12B-NVFP4** | 67B | 12B (MoE) | NVFP4 | 295k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4) |
| **Nemotron-3-Super-120B-A12B-Base-BF16** | 124B | 12B (MoE) | BF16 | 5.39k | [Link](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-Base-BF16) |

## Community GGUF Quantizations

| Model | Parameters | Source | Downloads | HuggingFace |
|-------|-----------|--------|-----------|-------------|
| **unsloth/Nemotron-3-Super-120B-A12B-GGUF** | 121B | unsloth | 45.7k | [Link](https://huggingface.co/unsloth/NVIDIA-Nemotron-3-Super-120B-A12B-GGUF) |
| **unsloth/Nemotron-3-Super-120B-A12B-NVFP4** | 67B | unsloth | 42.1k | [Link](https://huggingface.co/unsloth/NVIDIA-Nemotron-3-Super-120B-A12B-NVFP4) |
| **unsloth/Nemotron-3-Nano-4B-GGUF** | 4B | unsloth | 2.9k | [Link](https://huggingface.co/unsloth/NVIDIA-Nemotron-3-Nano-4B-GGUF) |

## Other NVIDIA Models

| Model | Task | Downloads | HuggingFace |
|-------|------|-----------|-------------|
| **Qwen3-Nemotron-235B-A22B-GenRM-2603** | Text Generation | 527 | [Link](https://huggingface.co/nvidia/Qwen3-Nemotron-235B-A22B-GenRM-2603) |
| **personaplex-7b-v1** | Audio-to-Audio | 405k | [Link](https://huggingface.co/nvidia/personaplex-7b-v1) |
| **NVILA-8B-HD-Video** | Video Understanding | 64 | [Link](https://huggingface.co/nvidia/NVILA-8B-HD-Video) |
| **parakeet-tdt-0.6b-v3** | Speech Recognition | 209k | [Link](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) |
| **nemotron-speech-streaming-en-0.6b** | Speech Recognition | 37.4k | [Link](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b) |

---

## Quick Download Commands

```bash
# Nemotron-3-Nano (recommended for this project)
hf download nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16

# Nemotron-3-Nano 4B (smaller, faster)
hf download nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16

# Nemotron-3-Super (high performance)
hf download nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16

# GGUF for local inference (llama.cpp / Ollama / LM Studio)
hf download unsloth/NVIDIA-Nemotron-3-Super-120B-A12B-GGUF
hf download nvidia/NVIDIA-Nemotron-3-Nano-4B-GGUF
```