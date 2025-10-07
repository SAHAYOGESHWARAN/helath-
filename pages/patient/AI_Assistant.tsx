
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon } from '../../components/shared/Icons';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  suggestions?: string[];
}

const AI_Assistant: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ai = useRef<GoogleGenAI | null>(null);

  // Initialize the GenAI instance
  useEffect(() => {
    if (process.env.API_KEY) {
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error("API_KEY environment variable not set.");
    }
  }, []);

  // Set initial greeting
  useEffect(() => {
    if (user && history.length === 0) {
      setHistory([
        {
          role: 'model',
          parts: [{ text: `Hello, ${user.name}! I am your AI Health Assistant, powered by Gemini. I can help you understand your appointments, lab results, and more. How can I help you today?` }],
          suggestions: ["Tell me about my next appointment", "Show my latest lab results", "How do I prepare for a check-up?"],
        },
      ]);
    }
  }, [user, history.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading || !ai.current) return;

    const userMessage: Message = { role: 'user', parts: [{ text }] };
    setHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const systemInstruction = `You are Tangerine Health's friendly and helpful AI assistant. Your goal is to assist patients with their health-related questions based on their provided data. Current user: ${user?.name}. Today's date: ${new Date().toLocaleDateString()}.
      
      Available (mock) patient data:
      - Upcoming Appointment: Annual Check-up with Dr. Jane Smith in 3 days.
      - Past Appointment: Dermatology Follow-up with Dr. David Chen, 2 weeks ago.
      - Latest Lab Results: Cholesterol Panel (Total: 180, LDL: 100, HDL: 60 - all normal), taken last week.
      
      IMPORTANT: Always include a disclaimer that you are an AI assistant and not a medical professional, and that the user should consult their doctor for medical advice. Do not make up medical information. Use the provided data to answer questions. Be concise and use markdown for formatting if helpful.`;
      
      const contents = [...history.map(msg => ({ role: msg.role, parts: msg.parts })), { role: 'user', parts: [{ text }] }];
      
      const responseStream = await ai.current.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      let currentResponseText = '';
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of responseStream) {
        currentResponseText += chunk.text;
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].parts[0].text = currentResponseText;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] }]);
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
      <div className="flex items-center mb-6">
        <SparklesIcon className="w-8 h-8 text-tangerine mr-3"/>
        <h1 className="text-3xl font-bold text-gray-800">AI Health Assistant</h1>
      </div>
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
          {loading && history[history.length - 1]?.role !== 'model' && (
            <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" stroke="white" fill="white"/>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4 bg-white rounded-b-xl">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about your health..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI Assistant is for informational purposes and does not provide medical advice.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AI_Assistant;
