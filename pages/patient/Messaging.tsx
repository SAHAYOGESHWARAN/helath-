import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, Message } from '../../types';
import { PaperAirplaneIcon, SparklesIcon } from '../../components/shared/Icons';
import { GoogleGenAI, Content } from '@google/genai';

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateDivider = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time components for accurate date comparison
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === today.getTime()) return 'Today';
    if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return messageDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};


const Messaging: React.FC = () => {
    const { user, users, messages, sendMessage, markMessagesAsRead } = useAuth();
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const ai = useRef<GoogleGenAI | null>(null);

     const providersWithMessages = useMemo(() => {
        if (!user) return [];
        const providerConversations = new Map<string, { provider: User; lastMessage: Message | null; unreadCount: number }>();
        const allMessages: Message[] = Object.values(messages).flat() as Message[];
        
        allMessages.forEach(msg => {
            let providerId: string | null = null;
            if (msg.senderId === user.id) {
                providerId = msg.receiverId;
            } else if (msg.receiverId === user.id) {
                providerId = msg.senderId;
            }

            if (providerId) {
                const provider = users.find(u => u.id === providerId && u.role === UserRole.PROVIDER);
                if (provider) {
                    if (!providerConversations.has(provider.id)) {
                        providerConversations.set(provider.id, {
                            provider,
                            lastMessage: null,
                            unreadCount: 0,
                        });
                    }
                    const convo = providerConversations.get(provider.id)!;
                    if (!convo.lastMessage || new Date(msg.timestamp) > new Date(convo.lastMessage.timestamp)) {
                        convo.lastMessage = msg;
                    }
                    if (!msg.isRead && msg.senderId !== user.id) {
                        convo.unreadCount += 1;
                    }
                }
            }
        });
        
        return Array.from(providerConversations.values()).sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [users, messages, user]);

    useEffect(() => {
        ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);

    useEffect(() => {
        if (providersWithMessages.length > 0 && !selectedProvider) {
            setSelectedProvider(providersWithMessages[0].provider);
        }
    }, [providersWithMessages, selectedProvider]);
    
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    
    useEffect(scrollToBottom, [messages, selectedProvider, isReplying]);

    useEffect(() => {
        if (selectedProvider && user) {
            markMessagesAsRead(selectedProvider.id);
        }
    }, [selectedProvider, user, markMessagesAsRead, messages]);

    const currentMessages = useMemo(() => {
        if (!selectedProvider || !user) return [];
        const allMessages: Message[] = Object.values(messages).flat() as Message[];
        const relevantMessages = allMessages.filter(
            m => (m.senderId === user.id && m.receiverId === selectedProvider.id) || 
                 (m.senderId === selectedProvider.id && m.receiverId === user.id)
        );
        const uniqueMessages = Array.from(new Map(relevantMessages.map(m => [m.id, m])).values());
        return uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, selectedProvider, user]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !selectedProvider || !ai.current || isReplying) return;

        const userMessageText = message;
        setMessage('');

        sendMessage({
            senderId: user.id,
            receiverId: selectedProvider.id,
            text: userMessageText,
        });

        setIsReplying(true);

        try {
            const systemInstruction = `You are an AI assistant impersonating a medical provider named ${selectedProvider.name}. A patient, ${user.name}, has sent you a message. Respond concisely and helpfully. The conversation history is provided. Your response should be brief and conversational. IMPORTANT: Do NOT provide medical advice. Instead, encourage the user to schedule an appointment for any medical concerns. Keep responses to 2-3 sentences.`;
            
            const historyForGemini: Content[] = currentMessages.map(m => ({
                role: m.senderId === user.id ? 'user' : 'model',
                parts: [{ text: m.text }],
            }));
            
            const response = await ai.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [...historyForGemini, { role: 'user', parts: [{ text: userMessageText }] }],
                config: { systemInstruction },
            });

            const replyText = response.text;
            
            sendMessage({
                senderId: selectedProvider.id,
                receiverId: user.id,
                text: replyText,
            });
        } catch (error) {
            console.error("Error generating reply:", error);
            sendMessage({
                senderId: selectedProvider.id,
                receiverId: user.id,
                text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
            });
        } finally {
            setIsReplying(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex h-[calc(100vh-6.5rem)] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Messaging</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {providersWithMessages.map(({ provider, lastMessage, unreadCount }) => (
                        <div
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider)}
                            className={`flex items-center p-3 cursor-pointer border-l-4 ${selectedProvider?.id === provider.id ? 'bg-primary-50 border-primary-600' : 'border-transparent hover:bg-gray-50'}`}
                        >
                            <img src={provider.avatarUrl} alt={provider.name} className="w-12 h-12 rounded-full mr-3" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-800 truncate">{provider.name}</p>
                                    {lastMessage && <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTimestamp(lastMessage.timestamp)}</p>}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600 truncate">{lastMessage?.text || 'No messages yet'}</p>
                                    {unreadCount > 0 && <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">{unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gray-50">
                {selectedProvider ? (
                    <>
                        <div className="p-4 border-b bg-white flex items-center shadow-sm">
                            <img src={selectedProvider.avatarUrl} alt={selectedProvider.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedProvider.name}</h3>
                                <p className="text-sm text-gray-500">{selectedProvider.specialty}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                           {currentMessages.map((msg, index) => {
                                const prevMsg = currentMessages[index - 1];
                                const nextMsg = currentMessages[index + 1];
                                const isUserMessage = msg.senderId === user.id;

                                const showDateDivider = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                                
                                const isFirstInSequence = !prevMsg || prevMsg.senderId !== msg.senderId || (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()) > 1000 * 60 * 5;
                                const isLastInSequence = !nextMsg || nextMsg.senderId !== msg.senderId || (new Date(nextMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) > 1000 * 60 * 5;

                                const showAvatar = isLastInSequence && !isUserMessage;
                                const marginTopClass = isFirstInSequence ? 'mt-4' : 'mt-1';

                                let bubbleClasses = 'rounded-xl';
                                if (isLastInSequence) {
                                    bubbleClasses = isUserMessage ? 'rounded-xl rounded-br-sm' : 'rounded-xl rounded-bl-sm';
                                }

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateDivider && (
                                            <div className="text-center text-xs text-gray-500 my-4">
                                                <span className="bg-gray-200 px-3 py-1 rounded-full">{formatDateDivider(new Date(msg.timestamp))}</span>
                                            </div>
                                        )}
                                        <div className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'} ${marginTopClass} animate-fade-in-up`}>
                                            {!isUserMessage && (
                                                <div className="w-8 flex-shrink-0">
                                                    {showAvatar && <img src={selectedProvider.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full" />}
                                                </div>
                                            )}
                                            <div className={`max-w-lg p-3 ${bubbleClasses} ${isUserMessage ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 border shadow-sm'}`}>
                                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                                <p className="text-xs opacity-70 mt-1.5 text-right">{formatTimestamp(msg.timestamp)}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                           })}
                            {isReplying && (
                                <div className="flex items-end gap-3 justify-start mt-4 animate-fade-in-up">
                                    <img src={selectedProvider.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                                    <div className="max-w-lg p-3 rounded-xl rounded-bl-sm bg-white text-gray-800 border shadow-sm">
                                        <div className="flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder={`Message ${selectedProvider.name}...`}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                    aria-label="Message input"
                                    disabled={isReplying}
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isReplying}
                                    className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                                    aria-label="Send message"
                                >
                                    <PaperAirplaneIcon className="w-6 h-6" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
