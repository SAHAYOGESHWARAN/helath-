// Provide a small helper that lazily loads the `@google/genai` package and
// returns a client instance. This avoids bundling issues and tolerates
// different shapes across package versions.
export async function getGenAIClient() {
	const genaiModule: any = await import('@google/genai');
	const Candidate = genaiModule?.GoogleGenAI ?? genaiModule?.GoogleGenerativeAI ?? genaiModule?.Generative ?? genaiModule?.default ?? genaiModule;

	// Safely read env vars in both Node and browser environments.
	const nodeEnv = (typeof process !== 'undefined' && process && (process as any).env) ? (process as any).env : undefined;
	const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : undefined;
	const win = (typeof window !== 'undefined') ? (window as any) : undefined;

	const apiKey = nodeEnv?.API_KEY || nodeEnv?.VITE_API_KEY || metaEnv?.VITE_API_KEY || win?.VITE_API_KEY;

	if (typeof Candidate === 'function') {
		return new Candidate({ apiKey });
	}

	if (Candidate && typeof Candidate.create === 'function') {
		return await Candidate.create({ apiKey });
	}

	throw new Error('Unsupported @google/genai module shape; cannot create client');
}