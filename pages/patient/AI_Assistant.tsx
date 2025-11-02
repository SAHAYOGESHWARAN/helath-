import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenaiBlob, Content } from '@google/genai';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon, GlobeAltIcon, PaperClipIcon, MicrophoneIcon, StopIcon, SpeakerWaveIcon } from '../../components/shared/Icons';
import SkeletonChatBubble from '../../components/shared/skeletons/SkeletonChatBubble';
import PageHeader from '../../components/shared/PageHeader';
import { encode, decode, decodeAudioData } from '../../services/audioUtils';
import { useApp } from '../../App';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';

// --- Type Definitions for Multimodal Content ---
interface TextPart { text: string; }
interface InlineDataPart { inlineData: { mimeType: string; data: string; }; }
type Part = TextPart | InlineDataPart;

interface AIMessage {
  role: 'user' | 'model';
  parts: Part[];
}

// --- Helper Functions ---
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const createAudioBlob = (data: Float32Array): GenaiBlob => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};


const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useApp();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<AIMessage[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ai = useRef<GoogleGenAI | null>(null);

  // --- Audio & Live Conversation State ---
  const [isRecording, setIsRecording] = useState(false);
  const [isLiveConversation, setIsLiveConversation] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Live API refs
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const liveAudioStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const liveSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  let nextStartTime = 0;

  useEffect(() => {
    ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }, []);

  useEffect(() => {
    if (user && history.length === 0) {
      setHistory([{ role: 'model', parts: [{ text: `Hello, ${user.name}! I am your AI Health Assistant. How can I help you with your health goals today?` }] }]);
    }
  }, [user, history.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [history, loading]);

  const handleSendMessage = async () => {
    if ((!prompt.trim() && filesToUpload.length === 0) || loading || !ai.current || !user) return;

    setLoading(true);

    const mediaParts: InlineDataPart[] = await Promise.all(
      filesToUpload.map(file => fileToGenerativePart(file))
    );
    const textPart: TextPart = { text: prompt };
    const userParts: Part[] = [...mediaParts, textPart];

    const userMessage: AIMessage = { role: 'user', parts: userParts };
    const currentHistory: Content[] = history.map(h => ({ role: h.role, parts: h.parts }));
    
    setHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setFilesToUpload([]);

    const modelToUse = filesToUpload.some(f => f.type.startsWith('video/')) 
      ? 'gemini-2.5-pro' 
      : filesToUpload.some(f => f.type.startsWith('image/'))
      ? 'gemini-2.5-flash'
      : 'gemini-flash-lite-latest';
    
    const buildHealthSummary = () => {
        if (!user) return 'No patient data available.';
        let summary = 'Available patient data:\n';
        if (user.appointments?.length) {
          const nextAppt = user.appointments.find(a => new Date(a.date) >= new Date());
          if (nextAppt) {
            summary += `- Upcoming Appointment: ${nextAppt.reason} with ${nextAppt.providerName} on ${nextAppt.date}.\n`;
          }
        }
        if (user.labResults?.length) {
          const latestLab = user.labResults[0];
          summary += `- Latest Lab Results (${latestLab.date}): ${latestLab.testName} - ${latestLab.components.map(c => `${c.name}: ${c.value}`).join(', ')}.\n`;
        }
        if (user.medications?.length) {
          summary += `- Active Medications: ${user.medications.filter(m => m.status === 'Active').map(m => m.name).join(', ')}.\n`;
        }
        return summary;
      };
      
    const systemInstruction = `You are NovoPath Medical's friendly and helpful AI assistant. Your goal is to assist patients with their health-related questions based on their provided data. Current user: ${user.name}. Today's date: ${new Date().toLocaleDateString()}.
    
    ${buildHealthSummary()}
    
    IMPORTANT: Always format your responses using Markdown. Use lists, tables, and code blocks where appropriate to present information clearly. For example, when presenting lab results, use a table. Always include a disclaimer that you are an AI assistant and not a medical professional, and that the user should consult their doctor for medical advice. Do not make up medical information. Use the provided data to answer questions. Be concise.`;

    try {
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);
      
      const resultStream = await ai.current.models.generateContentStream({
        model: modelToUse,
        contents: [...currentHistory, { role: 'user', parts: userParts }],
        config: { systemInstruction },
      });

      let fullText = '';
      for await (const chunk of resultStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setHistory(prev => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage.role === 'model') {
              lastMessage.parts = [{ text: fullText }];
            }
            return newHistory;
          });
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setHistory(prev => [...prev.slice(0, -1), { role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        setFilesToUpload(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };
  
  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });
          stream.getTracks().forEach(track => track.stop());
          
          setLoading(true);
          const audioPart = await fileToGenerativePart(audioFile);
          const transcriptionPrompt = "Transcribe this audio.";
          const response = await ai.current!.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, { text: transcriptionPrompt }] },
          });
          setPrompt(prev => prev + ' ' + response.text);
          setLoading(false);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
        showToast("Microphone access is required. Please enable it in your browser settings.", 'error');
        setIsRecording(false);
      }
    }
  };

  const handleToggleLiveConversation = useCallback(async () => {
    if (isLiveConversation) {
        setIsLiveConversation(false);
        sessionPromiseRef.current?.then(session => session.close());
        scriptProcessorRef.current?.disconnect();
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        liveAudioStreamRef.current?.getTracks().forEach(track => track.stop());
        nextStartTime = 0;
        liveSourcesRef.current.clear();
        return;
    }

    setIsLiveConversation(true);
    if (!ai.current) return;
    
    try {
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        liveAudioStreamRef.current = stream;

        sessionPromiseRef.current = ai.current.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: { responseModalities: [Modality.AUDIO] },
            callbacks: {
                onopen: () => {
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createAudioBlob(inputData);
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (audioData && outputAudioContextRef.current) {
                        nextStartTime = Math.max(nextStartTime, outputAudioContextRef.current.currentTime);
                        const audioBuffer = await decodeAudioData(
                            decode(audioData),
                            outputAudioContextRef.current,
                            24000,
                            1
                        );
                        const source = outputAudioContextRef.current.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContextRef.current.destination);
                        source.addEventListener('ended', () => liveSourcesRef.current.delete(source));
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        liveSourcesRef.current.add(source);
                    }
                    if (message.serverContent?.interrupted) {
                        for (const source of liveSourcesRef.current.values()) {
                            source.stop();
                        }
                        liveSourcesRef.current.clear();
                        nextStartTime = 0;
                    }
                },
                onerror: (e) => {
                    console.error('Live session error:', e);
                    setIsLiveConversation(false);
                },
                onclose: () => {
                    setIsLiveConversation(false);
                }
            }
        });
    } catch(e) {
        console.error("Failed to start live conversation", e);
        showToast("Could not start live conversation. Please ensure microphone access is granted.", 'error');
        setIsLiveConversation(false);
    }
  }, [isLiveConversation, showToast]);

  const renderPart = (part: Part, index: number) => {
    if ('text' in part) {
      return <MarkdownRenderer key={index} content={part.text} />;
    }
    if (part.inlineData?.mimeType.startsWith('image/')) {
      return <img key={index} src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} alt="user upload" className="rounded-lg max-w-xs mt-2" />;
    }
    if (part.inlineData?.mimeType.startsWith('video/')) {
        return <video key={index} src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} controls className="rounded-lg max-w-xs mt-2" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="AI Assistant & Gemini Lab" subtitle="Your multimodal guide to a healthier lifestyle." />
      
      <Card className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : ''}`} style={{ animationDelay: `${index * 50}ms`}}>
              {msg.role === 'model' && <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 bg-primary-500`}><SparklesIcon className="w-5 h-5"/></div>}
              <div className="flex-1 max-w-xl">
                <div className={`p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {msg.parts.map(renderPart)}
                </div>
              </div>
              {msg.role === 'user' && <img src={user?.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
            </div>
          ))}
          {loading && <SkeletonChatBubble />}
          <div ref={messagesEndRef} />
        </div>

        {isLiveConversation && (
            <div className="p-4 border-t bg-gray-100 text-center animate-fade-in">
                <SpeakerWaveIcon className="w-8 h-8 text-primary-600 mx-auto animate-pulse" />
                <p className="font-semibold text-gray-700 mt-2">Live conversation is active...</p>
                <button onClick={handleToggleLiveConversation} className="mt-2 text-sm text-red-500 font-semibold hover:underline">End Conversation</button>
            </div>
        )}

        <div className="border-t p-4 bg-white rounded-b-xl">
          {filesToUpload.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {filesToUpload.map((file, i) => (
                <div key={i} className="bg-gray-100 p-1 rounded-md text-xs flex items-center gap-2">
                  <span>{file.name}</span>
                  <button onClick={() => setFilesToUpload(f => f.filter(fl => fl !== file))} className="text-gray-500 hover:text-red-500">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-2">
            <label htmlFor="file-upload" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer">
              <PaperClipIcon className="w-6 h-6" />
              <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            </label>
            <button type="button" onClick={handleToggleRecording} className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {isRecording ? <StopIcon className="w-6 h-6"/> : <MicrophoneIcon className="w-6 h-6" />}
            </button>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ask a question, or attach a file..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={loading || isLiveConversation}
            />
            <button type="button" onClick={handleToggleLiveConversation} className={`p-2 rounded-full transition-colors ${isLiveConversation ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              <SpeakerWaveIcon className="w-6 h-6" />
            </button>
            <button type="submit" disabled={loading || (!prompt.trim() && filesToUpload.length === 0)} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
