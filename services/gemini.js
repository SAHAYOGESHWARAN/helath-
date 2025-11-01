"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAI = void 0;
var genai_1 = require("@google/genai");
// Per coding guidelines, API_key is assumed to be available from process.env.
exports.genAI = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
