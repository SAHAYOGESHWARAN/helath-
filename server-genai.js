/* eslint-env node */
const express = require('express');
const cors = require('cors');

const PORT = process.env.GENAI_PORT || 4000;

async function createClient() {
  const genaiModule = await import('@google/genai');
  const Candidate = genaiModule?.GoogleGenAI ?? genaiModule?.GoogleGenerativeAI ?? genaiModule?.Generative ?? genaiModule?.default ?? genaiModule;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || undefined;

  if (typeof Candidate === 'function') return new Candidate({ apiKey });
  if (Candidate && typeof Candidate.create === 'function') return await Candidate.create({ apiKey });
  throw new Error('Unsupported @google/genai module shape');
}

async function extractTextFromResponse(resp) {
  if (!resp) return '';
  if (typeof resp === 'string') return resp;
  if (resp.text) return resp.text;
  if (resp.output && Array.isArray(resp.output) && resp.output[0]) {
    const o = resp.output[0];
    if (o.content && Array.isArray(o.content) && o.content[0] && o.content[0].text) return o.content[0].text;
  }
  if (resp.outputs && Array.isArray(resp.outputs) && resp.outputs[0]) {
    const o = resp.outputs[0];
    if (o.content && Array.isArray(o.content) && o.content[0] && o.content[0].text) return o.content[0].text;
  }
  return JSON.stringify(resp);
}

async function main() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  // Delay creating the GenAI client until it's first needed to keep startup fast.
  let client = null;

  app.post('/api/genai', async (req, res) => {
    const { model, history, prompt, systemInstruction } = req.body || {};
    // Dev-only: require an Authorization header (Bearer <token>) so the endpoint isn't fully public in local dev
    const auth = req.get('authorization');
    if (!auth) return res.status(401).json({ error: 'Unauthorized: missing Authorization header' });
    // Lazy-initialize the GenAI client so the server can start fast in dev.
    if (!client) {
      try {
        client = await createClient();
        console.log('GenAI client initialized on demand');
      } catch (err) {
        console.error('Failed to initialize GenAI client:', err);
        return res.status(500).json({ error: 'GenAI client initialization failed' });
      }
    }

    try {
      const contents = [...(history || []), { role: 'user', parts: [{ text: prompt || '' }] }];
      const response = await client.models.generateContent({ model: model || 'gemini-2.5-flash', contents, config: { systemInstruction } });
      const text = await extractTextFromResponse(response);
      res.json({ text });
    } catch (err) {
      console.error('GenAI error:', err);
      res.status(500).json({ error: (err && err.message) || 'Generation error' });
    }
  });

  // Lightweight mock endpoint that can be used when the real GenAI client isn't available
  app.post('/api/genai-mock', (req, res) => {
    const { prompt } = req.body || {};
    const text = prompt ? `(mock reply) ${prompt.split('').reverse().join('').slice(0, 200)}` : '(mock reply) Hello!';
    res.json({ text });
  });

  // Keep the process alive and log unhandled errors for easier debugging in dev
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception in GenAI server:', err);
    // don't exit in dev
  });

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at Promise', p, 'reason:', reason);
    // don't exit in dev
  });

  app.listen(PORT, () => {
    console.log(`GenAI proxy server listening on port ${PORT}`);
  });
}

main().catch(err => {
  console.error('Fatal error starting GenAI server', err);
  process.exit(1);
});
