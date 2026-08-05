# Open-Weight Models: How to Run AI Locally
*August 1, 2026*
*Jay*

You do not always need a hosted API to build with AI. Open-weight models let you download model weights and run inference on hardware you control. That can improve privacy, make offline development possible, and give you more control over cost and deployment.

This guide explains what open-weight means, how to choose a model that fits your machine, and how to run one locally with Ollama.

---

## Open-Weight Is Not the Same as Open Source

An **open-weight model** makes its trained parameters available for download. The license determines whether you can modify the model, use it commercially, redistribute it, or create derived models.

An **open source AI system** has a broader standard. The Open Source AI Definition considers the code, model parameters, and information needed to study and modify the system. A model can publish its weights without satisfying that definition.

Always read the license and model card before choosing a model. Publicly downloadable does not automatically mean unrestricted.

## Choose a Model That Fits

Model names often include a parameter count such as 3B, 8B, or 70B. More parameters usually require more memory and compute, but parameter count alone does not determine quality.

Quantization reduces the precision used to store model weights. A four-bit quantized model uses much less memory than a full-precision model, with some potential loss in quality. GGUF is a common format for quantized models used by llama.cpp and related runtimes.

Use these questions to narrow the choice:

- What task must the model perform?
- How much RAM or GPU memory is available?
- Does the license permit the intended use?
- Does the model card cover the languages and tasks you need?
- Can you accept slower responses in exchange for local control?

Start with a small model that fits comfortably. A model that runs reliably is more useful than a larger model that constantly exhausts memory.

## Install Ollama

[Ollama](https://ollama.com/) provides a straightforward way to download and run models on macOS, Windows, and Linux. Install it from the official site, then verify that the command is available:

```bash
ollama --version
```

Choose a model from the Ollama library and run it using the exact name shown there. For example:

```bash
ollama run gemma3:4b
```

Ollama downloads the model the first time. When the prompt appears, ask a question:

```text
Explain containers in three short bullet points.
```

Use `/bye` to leave the interactive session. List downloaded models with:

```bash
ollama list
```

Remove a model you no longer need with:

```bash
ollama rm gemma3:4b
```

Model names and available tags change, so confirm them in the official library instead of guessing.

## Call the Local API

Ollama exposes an HTTP API on your machine. Start the application or server, then send a request from another terminal:

```bash
curl http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma3:4b",
    "messages": [
      { "role": "user", "content": "What makes an API RESTful?" }
    ],
    "stream": false
  }'
```

The response is JSON. Your application can call this endpoint just like a hosted model API, but the prompt and generated response remain on the machine unless another component sends them elsewhere.

Do not expose port 11434 directly to the public internet. Put authentication, input limits, rate limiting, and network controls in front of any remotely accessible inference service.

## Pick the Right Runtime

Ollama is not the only option:

| Runtime | Best Fit |
|---|---|
| Ollama | Local development and a simple model API |
| llama.cpp | Fine-grained local inference and broad hardware support |
| vLLM | High-throughput serving on supported GPUs |

Ollama is a good starting point. llama.cpp provides lower-level control over model files and inference settings. vLLM is designed for serving many requests efficiently and is usually a better fit for production GPU infrastructure than for a laptop.

## Know the Tradeoffs

Local inference offers useful advantages:

- Prompts can remain inside your environment.
- Development can continue without an internet connection.
- You control the model version and update schedule.
- Repeated usage does not create per-request API charges.

It also creates responsibilities:

- You manage downloads, storage, updates, and capacity.
- Local hardware may respond more slowly than hosted infrastructure.
- Quantization can change model behavior.
- Model files and runtime dependencies introduce supply-chain risk.
- A local model can still produce incorrect or harmful output.

Download models from trusted publishers, review model cards and licenses, pin runtime versions for production, and evaluate the model using examples from your actual workload.

## A Practical Starting Point

Begin with one small model and one narrow task. Measure response time, memory use, and answer quality. Then compare it with a hosted model using the same test prompts.

Open-weight models are not automatically cheaper, safer, or better. Their real value is control. You can decide where inference runs, which version is deployed, and how the surrounding system handles data.

## Sources

- [Open Source Initiative: Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition)
- [Ollama Documentation](https://docs.ollama.com/)
- [Ollama API Reference](https://docs.ollama.com/api/introduction)
- [llama.cpp Repository](https://github.com/ggml-org/llama.cpp)
- [vLLM Documentation](https://docs.vllm.ai/)
- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards)