import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, Message } from '../../types';
import { PaperAirplaneIcon } from '../../components/shared/Icons';

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
};

const Messaging: React.FC = () => {
    const { user, users, messages, sendMessage, markMessagesAsRead } = useAuth();
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

     const providersWithMessages = useMemo(() => {
        if (!user) return [];
        const providerConversations = new Map<string, { provider: User; lastMessage: Message | null; unreadCount: number }>();
        const allMessages: Message[] = Object.values(messages).flat();
        
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
        if (providersWithMessages.length > 0 && !selectedProvider) {
            setSelectedProvider(providersWithMessages[0].provider);
        }
    }, [providersWithMessages, selectedProvider]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedProvider, isLoading]);

    useEffect(() => {
        if (selectedProvider && user) {
            markMessagesAsRead(selectedProvider.id);
        }
    }, [selectedProvider, user, markMessagesAsRead, messages]);

    const currentMessages = useMemo(() => {
        if (!selectedProvider || !user) return [];
        const allMessages: Message[] = Object.values(messages).flat();
        const relevantMessages = allMessages.filter(
            m => (m.senderId === user.id && m.receiverId === selectedProvider.id) || 
                 (m.senderId === selectedProvider.id && m.receiverId === user.id)
        );
        const uniqueMessages = Array.from(new Map(relevantMessages.map(m => [m.id, m])).values());
        return uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, selectedProvider, user]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !selectedProvider) return;
        
        sendMessage({
            senderId: user.id,
            receiverId: selectedProvider.id,
            text: message,
        });
        
        const messageToSend = message;
        setMessage('');
        setIsLoading(true);

        await new Promise(res => setTimeout(res, 1500 + Math.random() * 1000));
        
        sendMessage({
            senderId: selectedProvider.id,
            receiverId: user.id,
            text: `This is an automated reply to: "${messageToSend}"`,
        });

        setIsLoading(false);
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
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {currentMessages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.senderId !== user.id && <img src={selectedProvider.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                    <div className={`max-w-lg p-3 rounded-2xl ${msg.senderId === user.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1.5 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    {msg.senderId === user.id && <img src={user.avatarUrl} alt="patient avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-end gap-3 justify-start">
                                    <img src={selectedProvider.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                                    <div className="max-w-lg p-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border">
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
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() || isLoading}
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
