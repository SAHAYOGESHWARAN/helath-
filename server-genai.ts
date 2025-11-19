import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT: number = parseInt(process.env.GENAI_PORT || '4000', 10);

async function extractTextFromResponse(resp: unknown): Promise<string> {
  if (!resp) return '';
  if (typeof resp === 'string') return resp;
  const response = resp as any;
  if (response.text) return response.text();
  if (response.output && Array.isArray(response.output) && response.output[0]) {
    const o = response.output[0];
    if (o.content && Array.isArray(o.content) && o.content[0] && o.content[0].text) return o.content[0].text;
  }
  if (response.outputs && Array.isArray(response.outputs) && response.outputs[0]) {
    const o = response.outputs[0];
    if (o.content && Array.isArray(o.content) && o.content[0] && o.content[0].text) return o.content[0].text;
  }
  return JSON.stringify(resp);
}

async function main(): Promise<void> {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  // Delay creating the GenAI client until it's first needed to keep startup fast.
  let client: GoogleGenerativeAI | null = null;

  app.post('/api/genai', async (req: express.Request, res: express.Response) => {
    const { model, history, prompt, systemInstruction } = req.body || {};
    // Dev-only: require an Authorization header (Bearer <token>) so the endpoint isn't fully public in local dev
    const auth = req.get('authorization');
    if (!auth) {
      res.status(401).json({ error: 'Unauthorized: missing Authorization header' });
      return;
    }
    // Lazy-initialize the GenAI client so the server can start fast in dev.
    if (!client) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'API key not configured' });
        return;
      }
      try {
        client = new GoogleGenerativeAI(apiKey);
        console.log('GenAI client initialized on demand');
      } catch (err) {
        console.error('Failed to initialize GenAI client:', err);
        res.status(500).json({ error: 'GenAI client initialization failed' });
        return;
      }
    }

    try {
      const genModel = client.getGenerativeModel({ model: model || 'gemini-2.5-flash', systemInstruction });
      const contents = [...(history || []), { role: 'user', parts: [{ text: prompt || '' }] }];
      const response = await genModel.generateContent({ contents });
      const text = await extractTextFromResponse(response);
      res.json({ text });
    } catch (err) {
      console.error('GenAI error:', err);
      res.status(500).json({ error: (err instanceof Error ? err.message : 'Generation error') });
    }
  });

  // Lightweight mock endpoint that can be used when the real GenAI client isn't available
  app.post('/api/genai-mock', (req: express.Request, res: express.Response) => {
    const { prompt } = req.body || {};
    const text = prompt ? `(mock reply) ${prompt.split('').reverse().join('').slice(0, 200)}` : '(mock reply) Hello!';
    res.json({ text });
  });

  // Keep the process alive and log unhandled errors for easier debugging in dev
  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught exception in GenAI server:', err);
    // don't exit in dev
  });

  process.on('unhandledRejection', (reason: unknown, p: Promise<unknown>) => {
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
