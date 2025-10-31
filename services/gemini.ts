import { GoogleGenAI } from "@google/genai";

// Per coding guidelines, API_KEY is assumed to be available from process.env.
// FIX: Changed deprecated GoogleGenerativeAI to GoogleGenAI
export const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });