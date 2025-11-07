/* eslint-env node */
/* global process, console, require */
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

  let client;
  try {
    client = await createClient();
    console.log('GenAI client initialized');
  } catch (err) {
    console.error('Failed to initialize GenAI client:', err);
  }

  app.post('/api/genai', async (req, res) => {
    const { model, history, prompt, systemInstruction } = req.body || {};
    if (!client) {
      return res.status(500).json({ error: 'GenAI client not initialized on server' });
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

  app.listen(PORT, () => {
    console.log(`GenAI proxy server listening on port ${PORT}`);
  });
}

main().catch(err => {
  console.error('Fatal error starting GenAI server', err);
  process.exit(1);
});
