/* eslint-env node */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.GENAI_PORT;

async function createClient() {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const apiKey = process.env.VITE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API key environment variable not set');
  }
  return new GoogleGenerativeAI(apiKey);
}

async function main() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  let client = null;

  app.post('/api/genai', async (req, res) => {
    const { model, history, prompt, systemInstruction } = req.body || {};
    const auth = req.get('authorization');
    if (!auth) return res.status(401).json({ error: 'Unauthorized: missing Authorization header' });
    if (!client) {
      try {
        client = await createClient();
      } catch (err) {
        console.error('Failed to initialize GenAI client:', err);
        return res.status(500).json({ error: 'GenAI client initialization failed' });
      }
    }

    try {
      const generativeModel = client.getGenerativeModel({
        model: model || 'gemini-1.5-flash',
        systemInstruction,
      });
      const contents = [...(history || []), { role: 'user', parts: [{ text: prompt || '' }] }];
      const result = await generativeModel.generateContent({ contents });
      const response = result.response;
      const text = response.text();
      res.json({ text });
    } catch (err) {
      console.error('GenAI error:', err);
      res.status(500).json({ error: (err && err.message) || 'Generation error' });
    }
  });

  app.post('/api/genai-mock', (req, res) => {
    const { prompt } = req.body || {};
    const text = prompt ? `(mock reply) ${prompt.split('').reverse().join('').slice(0, 200)}` : '(mock reply) Hello!';
    res.json({ text });
  });

  app.post('/api/genai/login', (req, res) => {
    const { email, password } = req.body;
    // This is a mock login. In a real application, you'd validate against a database.
    if (email === 'john.doe@email.com' && password === 'Password123!') {
      const user = {
        id: 'pat1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        role: 'patient',
      };
      res.json({ user, token: `demo-jwt-${Date.now()}` });
    } else if (email === 'jane.smith@email.com' && password === 'Password123!') {
      const user = {
        id: 'pro1',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        role: 'provider',
      };
      res.json({ user, token: `demo-jwt-${Date.now()}` });
    } else if (email === 'admin@novopath.com' && password === 'password123') {
      const user = {
        id: 'adm1',
        name: 'Admin User',
        email: 'admin@novopath.com',
        role: 'admin',
      };
      res.json({ user, token: `demo-jwt-${Date.now()}` });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });




  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception in GenAI server:', err);
  });

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at Promise', p, 'reason:', reason);
  });

  app.post('/api/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(400).send({
        error: {
          message: error.message,
        },
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`GenAI proxy server listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Fatal error starting GenAI server', err);
  process.exit(1);
});
