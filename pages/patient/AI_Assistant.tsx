
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob, Content } from "@google/genai";
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon, GlobeAltIcon, PaperClipIcon, MicrophoneIcon, StopIcon, SpeakerWaveIcon } from '../../components/shared/Icons';
import SkeletonChatBubble from '../../components/shared/skeletons/SkeletonChatBubble';
import PageHeader from '../../components/shared/PageHeader';
import { encode, decode, decodeAudioData } from '../../services/audioUtils';
import { useApp } from '../../contexts/AppContext.tsx';
import MarkdownRenderer from '../../components/shared/MarkdownRenderer';
import { Appointment } from '../../types';

// --- Type Definitions for Multimodal Content ---
// Define LiveSession interface locally since it's not exported from @google/genai
interface LiveSession {
  sendRealtimeInput: (input: { media: GenaiBlob }) => void;
  close: () => void;
}
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
  // FIX: Destructure appointments from useAuth to correctly access appointment data.
  const { user, appointments } = useAuth();
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
    try {
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } catch (error) {
      console.error("Failed to initialize AI:", error);
      showToast("Failed to initialize AI assistant. Please refresh the page.", 'error');
    }
  }, [showToast]);

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
      // FIX: user.appointments does not exist. Get appointments from useAuth context and filter for the current user.
      const userAppointments: Appointment[] = appointments.filter((a: Appointment) => a.patientId === user.id);
      if (userAppointments?.length) {
        const nextAppt = userAppointments.find(a => new Date(a.date) >= new Date());
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
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      showToast("Failed to generate response. Please try again.", 'error');
      setHistory(prev => [...prev.slice(0, -1), { role: 'model', parts: [{ text: "I'm sorry, I encountered an error while processing your request. Please try again or contact support if the issue persists." }] }]);
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
        const errorMsg = err instanceof Error ? err.message : "Microphone access denied";
        showToast(`Microphone access is required: ${errorMsg}. Please enable it in your browser settings.`, 'error');
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
    } catch (e) {
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
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/40">
      <PageHeader
        title="AI Health Assistant"
        subtitle="Your intelligent companion for personalized health insights"
      />

      <Card className="flex-1 flex flex-col p-0 shadow-2xl border-0 overflow-hidden">
        {/* Enhanced Chat Area with Gradient Background */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(168, 85, 247, 0.02) 50%, rgba(236, 72, 153, 0.02) 100%)',
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3Cpattern id=\"grid\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"%3E%3Cpath d=\"M 40 0 L 0 0 0 40\" fill=\"none\" stroke=\"%239C92AC\" stroke-width=\"0.5\" opacity=\"0.1\"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\"100%25\" height=\"100%25\" fill=\"url(%23grid)\"/%3E%3C/svg%3E')"
        }}>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <SparklesIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to AI Assistant</h3>
              <p className="text-gray-600 max-w-md">Ask me anything about your health, medications, appointments, or lab results. I'm here to help!</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">💊</div>
                  <p className="text-sm font-medium text-gray-700">Medication Info</p>
                  <p className="text-xs text-gray-500 mt-1">Ask about your prescriptions</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-sm font-medium text-gray-700">Appointments</p>
                  <p className="text-xs text-gray-500 mt-1">Check your schedule</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">🧪</div>
                  <p className="text-sm font-medium text-gray-700">Lab Results</p>
                  <p className="text-xs text-gray-500 mt-1">Review your tests</p>
                </div>
              </div>
            </div>
          ) : (
            history.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {msg.role === 'model' && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full blur-md opacity-30"></div>
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                  <div className={`group relative ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white shadow-xl'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-gray-200/60'
                    } rounded-2xl ${msg.role === 'user' ? 'rounded-tr-md' : 'rounded-tl-md'} px-5 py-4 transform transition-all duration-200 hover:scale-[1.01]`}>
                    {msg.role === 'model' && (
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {msg.parts.map(renderPart)}
                    </div>
                    {msg.role === 'user' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white/20 rounded-full"></div>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full blur-md opacity-20"></div>
                    <img
                      src={user?.avatarUrl}
                      alt="user avatar"
                      className="relative w-10 h-10 rounded-full ring-2 ring-white shadow-lg"
                    />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-start gap-4 animate-fade-in">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full blur-md opacity-30"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-white">
                  <SparklesIcon className="w-6 h-6 text-white animate-pulse" />
                </div>
              </div>
              <SkeletonChatBubble />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {isLiveConversation && (
          <div className="p-4 border-t border-purple-200/60 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 text-center animate-fade-in backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <SpeakerWaveIcon className="relative w-8 h-8 text-primary-600 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Live conversation active</p>
                <p className="text-xs text-gray-600">AI is listening and responding in real-time</p>
              </div>
              <button
                onClick={handleToggleLiveConversation}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md text-sm font-medium"
              >
                End
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200/60 p-4 bg-white/90 backdrop-blur-sm rounded-b-xl">
          {filesToUpload.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 animate-fade-in">
              {filesToUpload.map((file, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 p-2 rounded-lg text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-700">{file.name}</span>
                  <button
                    onClick={() => setFilesToUpload(f => f.filter(fl => fl !== file))}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-end gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="file-upload"
                className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer transition-all hover:scale-110 hover:text-primary-600"
                title="Attach file"
              >
                <PaperClipIcon className="w-5 h-5" />
                <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              </label>
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`p-2.5 rounded-xl transition-all hover:scale-110 ${isRecording
                  ? 'bg-red-500 text-white shadow-lg animate-pulse'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                  }`}
                title={isRecording ? "Stop recording" : "Record audio"}
              >
                {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ask me anything about your health..."
                className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50/80 hover:bg-white transition-all text-sm shadow-sm"
                disabled={loading || isLiveConversation}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {prompt.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  Press Enter
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleToggleLiveConversation}
              className={`p-2.5 rounded-xl transition-all hover:scale-110 ${isLiveConversation
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100 hover:text-purple-600'
                }`}
              title="Live conversation"
            >
              <SpeakerWaveIcon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={loading || (!prompt.trim() && filesToUpload.length === 0)}
              className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 text-white p-3.5 rounded-2xl hover:from-primary-700 hover:via-primary-800 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              title="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;