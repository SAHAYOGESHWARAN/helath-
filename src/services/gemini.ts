import { GoogleGenAI } from "@google/genai";

// Provide a helper to create a client instance.
export async function getGenAIClient() {
  // Safely read env vars in both Node and browser environments.
  const nodeEnv = (typeof process !== 'undefined' && process && (process as any).env) ? (process as any).env : undefined;
  const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : undefined;
  const win = (typeof window !== 'undefined') ? (window as any) : undefined;

  const apiKey = nodeEnv?.API_KEY || nodeEnv?.VITE_API_KEY || metaEnv?.VITE_API_KEY || win?.VITE_API_KEY;

  if (!apiKey) {
      throw new Error("API Key not configured. Please check your environment variables.");
  }

  return new GoogleGenAI({ apiKey });
}