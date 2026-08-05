# AI Agent Patterns for Reliable Systems
*June 6, 2026*
*Jay*

A basic AI agent can choose a tool, inspect the result, and repeat. A reliable agent needs more structure. It must know what it is allowed to do, preserve the right state, recover from failures, and stop before cost or risk grows out of control.

This article builds on the basic agent loop and focuses on the engineering patterns that make an agent easier to operate in a real system.

---

## Make State Explicit

Do not hide the entire workflow inside a conversation transcript. Represent important state as structured data:

```python
state = {
    "goal": "Prepare a weekly support summary",
    "status": "running",
    "steps": [],
    "artifacts": [],
    "attempts": 0,
    "cost_usd": 0.0,
}
```

Structured state can be validated, stored, inspected, and resumed. It also lets deterministic application code decide whether the agent may continue.

## Separate Memory by Purpose

Agent memory is not one feature. It usually includes several layers:

- **Working state:** Information needed for the current step.
- **Conversation history:** Recent messages needed for continuity.
- **Durable records:** Approved facts, preferences, or completed artifacts stored beyond one run.
- **Retrieval memory:** Relevant documents selected from a larger collection.

Do not copy every previous message into every model request. Summarize old context, retrieve only relevant records, and set retention limits. Sensitive information should have an owner, purpose, expiration rule, and deletion path.

## Restrict Tools by Design

Give each agent the smallest useful set of tools. A research agent may read approved sources but should not send email. A deployment agent may inspect status but require approval before changing infrastructure.

Each tool should have:

- A precise name and description.
- A validated input schema.
- Authentication outside the model prompt.
- A timeout and output-size limit.
- Clear read or write semantics.
- An audit record that excludes secrets.

Treat tool output as untrusted data. A web page or document can contain instructions designed to redirect the agent. Keep retrieved content separate from system instructions and enforce permissions in code, not in prose alone.

## Use a Bounded Control Loop

The application should own the loop and its limits:

```python
MAX_STEPS = 8

for step_number in range(MAX_STEPS):
    if budget_exceeded(state):
        state["status"] = "budget_exceeded"
        break

    decision = model.choose_next_action(state, available_tools)

    if decision.type == "finish":
        state["status"] = "completed"
        state["result"] = validate_result(decision.result)
        break

    if decision.type == "write" and not approved(decision):
        state["status"] = "waiting_for_approval"
        break

    observation = run_tool_with_timeout(decision)
    state["steps"].append(record(decision, observation))
else:
    state["status"] = "step_limit_reached"
```

This shape provides explicit exit conditions. It also gives the system a place to enforce budgets, approvals, schemas, and timeouts independently of the model.

## Choose an Orchestration Pattern

Adding more agents does not automatically improve a system. Use multiple agents only when separate roles create a meaningful boundary.

### Supervisor and Workers

A supervisor assigns bounded tasks to specialized workers and combines their results. This works well when tasks can be separated, such as research, analysis, and drafting.

The supervisor should not endlessly delegate. Limit handoffs and require every worker to return a structured result.

### Handoffs

One agent transfers control and context to another. This fits support or operations workflows where responsibility changes by category. Record who owns the task and why the handoff occurred.

### Parallel Review

Independent workers produce results that a deterministic rule or reviewer compares. This can increase coverage, but it also increases latency and cost. Do not mistake agreement between models for proof of correctness.

## Design Safe Write Operations

Retries are easy for reads and dangerous for writes. If an agent retries “create ticket” after a timeout, it may create two tickets.

Use idempotency keys for operations that support them. Before retrying, check whether the original request completed. Separate planning from execution so people can review high-impact actions before they run.

Approval gates are especially important for:

- Sending messages externally.
- Spending money.
- Deleting or publishing data.
- Changing access controls.
- Modifying production infrastructure.

## Observe the Workflow

Log model requests, tool selections, timing, token usage, state transitions, and errors using a shared trace identifier. Redact credentials and sensitive content before telemetry leaves the process.

Streaming text improves perceived responsiveness, but it is a user-interface behavior, not proof that the workflow is progressing correctly. Stream status events such as “searching documentation” or “waiting for approval” separately from generated answer text.

OpenTelemetry provides a vendor-neutral foundation for traces, metrics, and logs. Agent frameworks can add specialized events, but the underlying telemetry should still answer basic operational questions.

## Evaluate Outcomes, Not Style

Build a test set from real tasks. For each case, record:

- Whether the final result is correct.
- Whether the right tools were selected.
- Whether tool arguments were valid.
- Whether citations support the answer.
- How many steps, tokens, and retries were used.
- Whether the agent stopped safely under failure.

Run these evaluations when prompts, models, tools, or retrieval logic change. A fluent answer is not enough. The workflow must complete the right task within its boundaries.

## Start Smaller Than You Think

The most dependable agent is often a deterministic workflow with one or two model-powered decisions. Add memory, delegation, and autonomy only when evaluation shows that they improve the result.

Reliable agents are not defined by how long they can operate alone. They are defined by clear state, narrow permissions, measurable outcomes, and predictable failure behavior.

## Sources

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Microsoft Agent Framework Documentation](https://learn.microsoft.com/en-us/agent-framework/)
- [AutoGen Documentation](https://microsoft.github.io/autogen/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
