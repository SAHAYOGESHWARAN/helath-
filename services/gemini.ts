import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, API_KEY is assumed to be available from process.env.
// FIX: Use GoogleGenAI instead of the deprecated GoogleGenerativeAI.
export const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });