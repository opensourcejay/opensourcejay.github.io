# How to Save Tokens with Claude, ChatGPT, and GitHub Copilot
*August 5, 2026*
*Jay*

Long AI conversations often become slower, more expensive, and less reliable. The usual response is to shorten every prompt. That can help, but it can also remove the evidence the model needs and create more retries.

The better goal is to spend context deliberately. Send the instructions, files, and results that move the current task forward, then measure whether the task succeeds.

---

## First, Know What Is Being Metered

Claude, ChatGPT, and GitHub Copilot do not expose one universal token bill.

| Product path | Typical meter |
|---|---|
| OpenAI API | Input, cached input, and output tokens by model |
| Anthropic API | Input, cache writes or reads, and output tokens by model |
| ChatGPT consumer plans | Product usage limits that vary by plan, model, and feature |
| Claude consumer plans | Product usage limits that vary by plan, model, session, and feature |
| GitHub Copilot plans | Plan features plus premium requests for specified models or features |

Exact limits, prices, included allowances, and model multipliers change. Check the live pricing and plan pages before making a budget or purchasing decision.

Even when you do not receive an itemized token charge, excess context has a cost. It can consume a usage allowance, increase latency, crowd out important evidence, and make the model attend to stale instructions.

## Understand the Token Budget

Text is split into tokens before a model processes it. A token may be a word, part of a word, punctuation, or whitespace. Tokenization differs by model, so a character-count rule is only a rough estimate.

One request can include:

- System and product instructions.
- Your current prompt.
- Conversation history.
- Attached or retrieved files.
- Tool definitions and tool results.
- The model's generated output.

The context window limits how much of that material can be handled together. API billing commonly distinguishes input from output, and some providers discount eligible cached input. Product interfaces may manage or truncate context internally without showing a token ledger.

Use the provider's tokenizer or token-counting API when a precise API estimate matters.

## Start a New Conversation When the Task Changes

A long thread carries old goals, rejected patches, full logs, and superseded decisions into later requests. Start a fresh conversation when:

- You move to a different feature or repository.
- The current approach has been abandoned.
- The assistant repeatedly cites stale context.
- A compact handoff can describe the remaining work accurately.

Do not discard useful state blindly. Create a reviewed checkpoint first:

```text
Current goal:
Confirmed facts:
Decisions already made:
Files changed:
Validation completed:
Open risks:
Next action:
```

Paste that checkpoint into the new conversation with only the current files. This often costs less than replaying the entire history and makes conflicts easier to spot.

## Point to the Smallest Relevant Context

Do not attach a repository when the task is controlled by one function and one test. Do not paste a complete server log when ten lines show the failure.

For coding work, provide:

1. The exact behavior you expected.
2. The exact behavior you observed.
3. The owning file or symbol.
4. The nearest failing test or call site.
5. The focused validation command.

Add another file only when it resolves a real dependency, such as a type, schema, configuration value, or shared helper. Precise references save context and reduce unrelated edits.

Before:

```text
Here is my entire application and 4,000 lines of CI output. Fix the deployment.
```

After:

```text
The production build fails in the asset-upload step with the attached 18-line error.
Review deploy/upload.js and its test only. Identify the first failing call, state one hypothesis, and propose the smallest patch plus the focused test command.
```

The shorter prompt is better because it preserves discriminating evidence, not because short prompts are inherently superior.

## Stop Repeating Stable Instructions

If every request repeats the same language version, test command, code style, and security rules, move those stable facts to the product's supported instruction mechanism:

- Claude Projects can hold project instructions and knowledge for repeated work.
- ChatGPT Projects can group chats, files, and project instructions where available.
- GitHub Copilot supports repository and path-specific custom instruction files.
- Coding tools may support workspace rule files or checked-in agent guidance.

Keep instructions concise, current, and scoped. Remove contradictions and requirements that tools can infer from the repository. Stored instructions still consume context in many architectures, but they reduce user repetition and create one maintained source of truth.

Never place secrets in an instruction file. A prompt is not access control.

## Ask for a Plan Before Large Output

Large first attempts waste output tokens when the model misunderstands the task. For a migration, article, refactor, or architecture change, ask first for:

- The interpreted goal.
- Material assumptions.
- Proposed files or components.
- Risks and tradeoffs.
- A validation strategy.

Review that plan before requesting implementation. Keep the planning request short for small fixes because process can also become waste.

For code, request a patch or focused changed sections instead of full files when the tool does not already apply edits. For writing, request an outline before a long draft. For analysis, request the decision and evidence table before a narrative report.

## Control Output Explicitly

Output tokens are often priced differently from input tokens in APIs, and long answers consume time in every product. State what is useful:

```text
Return the root cause, the smallest patch, and one test command. Keep the explanation under 250 words.
```

For API calls, set an appropriate maximum output-token value and handle truncation. Do not set the cap so low that valid JSON, code, or a safety explanation gets cut off.

Avoid asking for the same information in several forms. A table, executive summary, full tutorial, FAQ, and social post in one request may be convenient, but generate only the artifact you need now.

## Summarize Tool Results Before Reusing Them

Agent workflows can accumulate large tool outputs. A test runner may repeat hundreds of passing tests around one failure, and a search tool may return the same file several times.

Keep:

- The command or query.
- Exit status.
- The first actionable error.
- Relevant stack frames or file references.
- A short record of what passed.

Discard progress animations, repeated warnings, duplicate matches, generated files, and unrelated success logs. Store full raw output outside the model context when auditability requires it.

Do not let a model summarize evidence and then delete the only copy. Summaries can omit a crucial qualifier. Keep raw artifacts available for verification while sending the compact representation to later model calls.

## Retrieve Fewer, Better Passages

In RAG systems, every retrieved chunk adds input tokens. Tune retrieval with representative questions rather than choosing a large `top_k` value by habit.

Measure:

- Whether the correct passage was retrieved.
- How many irrelevant passages were included.
- Whether reranking improves the first few results.
- Whether neighboring chunks add necessary context.
- Whether source metadata and authorization filters remain intact.

Retrieving fewer passages can save tokens, but missing the answer causes hallucinations or retries. Optimize for supported answers per request, not the smallest prompt.

## Reuse Stable Prefixes Through Caching

OpenAI and Anthropic offer API mechanisms that can reduce the price or latency of eligible repeated prompt content. The products and rules differ.

Good cache candidates include a stable system instruction, a long reference document used across many requests, or a fixed tool schema. Place stable content consistently and keep request-specific material separate so small changes do not invalidate the reusable prefix.

Check each provider's current minimum size, lifetime, model eligibility, write and read pricing, and cache-hit reporting. Caching does not reduce the model's logical context window, and it does not make sensitive content appropriate to send.

## Batch Work That Does Not Need an Immediate Answer

Both cost and throughput can improve when noninteractive API work uses a provider's batch processing feature. Good candidates include offline classification, evaluation runs, embedding jobs, and report generation that can wait.

Batch APIs have different request formats, completion windows, model support, and failure handling. They are not a substitute for real-time chat. Record each input identifier, validate partial results, and retry only failed work rather than the entire batch.

## Choose the Smallest Model That Passes Your Evaluation

Do not use the largest available model for every task. Classification, extraction, autocomplete, summarization, and complex planning have different requirements.

Create a small evaluation set and compare candidate models on:

- Task success.
- Unsupported claims.
- Format validity.
- Latency.
- Input and output usage.
- Retry rate.
- Human correction time.

A cheaper first request is not a saving if it causes three retries and a manual rewrite. Route routine, well-specified work to a smaller evaluated model and reserve stronger models for tasks that need them.

## Product-Specific Habits

### Claude

Keep a Claude conversation focused on one objective and begin a new one after a clean checkpoint. In Projects, maintain concise project instructions and include only current knowledge files. Ask Claude to reference the exact source or file when the answer must be grounded.

For the Anthropic API, use the token-counting endpoint before unusually large requests. Evaluate prompt caching for stable, repeated prefixes, and inspect cache read and write usage rather than assuming a hit.

### ChatGPT and the OpenAI API

In ChatGPT, separate unrelated work into new chats or Projects where available. Upload only current source files and replace repeated full logs with a minimal reproduction. Product plan limits are not the same as API token charges.

For the OpenAI API, inspect usage fields, use model-specific pricing, cap output appropriately, and structure stable prefixes for cached-input eligibility. Use the Batch API for supported work that does not need a synchronous response.

### GitHub Copilot

Copilot subscriptions may include a monthly allowance of premium requests, with the number consumed depending on the current plan, model, and feature. Many standard interactions may not be represented as a raw per-token charge. Review the live plan and premium-request documentation.

Give Copilot the owning file, selected symbol, failing test, and error instead of asking an agent to scan everything. Use repository and path-specific custom instructions for stable conventions. Keep agent tasks bounded, review requested tool permissions, and end or restart a session when its objective changes.

Using a lower premium-request multiplier can preserve allowance, but choose models by evaluated task success. A failed cheap request followed by an expensive retry consumes more time and may consume more allowance.

## Use a Token-Budget Worksheet

Before optimizing an API workflow, collect real measurements:

| Field | Baseline | Candidate |
|---|---:|---:|
| Requests per task | | |
| Input tokens per request | | |
| Cached input tokens | | |
| Output tokens per request | | |
| Successful tasks | | |
| Retries | | |
| Median latency | | |
| Human correction minutes | | |
| Provider cost | | |

Calculate the metric that reflects value:

$$
\text{Cost per successful task} = \frac{\text{Total provider cost} + \text{estimated review cost}}{\text{Successful tasks}}
$$

Also track p95 latency and failure rate. A change that lowers average tokens but creates occasional context failures may be unacceptable in production.

## Avoid False Savings

Token reduction is harmful when it removes requirements, evidence, examples, safety policy, source metadata, or the test that distinguishes a real fix from a plausible guess.

Watch for these failure patterns:

- Repeated clarification because the first prompt lacked a goal.
- Hallucinated APIs because relevant documentation was removed.
- Incorrect edits because type definitions were omitted.
- Lost source attribution after aggressive summarization.
- Policy violations because authorization rules were treated as optional context.
- More premium requests because a broad agent task was repeatedly restarted.

The objective is not minimum tokens. It is the smallest sufficient context and output for a successful, verifiable task.

## Sources

- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [OpenAI: Prompt Caching](https://platform.openai.com/docs/guides/prompt-caching)
- [OpenAI Batch API](https://platform.openai.com/docs/guides/batch)
- [OpenAI: What Are Tokens and How to Count Them?](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
- [Anthropic Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing)
- [Anthropic: Token Counting](https://docs.anthropic.com/en/docs/build-with-claude/token-counting)
- [Anthropic: Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Anthropic: Using Claude Projects](https://support.anthropic.com/en/articles/9517075-what-are-projects)
- [GitHub Copilot Plans](https://github.com/features/copilot/plans)
- [GitHub Copilot Premium Requests](https://docs.github.com/en/copilot/concepts/billing/copilot-requests)
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)