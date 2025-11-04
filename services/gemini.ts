import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, API_KEY is assumed to be available from process.env.
// FIX: Use GoogleGenAI instead of GoogleGenerativeAI and pass apiKey as a named parameter.
export const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });