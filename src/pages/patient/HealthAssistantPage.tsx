import React, { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/shared/Card';

const HealthAssistantPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/genai/genai', {
        prompt,
      });
      setResponse(data.text);
    } catch (error) {
      console.error('Error fetching response from GenAI:', error);
      setResponse('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Health Assistant</h1>
      <p className="mb-4">Ask any health-related question and get an instant response from our AI-powered assistant.</p>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-l"
            placeholder="Ask a question..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Ask'}
          </button>
        </div>
      </form>
      {response && (
        <Card className="mt-4">
          <p>{response}</p>
        </Card>
      )}
    </div>
  );
};

export default HealthAssistantPage;
