import { GoogleGenerativeAI } from "@google/generative-ai";

// Per coding guidelines, API_KEY is assumed to be available from process.env.
export const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);