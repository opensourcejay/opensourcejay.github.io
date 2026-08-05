# Build a Simple AI App with React and Vite
*July 11, 2026*
*Jay*

We are building a simple AI chatbot. A person types a message, the chatbot sends it to an AI model, and the model's reply appears in the conversation. The finished application keeps a visible message history, shows loading and error states, and works with either a hosted model provider or a local model through Ollama.

This is a useful first full-stack AI project because the interface is familiar while the security boundary matters. The React browser app owns the conversation interface. A small Express server validates each message, protects credentials, and calls an OpenAI-compatible chat endpoint.

---

## What We Are Building

The chatbot has four user-facing behaviors:

1. The user writes a message and selects **Send**.
2. The message appears in the conversation immediately.
3. The interface shows that it is waiting while the server calls the model.
4. The assistant's reply appears in the conversation, or an understandable error is shown.

This first version sends one message at a time. It displays earlier messages in the browser, but it does not send that history back to the model. A later section explains how to add real conversational context.

## Understand the Architecture

The request path is:

```text
React browser app -> Express server -> model API
```

The server is essential when the model provider requires a secret API key. Anything placed in client JavaScript can be read by visitors. Vite variables beginning with `VITE_` are included in the browser bundle and must never contain secrets.

The example starts with non-streaming responses to keep the contract clear. You can add streaming after the basic request, validation, and error paths work.

## Create the Project

You need a current Node.js long-term support release and npm.

```bash
mkdir simple-ai-app
cd simple-ai-app
npm create vite@latest client -- --template react
mkdir server
cd server
npm init -y
npm install express cors dotenv
cd ../client
npm install
cd ..
```

The project will look like this:

```text
simple-ai-app/
  client/
    src/
      App.jsx
      index.css
  server/
    .env.example
    package.json
    server.js
  .gitignore
```

## Protect Environment Variables

Create a root `.gitignore`:

```gitignore
node_modules/
dist/
.env
```

Create `server/.env.example` with safe placeholders:

```dotenv
PORT=3001
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=your-model-name
AI_API_KEY=replace-with-a-server-side-key
```

Copy it to `server/.env` and replace the values for your provider. Do not commit that file.

For a local Ollama endpoint that implements the OpenAI-compatible chat route, use:

```dotenv
PORT=3001
AI_BASE_URL=http://localhost:11434/v1
AI_MODEL=gemma3:4b
AI_API_KEY=ollama
```

Ollama does not require that placeholder key for local authentication, but the server code uses one consistent header shape. Do not expose an unauthenticated Ollama endpoint to the public internet.

## Build the Express Proxy

Edit `server/package.json` and add the module type and scripts while keeping the fields created by `npm init`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  }
}
```

Create `server/server.js`:

```javascript
import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3001);
const baseUrl = process.env.AI_BASE_URL;
const model = process.env.AI_MODEL;
const apiKey = process.env.AI_API_KEY;

if (!baseUrl || !model || !apiKey) {
  throw new Error('AI_BASE_URL, AI_MODEL, and AI_API_KEY are required');
}

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '16kb' }));

app.post('/api/chat', async (request, response) => {
  const message = request.body?.message;

  if (typeof message !== 'string' || !message.trim()) {
    return response.status(400).json({ error: 'A message is required' });
  }

  if (message.length > 4000) {
    return response.status(400).json({ error: 'The message is too long' });
  }

  try {
    const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message.trim() }],
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!providerResponse.ok) {
      const details = await providerResponse.text();
      console.error('Model provider error', providerResponse.status, details);
      return response.status(502).json({ error: 'The model request failed' });
    }

    const data = await providerResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== 'string') {
      return response.status(502).json({ error: 'The model returned an invalid response' });
    }

    return response.json({ reply });
  } catch (error) {
    console.error('Chat request failed', error);
    return response.status(502).json({ error: 'The model is unavailable' });
  }
});

app.listen(port, () => {
  console.log(`AI proxy listening on http://localhost:${port}`);
});
```

The proxy validates type, length, provider status, and response shape. In production, add authentication, server-side rate limiting, request logging with sensitive-content controls, and an explicit provider allowlist.

## Build the React Client

Replace `client/src/App.jsx`:

```jsx
import { useState } from 'react';
import './index.css';

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || status === 'loading') return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', content: trimmedMessage },
    ]);
    setMessage('');
    setError('');
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The request failed');

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
      ]);
      setStatus('idle');
    } catch (requestError) {
      setError(requestError.message);
      setStatus('error');
    }
  }

  return (
    <main className="chat-shell">
      <header>
        <p className="eyebrow">Local or hosted model</p>
        <h1>Simple AI Chat</h1>
      </header>

      <section className="message-list" aria-label="Conversation">
        {messages.length === 0 && (
          <p className="empty-state">Ask a question to start the conversation.</p>
        )}
        {messages.map((item) => (
          <article key={item.id} className={`message ${item.role}`}>
            <strong>{item.role === 'user' ? 'You' : 'Assistant'}</strong>
            <p>{item.content}</p>
          </article>
        ))}
      </section>

      <form onSubmit={handleSubmit} className="chat-form">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength="4000"
          rows="3"
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </form>

      <p className="status" aria-live="polite">
        {status === 'loading' && 'Waiting for the model.'}
        {status === 'error' && error}
      </p>
    </main>
  );
}

export default App;
```

React escapes text content by default. Keep model output as text in the first version. If you later render Markdown or HTML, use a maintained parser and sanitizer and do not pass model output directly to `dangerouslySetInnerHTML`.

## Add Basic Styling

Replace `client/src/index.css`:

```css
:root {
  font-family: Georgia, 'Times New Roman', serif;
  color: #17201b;
  background: #eef2ed;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
textarea {
  font: inherit;
}

.chat-shell {
  width: min(760px, calc(100% - 2rem));
  min-height: 100vh;
  margin: 0 auto;
  padding: 3rem 0;
}

.eyebrow {
  color: #17633a;
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.message-list {
  display: grid;
  gap: 0.75rem;
  min-height: 320px;
  margin: 2rem 0 1rem;
}

.message {
  max-width: 82%;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd5cd;
  border-radius: 8px;
  background: #ffffff;
}

.message.user {
  margin-left: auto;
  background: #dff3e6;
}

.message p {
  margin: 0.25rem 0 0;
  white-space: pre-wrap;
}

.empty-state,
.status {
  color: #5f6b63;
}

.chat-form {
  display: grid;
  gap: 0.5rem;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 0.75rem;
  border: 1px solid #98a49c;
  border-radius: 6px;
}

textarea:focus-visible,
button:focus-visible {
  outline: 3px solid #42a66c;
  outline-offset: 2px;
}

button {
  justify-self: end;
  min-height: 44px;
  padding: 0.65rem 1.25rem;
  border: 0;
  border-radius: 6px;
  background: #17633a;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}
```

## Run the Application

Open one terminal for the server:

```bash
cd simple-ai-app/server
npm run dev
```

Open another for the client:

```bash
cd simple-ai-app/client
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. If Vite selects another port, update the server's CORS origin.

Test the production client build:

```bash
cd simple-ai-app/client
npm run build
```

## Preserve Conversation Context

The current server sends only the latest message. To support a conversation, let the client send a bounded array of messages and validate every role and content field on the server. Limit the number and total size of messages before forwarding them.

Do not trust a client-supplied system message. Define system instructions on the server. For authenticated applications, associate conversation records with the authenticated user and apply a retention policy.

## Add Streaming Later

Streaming requires both layers to change. The server must request a streaming response from the provider and forward chunks without buffering the entire result. The client must read `response.body` with a `ReadableStream` reader, decode chunks, and update the current assistant message incrementally.

Streaming improves responsiveness, but it adds cancellation, partial-error, proxy-buffering, and moderation concerns. Get the non-streaming contract reliable first.

## Prepare for Deployment

The Vite build produces static client files, but the Express proxy requires a server runtime. GitHub Pages can host the client but cannot run the proxy. Deploy the server to a platform that supports Node.js and configure the client to call that HTTPS origin.

For production:

- Restrict CORS to the deployed client origin.
- Store keys in the hosting platform's secret manager.
- Authenticate users before allowing expensive requests.
- Apply server-side rate and spending limits.
- Set request, response, and execution time limits.
- Avoid logging prompts unless users understand the retention policy.
- Monitor provider errors without returning sensitive details to the browser.

The important lesson is the boundary. React owns the interface. Express owns validation and credentials. The model provider owns inference. Keeping those responsibilities separate makes the application easier to secure and replace.

## Sources

- [React Documentation](https://react.dev/)
- [Vite: Getting Started](https://vite.dev/guide/)
- [Express Documentation](https://expressjs.com/)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
- [Ollama OpenAI Compatibility](https://docs.ollama.com/openai)
- [OpenAI API: Production Best Practices](https://platform.openai.com/docs/guides/production-best-practices)