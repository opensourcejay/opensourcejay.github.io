# How AI Agents Actually Work (and How to Build One in Python)
*January 20, 2026*
*Jay*

Everyone is talking about AI agents. But most explanations stop at the buzzwords. What does an agent actually do under the hood? How does it decide what to do next? And what does it take to build one yourself?

This post breaks down the core mechanics of how agents work, then walks through a simple Python implementation so you can see it in action.

---

## What Makes Something an "Agent"?

At its core, an AI agent is a system that takes a goal, breaks it into steps, and executes those steps by calling tools or generating responses. The key difference between a chatbot and an agent is the **loop**.

A chatbot takes a prompt and returns a response. An agent takes a goal and keeps working until the goal is met.

Here is the basic flow:

1. **Receive a goal** from the user.
2. **Plan** the next action based on context.
3. **Execute** that action (call a tool, query an API, generate text).
4. **Observe** the result.
5. **Repeat** steps 2 through 4 until the goal is complete.

This loop is sometimes called the **ReAct pattern** (Reason + Act), introduced in the paper [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629). The agent reasons about what to do, acts on it, observes the outcome, and reasons again.

---

## The Building Blocks

Every agent has a few core components:

### 1. The Language Model (Brain)
This is the reasoning engine. It takes the current context, including the goal, past actions, and observations, and decides what to do next. Models like GPT-4o, Claude, or open-source options like Llama work here.

### 2. Tools (Hands)
Tools are functions the agent can call. A tool might search the web, read a file, query a database, or send an email. The model chooses which tool to use and what arguments to pass.

### 3. Memory (Context Window)
The agent keeps track of what it has done so far. Each action and observation gets appended to the conversation history so the model can make informed decisions on the next step.

### 4. The Loop (Backbone)
The orchestration layer that ties it all together. It sends the current state to the model, parses the response, executes any tool calls, and feeds results back in.

---

## A Simple Agent in Python

Let's build a minimal agent from scratch. No frameworks, just Python and the [OpenAI API](https://platform.openai.com/docs/guides/function-calling). This agent can answer questions by searching a knowledge base and doing math.

### Setting Up Tools

First, define some simple tools the agent can use:

```python
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# Define the tools the agent can use
def search_knowledge_base(query):
    """Search a simple knowledge base."""
    knowledge = {
        "python": "Python is a high-level programming language created by Guido van Rossum in 1991.",
        "agents": "AI agents are systems that autonomously take actions to achieve goals.",
        "react": "The ReAct pattern combines reasoning and acting in a loop.",
    }
    for key, value in knowledge.items():
        if key in query.lower():
            return value
    return "No relevant information found."

def calculate(expression):
    """Evaluate a math expression safely."""
    allowed = set("0123456789+-*/.(). ")
    if all(c in allowed for c in expression):
        return str(eval(expression))
    return "Invalid expression."
```

### Defining the Tool Schema

The model needs to know what tools are available and how to call them:

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_knowledge_base",
            "description": "Search for information on a topic.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query."}
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a math expression.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "The math expression to evaluate."}
                },
                "required": ["expression"],
            },
        },
    },
]

tool_map = {
    "search_knowledge_base": search_knowledge_base,
    "calculate": calculate,
}
```

### The Agent Loop

This is the core of the agent. It sends messages to the model, checks if the model wants to call a tool, executes the tool, and feeds the result back:

```python
def run_agent(goal, max_steps=5):
    """Run the agent loop until the goal is met."""
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use the available tools to answer the user's question. When you have enough information, provide a final answer."},
        {"role": "user", "content": goal},
    ]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
        )

        message = response.choices[0].message

        # If the model wants to call tools, execute them
        if message.tool_calls:
            messages.append(message)
            for tool_call in message.tool_calls:
                name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                print(f"  [Step {step + 1}] Calling: {name}({args})")

                result = tool_map[name](**args)
                print(f"  [Step {step + 1}] Result: {result}")

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })
        else:
            # No tool calls means the agent is done
            print(f"\nAgent answer: {message.content}")
            return message.content

    print("Agent reached max steps without finishing.")
    return None
```

### Running It

```python
run_agent("What is Python and what is 42 * 17?")
```

The output looks something like this:

```
  [Step 1] Calling: search_knowledge_base({"query": "python"})
  [Step 1] Result: Python is a high-level programming language created by Guido van Rossum in 1991.
  [Step 1] Calling: calculate({"expression": "42 * 17"})
  [Step 1] Result: 714

Agent answer: Python is a high-level programming language created by Guido van Rossum in 1991. And 42 * 17 = 714.
```

The model decided it needed two tools, called them both, observed the results, and composed a final answer. That is the agent loop in action.

---

## What Frameworks Add on Top

Frameworks like [LangChain](https://www.langchain.com/), [AutoGen](https://github.com/microsoft/autogen), and [Semantic Kernel](https://github.com/microsoft/semantic-kernel) build on this same pattern. They add:

- **Multi-agent orchestration** so multiple agents can collaborate
- **Persistent memory** across conversations
- **Streaming** for real-time output
- **Guardrails** for safety and validation
- **Pre-built tool libraries** for web search, file I/O, and APIs

But under the hood, every framework runs some version of this same loop: reason, act, observe, repeat.

---

## Key Takeaways

- An AI agent is just a loop: **plan, act, observe, repeat**.
- Tools give the agent the ability to interact with the real world.
- The language model is the decision-maker that picks which tool to use and when to stop.
- You do not need a framework to build a basic agent. Python and an API key are enough.
- Frameworks become valuable when you need multi-agent coordination, memory, or production-grade reliability.

---

## Learn More

- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) (Original Paper)
- [AutoGen Documentation](https://microsoft.github.io/autogen/)
- [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
- [Semantic Kernel Documentation](https://learn.microsoft.com/en-us/semantic-kernel/overview/)

---

## What To Build Next

Once you have the basics down, try expanding your agent:

- Add a tool that reads files from disk or queries a database.
- Give it memory by persisting conversation history across runs.
- Add a second agent and have them collaborate on a task.
- Use structured outputs to make tool calls more reliable.
- Deploy it as an API endpoint using Flask or FastAPI.

The core pattern stays the same no matter how complex the system gets. Every agent you see in the wild, from Copilot to custom enterprise bots, is built on this foundation.
