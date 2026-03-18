# NVIDIA Nemotron-3-Nano-30B-A3B (BF16)

> **NVIDIA Nemotron-3-Nano-30B-A3B** — A high-performance, compact language model from NVIDIA optimized for enterprise AI agent workloads.

## Model Details

| Property | Value |
|----------|-------|
| **Model** | NVIDIA-Nemotron-3-Nano-30B-A3B-BF16 |
| **Parameters** | 30B (3B active via MoE) |
| **Precision** | BF16 |
| **Source** | [HuggingFace](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16) |
| **License** | NVIDIA Open Model License |

---

## Installation & Download

### Prerequisites

```bash
# Install git-xet (Windows)
winget install git-xet

# Install git-xet (Linux)
curl -fsSL https://hf.co/docs/hub/git-xet | bash

# Install HuggingFace CLI (Windows PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://hf.co/cli/install.ps1 | iex"

# Install HuggingFace CLI (Linux/macOS)
pip install huggingface-hub[cli]
```

### Clone the Model Repository

```bash
# Full clone with all model weights
git clone https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16

# Clone without large files (just pointers) — useful for inspecting config
GIT_LFS_SKIP_SMUDGE=1 git clone https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16
```

### Download via HuggingFace CLI

```bash
# Download the full model
hf download nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16

# Download to a specific directory
hf download nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16 --local-dir ./models/nemotron-nano
```

---

## Usage with NeMo Agent Toolkit

The Nemotron-3-Nano model can be used as the LLM backend for NeMo Agent Toolkit workflows. Update your workflow config to use it:

```yaml
llms:
  nemotron_nano:
    _type: nim
    model_name: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16
    temperature: 0.0

workflow:
  _type: react_agent
  tool_names: [wikipedia_search]
  llm_name: nemotron_nano
  verbose: true
```

### With NVIDIA NIM (Cloud API)

```bash
export NVIDIA_API_KEY=<your_api_key>
nat run --config_file configs/nemotron-workflow.yml --input "Hello!"
```

### With Local Inference (vLLM / TensorRT-LLM)

```bash
# Serve locally with vLLM
python -m vllm.entrypoints.openai.api_server \
  --model nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16 \
  --port 8000

# Point NAT to local endpoint
export NVIDIA_BASE_URL=http://localhost:8000/v1
nat run --config_file configs/nemotron-workflow.yml --input "Hello!"
```

---

## Key Features

- **Mixture of Experts (MoE)** — 30B total parameters with only 3B active at inference, enabling fast and efficient generation
- **BF16 Precision** — Optimized for modern GPU hardware (A100, H100, RTX 4090)
- **Enterprise Ready** — Designed for production agent workloads with NVIDIA NIM
- **Compact Deployment** — Fits on a single GPU for local inference
- **Agent Optimized** — Fine-tuned for tool use, reasoning, and multi-step planning

---

## System Requirements

### Cloud (NVIDIA NIM)
- NVIDIA API key from [build.nvidia.com](https://build.nvidia.com)
- No local GPU required

### Local Inference
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **GPU** | NVIDIA RTX 3090 (24GB) | NVIDIA A100 (80GB) |
| **VRAM** | 24 GB | 40+ GB |
| **RAM** | 32 GB | 64 GB |
| **Storage** | 60 GB | 100 GB |
| **CUDA** | 12.0+ | 12.4+ |

---

## Links

- [HuggingFace Model Card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16)
- [NVIDIA NIM](https://build.nvidia.com)
- [NeMo Agent Toolkit](https://docs.nvidia.com/nemo/agent-toolkit/)
- [vLLM Documentation](https://docs.vllm.ai/)