
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon, GlobeAltIcon } from '../../components/shared/Icons';
import SkeletonChatBubble from '../../components/shared/skeletons/SkeletonChatBubble';
import PageHeader from '../../components/shared/PageHeader';

interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  suggestions?: string[];
  groundingChunks?: GroundingChunk[];
}

const AIHealthGuide: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ai = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error("API_KEY environment variable not set.");
    }
  }, []);

  useEffect(() => {
    if (user && history.length === 0) {
      setHistory([
        {
          role: 'model',
          parts: [{ text: `Hello, ${user.name}! I am your AI Health Guide. You can describe your symptoms, and I can provide information and suggest next steps. How can I help you today?` }],
          suggestions: ["I have a headache and fever", "What are the symptoms of the flu?", "My knee has been hurting"],
        },
      ]);
    }
  }, [user, history.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading || !ai.current || !user) return;

    const userMessage: Message = { role: 'user', parts: [{ text }] };
    const historyForApi = [...history, userMessage];

    setHistory(prev => [...prev, userMessage, { role: 'model', parts: [{ text: '' }] }]);
    setPrompt('');
    setLoading(true);

    try {
      const activeMedications = user.medications?.filter(m => m.status === 'Active').map(m => m.name).join(', ') || 'none';
      const lifestyleInfo = user.lifestyle 
        ? `Diet: ${user.lifestyle.diet}, Exercise: ${user.lifestyle.exercise}, Smoking: ${user.lifestyle.smokingStatus}, Alcohol: ${user.lifestyle.alcoholConsumption}` 
        : 'not specified';

      const patientContext = `
        The current user is ${user.name}. 
        Their known medical conditions are: ${user.conditions?.map(c => c.name).join(', ') || 'none'}.
        Their known allergies are: ${user.allergies?.map(a => a.name).join(', ') || 'none'}.
        They are currently taking the following active medications: ${activeMedications}.
        Their known lifestyle factors are: ${lifestyleInfo}.
      `;
      
      const systemInstruction = `You are NovoPath Medical's AI Health Guide, powered by Gemini. Your primary function is to act as a friendly and informative symptom checker and health information resource for the patient.
      You have the following context about the patient: ${patientContext}
      
      Your operational guidelines are:
      - Your goal is to help the user understand their symptoms and provide general health information, taking their context into account. When relevant, you can make gentle connections to their health context, for example: "Given that you are taking [Medication], it's always good to check with your doctor before...".
      - When a user describes symptoms, ask clarifying questions to get more details (e.g., "How long have you had this symptom?", "Can you describe the pain?").
      - Based on the conversation, provide potential informational causes and suggest general wellness tips. You can tailor these tips to their lifestyle, for example: "Since you mentioned your diet is [Diet Type], you might consider...".
      - If the user's query is outside your scope or requires up-to-date information (e.g., "latest news on diabetes research"), use the Google Search tool and ALWAYS cite your sources.
      
      - **CRITICAL SAFETY INSTRUCTION**: You must NEVER provide a medical diagnosis, prescribe medication, or give direct medical advice. Your role is informational only.
      - At the end of EVERY single response, without exception, you MUST include a clear, bolded disclaimer on its own line: "**Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice. Please consult with a doctor for diagnosis and treatment.**"
      - Keep your tone empathetic, clear, and helpful.`;
      
      const contents = historyForApi.map(msg => ({ role: msg.role, parts: msg.parts }));
      
      const responseStream = await ai.current.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: [{googleSearch: {}}]
        }
      });

      let responseReceived = false;
      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          responseReceived = true;
          const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          
          setHistory(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'model') {
              const updatedMessage = {
                ...lastMessage,
                parts: [{ text: lastMessage.parts[0].text + chunkText }],
                groundingChunks: groundingChunks.length > 0 ? groundingChunks : lastMessage.groundingChunks,
              };
              return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
          });
        }
      }
      
      if (!responseReceived) {
        setHistory(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'model') {
                const updatedMessage = {
                    ...lastMessage,
                    parts: [{ text: "I'm not sure how to respond to that. Could you try rephrasing?\n\n**Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice. Please consult with a doctor for diagnosis and treatment.**" }],
                };
                return [...prev.slice(0, -1), updatedMessage];
            }
            return prev;
        });
      }

    } catch (error) {
      console.error("Error generating content:", error);
      setHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === 'model') {
            const updatedMessage = {
                ...lastMessage,
                parts: [{ text: "I'm sorry, I encountered an error. Please try again.\n\n**Disclaimer: I am an AI assistant and not a medical professional. This information is not a substitute for professional medical advice. Please consult with a doctor for diagnosis and treatment.**" }],
            };
            return [...prev.slice(0, -1), updatedMessage];
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(prompt);
  };

  return (
    <div>
      <PageHeader title="AI Health Guide" />
      <Card className="flex flex-col h-[calc(100vh-12rem)] p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, index) => (
            <div key={index}>
              <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' ? (
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-white" stroke="white" fill="white"/>
                  </div>
                ) : (
                  <img src={user?.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className={`max-w-xl p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.parts[0].text}</p>
                   {msg.role === 'model' && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-300">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                          <GlobeAltIcon className="w-4 h-4 mr-1.5" />
                          Sources
                        </h4>
                        <ol className="list-decimal list-inside space-y-1">
                          {msg.groundingChunks.map((chunk, i) => (
                            <li key={i} className="text-xs">
                              <a 
                                href={chunk.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline truncate block"
                                title={chunk.web.title}
                              >
                                {chunk.web.title}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                </div>
              </div>
              {msg.role === 'model' && msg.suggestions && (
                <div className="flex justify-start ml-11 mt-2 flex-wrap gap-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && history[history.length - 1]?.role === 'model' && history[history.length-1]?.parts[0].text === '' && (
            <SkeletonChatBubble />
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4 bg-white rounded-b-xl">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 px-4 py-2 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading}
              aria-label="Ask a health-related question"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIHealthGuide;
