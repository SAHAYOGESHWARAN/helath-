import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, API_key is assumed to be available from process.env.
export const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY as string });