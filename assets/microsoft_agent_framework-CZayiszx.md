# Microsoft Agent Framework: The New Standard for Building AI Agents
*March 16, 2026*
*Jay*

If you have been building with Microsoft's AI agent tooling, things just shifted. Microsoft has released the [Microsoft Agent Framework](https://github.com/microsoft/agent-framework), a unified open source framework for building, orchestrating, and deploying AI agents in both Python and .NET. It consolidates the capabilities that were previously spread across Semantic Kernel and AutoGen into a single, comprehensive framework.

AutoGen is still being maintained for bug fixes and security patches, but the Agent Framework is where new development is happening. If you are starting a new project, this is where you should be looking.

---

## What Is It?

Microsoft Agent Framework is a multi-language framework that supports the full lifecycle of agent development. It covers everything from simple single-agent chat applications to complex multi-agent workflows with graph-based orchestration.

At its core, the framework provides:

- **Agent creation**: Build agents that can reason, use tools, and take actions autonomously.
- **Workflow orchestration**: Connect agents and deterministic functions using data flows with streaming, checkpointing, and human-in-the-loop capabilities.
- **Multi-provider support**: Work with OpenAI, Azure OpenAI, and other LLM providers through a consistent API.
- **Full Python and .NET support**: Both languages get first-class treatment with consistent APIs across implementations.

---

## Why This Exists

Microsoft had two strong but separate frameworks for building agents. Semantic Kernel was great for enterprise integrations and plugin-based architectures. AutoGen was built for multi-agent research and prototyping. Both had active communities, but using them together or choosing between them created friction.

The Agent Framework brings these strengths together. You get Semantic Kernel's production focus and AutoGen's multi-agent orchestration in one place, with a clean API and clear migration paths from both.

---

## Key Features

### Graph-Based Workflows

The framework includes a workflow engine that lets you connect agents and functions using data flows. This supports:

- **Streaming**: Process results as they arrive rather than waiting for completion.
- **Checkpointing**: Save and restore workflow state for long-running processes.
- **Human-in-the-loop**: Insert approval or review steps at any point in a workflow.
- **Time-travel**: Replay workflows from any checkpoint for debugging or auditing.

### DevUI

An interactive developer UI for building, testing, and debugging agent workflows. Instead of running agents blind and reading logs, you get a visual interface that shows what your agents are doing in real time.

### Middleware System

A flexible middleware pipeline for request and response processing. This lets you add cross-cutting concerns like logging, error handling, rate limiting, or custom transformations without modifying agent logic.

### Observability

Built-in [OpenTelemetry](https://opentelemetry.io/) integration provides distributed tracing, monitoring, and debugging out of the box. You can see every decision your agent makes and trace issues through multi-agent workflows.

---

## Getting Started

Installation is straightforward.

**Python:**
```bash
pip install agent-framework --pre
```

**C# / .NET:**
```bash
dotnet add package Microsoft.Agents.AI
```

Here is a minimal Python example that creates an agent using Azure OpenAI:

```python
import asyncio
from agent_framework.azure import AzureOpenAIResponsesClient
from azure.identity import AzureCliCredential

async def main():
    agent = AzureOpenAIResponsesClient(
        credential=AzureCliCredential(),
    ).as_agent(
        name="HaikuBot",
        instructions="You are an upbeat assistant that writes beautifully.",
    )

    print(await agent.run("Write a haiku about AI agents."))

asyncio.run(main())
```

The framework also works with the [Microsoft Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview), which handles hosting, scaling, identity, and enterprise security so you can focus on your agent logic.

---

## Agent Types on Foundry

If you deploy through Microsoft Foundry, you get three options:

- **Prompt agents**: No code required. Define your agent through instructions, model selection, and tools in the Foundry portal.
- **Workflow agents**: Orchestrate multi-step processes and agent-to-agent coordination using visual builders or YAML definitions.
- **Hosted agents**: Full code-based agents built with Agent Framework and deployed as containers. You own the orchestration logic while Foundry manages infrastructure.

---

## Migrating from Semantic Kernel or AutoGen

Microsoft provides dedicated migration guides for both:

- [Migration from Semantic Kernel](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel)
- [Migration from AutoGen](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen)

AutoGen will continue receiving bug fixes and security patches, but active development has moved to Agent Framework. If you are maintaining an existing AutoGen project, there is no emergency to migrate. But for new work, the Agent Framework is the path forward.

---

## What This Means for Developers

The agent space has been fragmented. Every provider has their own SDK, their own orchestration patterns, and their own deployment story. Microsoft consolidating their agent tooling into a single framework with clear APIs, multi-language support, and a managed deployment option through Foundry makes the decision simpler.

If you are building agents on Azure or with Microsoft's AI stack, this is now the starting point. One framework, two languages, and a clear path from local development to enterprise deployment.

---

## Learn More

- [Microsoft Agent Framework on GitHub](https://github.com/microsoft/agent-framework)
- [Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/)
- [Microsoft Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview)
- [Python Samples](https://github.com/microsoft/agent-framework/tree/main/python/samples)
- [.NET Samples](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples)
- [Community Discord](https://discord.gg/b5zjErwbQM)

---
