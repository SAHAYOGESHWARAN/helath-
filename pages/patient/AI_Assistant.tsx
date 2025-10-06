import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/shared/Card';
import Spinner from '../../components/shared/Spinner';
import { useAuth } from '../../hooks/useAuth';

// Mock data for the logged-in patient
const mockPatientData = {
  appointments: [
    {
      id: 1,
      doctor: 'Dr. Jane Smith',
      date: '2024-09-15',
      time: '10:30 AM',
      reason: 'Annual Check-up',
    },
  ],
  labResults: [
    {
      id: 'lab1',
      test: 'Cholesterol Panel',
      date: '2024-08-01',
      results: {
        'Total Cholesterol': '180 mg/dL',
        'HDL': '60 mg/dL',
        'LDL': '100 mg/dL',
      },
      status: 'Normal',
    },
  ],
};

interface Message {
  sender: 'user' | 'ai';
  text: string;
  suggestions?: string[];
}

const AI_Assistant: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set initial greeting after user is loaded
  useEffect(() => {
    if (user) {
      setMessages([
        {
          sender: 'ai',
          text: `Hello, ${user.name}! I am your AI Health Assistant. How can I help you today?`,
          suggestions: ['When is my next appointment?', 'Show me my latest lab results'],
        },
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const lowerCaseText = text.toLowerCase();
      let aiResponse: Message;

      if (lowerCaseText.includes('appointment')) {
        const nextAppt = mockPatientData.appointments[0];
        const appointmentSuggestions = [
          `What should I prepare for my ${nextAppt.reason.toLowerCase()}?`,
          `Can I reschedule my appointment with ${nextAppt.doctor}?`,
        ];
        aiResponse = {
          sender: 'ai',
          text: `Regarding your upcoming appointment, I see you're scheduled with ${nextAppt.doctor} on ${nextAppt.date} at ${nextAppt.time} for a ${nextAppt.reason}.`,
          suggestions: appointmentSuggestions,
        };
      } else if (lowerCaseText.includes('lab') || lowerCaseText.includes('result')) {
        const latestResult = mockPatientData.labResults[0];
        const resultsText = Object.entries(latestResult.results)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n');
        
        // Dynamically generate context-aware suggestions
        const dynamicSuggestions = [
          'Explain these results in simple terms',
          ...Object.keys(latestResult.results).map(testName => `What is a normal range for ${testName}?`)
        ];

        aiResponse = {
          sender: 'ai',
          text: `Here are your latest lab results from ${latestResult.date} for the ${latestResult.test}:\n\n${resultsText}\n\nThe overall status is marked as '${latestResult.status}'.\n\n*Disclaimer: I am an AI assistant and not a medical professional. Please consult your doctor to discuss these results.*`,
          suggestions: dynamicSuggestions,
        };
      } else {
        // Generic fallback response for mock environment
        aiResponse = {
          sender: 'ai',
          text: "That's a great question. While I'm not equipped to handle general queries in this mock environment, a fully integrated version could provide information on that. For now, please ask about appointments or lab results.\n\n*Remember, always consult a healthcare professional for medical advice.*",
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(prompt);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Health Assistant</h1>
      <Card className="flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index}>
              <div className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' ? (
                  <div className="w-8 h-8 rounded-full bg-tangerine flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">AI</div>
                ) : (
                  <img src={user?.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                )}
                <div className={`max-w-xl p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                </div>
              </div>
              {msg.sender === 'ai' && msg.suggestions && (
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
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-tangerine flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">AI</div>
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4 bg-white">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about appointments, lab results..."
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
            AI Assistant is for informational purposes only and does not provide medical advice.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AI_Assistant;
