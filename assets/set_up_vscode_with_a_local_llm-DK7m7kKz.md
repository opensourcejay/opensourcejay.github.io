# Set Up VS Code with a Local LLM in Detail
*May 16, 2026*
*Jay*

A local language model can bring chat, code edits, and inline completion into VS Code without sending each prompt to a hosted model API. The setup still needs careful model selection, extension review, context controls, and performance tuning.

This guide uses [Ollama](https://ollama.com/) for local inference and the open-source [Continue](https://www.continue.dev/) extension for editor integration. It configures one model for chat and edits and a smaller model for fast autocomplete.

---

## Understand the Data Path

The basic local path is:

```text
VS Code -> Continue extension -> http://localhost:11434 -> Ollama -> local model
```

That removes a hosted inference provider from the normal request path. It does not mean every part of VS Code or every installed extension is offline. An extension can read workspace files within VS Code's permission model and may have its own telemetry or network features.

Review the extension publisher, source, privacy documentation, settings, and updates. Use VS Code Workspace Trust for unfamiliar repositories, and inspect the exact context attached to sensitive requests.

## Check Your Hardware

Model size affects memory use, speed, and output quality. Start with the smallest model that performs your actual tasks acceptably.

As a rough workflow:

1. Check available system memory and GPU support.
2. Choose a small code-capable model for autocomplete.
3. Choose a tool-capable instruct model for chat and edits.
4. Test latency on a representative repository.
5. Increase model size only when measured quality justifies it.

Quantization and context length also affect memory. A model that fits during a short terminal chat can fail when an editor sends a much larger context window.

Always review the model card and license. A downloadable model is not automatically unrestricted for commercial use.

## Install and Verify Ollama

Install Ollama from its official site, then confirm the command is available:

```bash
ollama --version
```

This example uses `qwen3:4b` for chat and edits, plus `qwen2.5-coder:1.5b` for autocomplete. Confirm both tags and capabilities in the current Ollama library before using them:

```bash
ollama pull qwen3:4b
ollama pull qwen2.5-coder:1.5b
ollama list
```

Test each model outside VS Code first:

```bash
ollama run qwen3:4b
```

Ask it to explain a small function, then type `/bye`. Repeat with the autocomplete model if needed.

Verify the local HTTP API:

```bash
curl http://localhost:11434/api/tags
```

You should receive JSON describing locally installed models. If this request fails, fix Ollama before debugging the editor extension.

Do not expose port `11434` to an untrusted network. A local Ollama endpoint commonly has no application-level authentication.

## Install Continue from the Verified Listing

In VS Code, open Extensions and search for **Continue**. Confirm that the listing identifier is `Continue.continue`, or follow the installation link from Continue's official documentation. Similar names and icons are not proof of publisher identity.

After installation:

1. Open the Continue sidebar.
2. Open the configuration selector above the chat input.
3. Hover over **Local Config** and select its gear icon.
4. Confirm that VS Code opens `~/.continue/config.yaml` on macOS or Linux, or `%USERPROFILE%\.continue\config.yaml` on Windows.

Continue reloads a valid configuration when you save it. Its format evolves, so use the current reference if fields differ from this article.

## Configure Separate Model Roles

Replace the generated local configuration with this minimal YAML:

```yaml
name: Local Ollama Development
version: 1.0.0
schema: v1

models:
  - name: Qwen 3 Local Chat
    provider: ollama
    model: qwen3:4b
    roles:
      - chat
      - edit
      - apply
    capabilities:
      - tool_use
    defaultCompletionOptions:
      contextLength: 8192
      maxTokens: 2048
      temperature: 0.2
      keepAlive: 1800
    requestOptions:
      timeout: 120000

  - name: Qwen 2.5 Coder Local Autocomplete
    provider: ollama
    model: qwen2.5-coder:1.5b
    roles:
      - autocomplete
    autocompleteOptions:
      maxPromptTokens: 1024
      debounceDelay: 350
      modelTimeout: 5000
      onlyMyCode: true
      useCache: true
      useImports: true
      useRecentlyEdited: true
      useRecentlyOpened: true
```

The role split is intentional. Chat and editing benefit from instruction following and a larger context. Autocomplete runs after short pauses while you type, so a small specialized model often feels better than a larger reasoning model.

Continue usually detects Ollama capabilities. This configuration states `tool_use` explicitly for the chat model. Remove it if the selected model does not support tool calling.

The `contextLength` value is a budget, not a quality target. If Ollama reports insufficient memory, reduce it to `4096` or `2048`, or select a smaller model. Do not raise it beyond what the model and runtime support.

The timeout fields use different units in Continue's current schema: request timeout is in milliseconds, and autocomplete model timeout is also documented in milliseconds. Recheck the reference when upgrading.

## Test Chat Before Agent Features

Open a small trusted repository and select **Qwen 3 Local Chat** in Continue. Begin with a question that needs only one visible file:

```text
Explain the error handling in the selected function. Cite the relevant function names and list any assumptions.
```

Select or attach only the necessary code. Verify that the answer refers to code that actually exists. Then test an edit on a disposable branch:

```text
Add input validation to this function. Preserve its public return type and show the proposed diff before applying it.
```

Review every diff. Local generation can still invent APIs, weaken checks, or modify more code than requested.

Agent mode can explore files and invoke approved tools. It has a larger blast radius than chat. Start with chat and edit, understand the confirmation interface, and enable agent workflows only in a repository where you can review and revert changes.

## Add Project Rules Instead of Repeating Context

For stable repository guidance, create a Markdown file under `.continue/rules/`. For example, `.continue/rules/project.md`:

```markdown
---
name: Project conventions
---

# Project Conventions

- Source code is under `src/`.
- Use the existing package manager and lockfile.
- Run `npm test` before proposing completion.
- Never read or modify `.env` files.
- Ask before adding a dependency.
```

Rules help the model understand project structure and expectations, but they are not access controls. Enforce real restrictions through operating-system permissions, container boundaries, tool configuration, repository review, and VS Code trust settings.

Continue's older `@Codebase` context provider is deprecated. Current Agent mode can explore an open codebase with built-in file and search tools. Attach files explicitly in chat when you want tighter control.

## Keep Secrets and Generated Files Out of Context

Do not assume that "local model" means "all files are appropriate context." Keep secrets out of source files, commit a restrictive `.gitignore`, and use the extension's current settings to disable autocomplete for sensitive patterns such as `.env`, key files, generated output, and large vendor directories.

Continue currently exposes **Disable autocomplete in files** in its VS Code settings. Configure patterns that match your repositories. Also review files manually before attaching them to chat or granting an agent permission to explore.

Avoid adding terminal output by default. Logs often contain environment variables, internal URLs, customer data, or long irrelevant traces. Include only the smallest failing section after redaction.

## Test Inline Completion

Confirm that **Enable Tab Autocomplete** is active in Continue and that VS Code's `editor.inlineSuggest.enabled` setting is enabled. Open a source file and type a function signature with a short comment describing its behavior.

Wait for ghost text, press `Tab` to accept it, or press `Escape` to reject it. Test several real patterns:

- Finish a small pure function.
- Continue a nearby test pattern.
- Complete an error-handling branch.
- Suggest code in a file type you intend to exclude.

If another extension also provides inline completion, disable one provider during testing. Competing suggestions can make failures look random.

## Troubleshoot from the Bottom Up

Use this order when something fails:

1. Run `ollama list` and confirm the configured tags match exactly.
2. Run the model with `ollama run`.
3. Request `http://localhost:11434/api/tags`.
4. Validate `config.yaml` indentation and Continue's reported errors.
5. Confirm the selected Continue model and role.
6. Check VS Code's Output panel and Continue logs.
7. Open **Developer: Toggle Developer Tools** and inspect the Console.

For slow responses, watch memory use while sending the same prompt. Reduce context length, choose a smaller quantization or model, close competing workloads, and keep tool results concise. Autocomplete should use a low-latency model without extra reasoning output.

For weak answers, improve the input before increasing model size. Attach the owning file, relevant type definition, failing test, and exact error. Remove unrelated directories and generated code. Compare models using the same small evaluation set rather than one demonstration.

## Verify the Setup Is Actually Local

Disconnect from the network only after the extension, models, and dependencies are installed. Restart VS Code, send a chat request, and trigger autocomplete. If both still work, inference does not require a hosted API for that configuration.

For stricter assurance, inspect active network connections with operating-system tools and review Continue's data settings. Do not configure shared model blocks, remote MCP servers, hosted documentation search, or data destinations if the requirement is a fully local request path.

Local inference still receives code through an extension running inside your editor. Treat extension updates and model files as software supply-chain changes that require review.

## Remove or Replace the Setup

To stop local autocomplete, use Continue's status-bar control or disable it in settings. To remove a model from disk:

```bash
ollama rm qwen2.5-coder:1.5b
ollama rm qwen3:4b
```

Uninstall the extension in VS Code if it is no longer needed, then inspect `~/.continue` or `%USERPROFILE%\.continue` before deleting local configuration and logs.

If you want a self-hosted completion server for a team rather than a per-laptop Ollama setup, evaluate [Tabby](https://tabby.tabbyml.com/). It is a separate architecture with its own server, authentication, deployment, and maintenance requirements.

## Sources

- [Ollama Documentation](https://docs.ollama.com/)
- [Ollama API Reference](https://docs.ollama.com/api/introduction)
- [Ollama Model Library](https://ollama.com/search)
- [Continue: Install the IDE Extension](https://docs.continue.dev/ide-extensions/install)
- [Continue: Understanding Configs](https://docs.continue.dev/guides/understanding-configs)
- [Continue: Ollama Provider](https://docs.continue.dev/customize/model-providers/top-level/ollama)
- [Continue config.yaml Reference](https://docs.continue.dev/reference)
- [Continue: Autocomplete Setup](https://docs.continue.dev/customize/deep-dives/autocomplete)
- [Continue: Codebase and Documentation Awareness](https://docs.continue.dev/guides/codebase-documentation-awareness)
- [Visual Studio Code Workspace Trust](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust)
- [Visual Studio Code Extension Runtime Security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)
- [Tabby Documentation](https://tabby.tabbyml.com/docs/)
- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards)