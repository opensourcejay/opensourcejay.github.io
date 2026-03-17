# Fireworks AI on Microsoft Foundry: What It Means for Open Model Inference
*March 17, 2026*
*Jay*

Open models are becoming the default choice for teams that want control over performance, cost, and customization. But running them at enterprise scale has always been the hard part. You can download a model easily enough. Getting it to perform reliably in production with governance, monitoring, and efficient inference is a different challenge entirely.

That challenge just got easier. Microsoft announced the public preview of [Fireworks AI on Microsoft Foundry](https://azure.microsoft.com/en-us/blog/introducing-fireworks-ai-on-microsoft-foundry-bringing-high-performance-low-latency-open-model-inference-to-azure/), bringing high-performance, low-latency open model inference directly into Azure.

---

## What Is Fireworks AI?

Fireworks AI specializes in fast, efficient inference for open models. Their engine already operates at serious scale, processing over 13 trillion tokens daily, sustaining roughly 180 thousand requests per second, and generating over 1,000 tokens per second on large models. Their performance is backed by leading results on [Artificial Analysis](https://artificialanalysis.ai/providers/fireworks) benchmarks.

In short, Fireworks is built to make open models run fast.

---

## What Is Microsoft Foundry?

[Microsoft Foundry](https://ai.azure.com/) is Azure's unified platform for building, deploying, and managing AI applications. It brings together model selection, agent development, evaluation, deployment, and governance into a single experience. Think of it as the control plane for your AI stack.

Rather than stitching together separate tools and infrastructure for each stage of the AI lifecycle, Foundry gives teams one place to handle it all.

---

## What This Integration Gives You

With Fireworks AI available through Microsoft Foundry, developers can access high-performance open model inference without managing their own serving stack. Here is what that looks like in practice:

- **Day-zero model access**: Start building immediately with state-of-the-art open models through a single Azure endpoint.
- **Optimized inference**: Requests are served by Fireworks' high-throughput inference engine with Azure-grade governance and security.
- **Bring your own weights (BYOW)**: Upload and register your own quantized or fine-tuned model weights without changing the serving infrastructure.
- **Flexible pricing**: Use serverless pay-per-token inference for experimentation with [Data Zone Standard](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types#data-zone-standard), or choose provisioned throughput units (PTUs) for predictable, steady-state workloads.
- **Enterprise trust**: Foundry provides unified governance, observability, and safety tooling so you can move to production with confidence.

---

## Available Models

At launch, the following open models are available through Fireworks AI on Foundry:

- **DeepSeek V3.2**
- **OpenAI gpt-oss-120b**
- **Kimi K2.5**
- **MiniMax M2.5** (new to Foundry with serverless support)

These cover a range of use cases from general-purpose reasoning to specialized tasks, and all benefit from Fireworks' optimized inference.

---

## Why This Matters

The gap between downloading an open model and running it reliably at scale has been one of the biggest friction points in enterprise AI adoption. Teams end up building custom serving infrastructure, managing separate tooling for deployment and monitoring, and dealing with fragmented workflows.

This integration closes that gap. You get the performance advantages of Fireworks AI combined with the operational foundation of Microsoft Foundry. That means:

- **Faster experimentation**: Try open models without setting up infrastructure.
- **Smoother path to production**: Go from evaluation to deployment in the same platform.
- **No vendor lock-in on models**: Choose the architecture that fits your workload and swap models as better options become available.
- **Operational consistency**: Governance, monitoring, and safety tooling are built into the platform rather than bolted on after the fact.

---

## Getting Started

Getting up and running is straightforward:

1. Go to [Microsoft Foundry](https://ai.azure.com/) and open the model catalog.
2. Select the Fireworks AI collection.
3. Choose the open model you want to use.
4. Review the model card for capabilities and benchmarks.
5. Select your deployment option (serverless or PTU) and deploy.

From there you have a running endpoint backed by Fireworks' inference engine with full Foundry governance.

---

## Learn More

- [Fireworks AI on Microsoft Foundry](https://aka.ms/fireworks-learn-more)
- [Upload custom weight models on Foundry](https://aka.ms/foundry-custom-models)
- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/)
- [Artificial Analysis — Fireworks benchmarks](https://artificialanalysis.ai/providers/fireworks)

---
