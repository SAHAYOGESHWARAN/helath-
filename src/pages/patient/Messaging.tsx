import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { socketService } from '@/services/socketService';
import { User, UserRole, Message } from '../../types';
import { PaperAirplaneIcon, CheckCircleIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';
import { Card } from '../../components/shared/Card';

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
    const { user, users, messages, sendMessage, markMessagesAsRead, socketStatus } = useAuth();
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // AI generation is proxied to a server endpoint. No client-side SDK initialization here.

    useEffect(() => {
        if (providersWithMessages.length > 0 && !selectedProvider) {
            setSelectedProvider(providersWithMessages[0].provider);
        }
    }, [providersWithMessages, selectedProvider]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(scrollToBottom, [messages, selectedProvider]);

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
        if (!message.trim() || !user || !selectedProvider) return;

        const newMessage: Omit<Message, 'id' | 'timestamp' | 'isRead'> = {
            senderId: user.id,
            receiverId: selectedProvider.id,
            text: message,
        };
        sendMessage(newMessage);
        socketService.sendMessage({ type: 'message', payload: newMessage });
        setMessage('');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Please log in to access messaging.</p>
            </div>
        );
    }

    const filteredProviders = useMemo(() => {
        if (!searchQuery.trim()) return providersWithMessages;
        const query = searchQuery.toLowerCase();
        return providersWithMessages.filter(({ provider }) =>
            provider.name.toLowerCase().includes(query) ||
            provider.specialty?.toLowerCase().includes(query)
        );
    }, [providersWithMessages, searchQuery]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
            <PageHeader
                title="Secure Messaging"
                subtitle="Connect with your healthcare providers in real-time"
            />
            <Card className="flex-1 flex p-0 overflow-hidden shadow-xl border-0">
                <div className="flex h-full w-full bg-white rounded-xl overflow-hidden backdrop-blur-sm">
                    {/* Enhanced Sidebar */}
                    <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200/60 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
                        <div className="p-4 border-b border-gray-200/60 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-bold">Conversations</h2>
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                    aria-label="Search"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                            {showSearch && (
                                <div className="mt-2 animate-fade-in">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search providers..."
                                        className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            {filteredProviders.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p className="text-sm">No conversations found</p>
                                </div>
                            ) : (
                                filteredProviders.map(({ provider, lastMessage, unreadCount }) => (
                                    <div
                                        key={provider.id}
                                        onClick={() => setSelectedProvider(provider)}
                                        className={`flex items-center p-4 cursor-pointer border-l-4 transition-all duration-200 ${selectedProvider?.id === provider.id
                                            ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-600 shadow-sm'
                                            : 'border-transparent hover:bg-gray-50/80'
                                            }`}
                                    >
                                        <div className="relative">
                                            <img
                                                src={provider.avatarUrl}
                                                alt={provider.name}
                                                className="w-14 h-14 rounded-full mr-3 ring-2 ring-offset-2 ring-gray-200 shadow-sm"
                                            />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white animate-pulse">
                                                    {unreadCount > 9 ? '9+' : unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-semibold text-gray-800 truncate text-sm">{provider.name}</p>
                                                {lastMessage && (
                                                    <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                        {formatTimestamp(lastMessage.timestamp)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 truncate flex-1">
                                                    {lastMessage?.text || 'No messages yet'}
                                                </p>
                                                {selectedProvider?.id === provider.id && (
                                                    <CheckCircleIcon className="w-4 h-4 text-primary-600 ml-2 flex-shrink-0" />
                                                )}
                                            </div>
                                            {provider.specialty && (
                                                <p className="text-xs text-gray-500 mt-1 truncate">{provider.specialty}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Enhanced Chat Area */}
                    <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
                        {selectedProvider ? (
                            <>
                                <div className="p-4 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between shadow-sm sticky top-0 z-10">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <img
                                                src={selectedProvider.avatarUrl}
                                                alt={selectedProvider.name}
                                                className="w-12 h-12 rounded-full mr-3 ring-2 ring-primary-200 shadow-md"
                                            />
                                            <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-gray-800 text-lg">{selectedProvider.name}</h3>
                                                {/* Socket status badge */}
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shadow-sm ${socketStatus === 'connected' ? 'bg-green-100 text-green-800' : socketStatus === 'reconnecting' ? 'bg-yellow-100 text-yellow-800' : socketStatus === 'connecting' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                                    {socketStatus ? `Realtime: ${socketStatus.charAt(0).toUpperCase() + socketStatus.slice(1)}` : 'Realtime: Unknown'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <span>{selectedProvider.specialty || 'Healthcare Provider'}</span>
                                                <span className="mx-2">•</span>
                                                <span className="text-green-600 text-xs font-medium">Online</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}>
                                    {currentMessages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                                <PaperAirplaneIcon className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-medium">No messages yet</p>
                                            <p className="text-sm mt-1">Start a conversation with {selectedProvider.name}</p>
                                        </div>
                                    ) : (
                                        currentMessages.map((msg, index) => {
                                            const prevMsg = currentMessages[index - 1];
                                            const nextMsg = currentMessages[index + 1];
                                            const isUserMessage = msg.senderId === user.id;

                                            const showDateDivider = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

                                            const isFirstInSequence = !prevMsg || prevMsg.senderId !== msg.senderId || (new Date(msg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime()) > 1000 * 60 * 5;
                                            const isLastInSequence = !nextMsg || nextMsg.senderId !== msg.senderId || (new Date(nextMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) > 1000 * 60 * 5;

                                            const showAvatar = isLastInSequence && !isUserMessage;
                                            const marginTopClass = isFirstInSequence ? 'mt-6' : 'mt-2';

                                            return (
                                                <React.Fragment key={msg.id}>
                                                    {showDateDivider && (
                                                        <div className="text-center my-6">
                                                            <span className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-gray-500 font-medium shadow-sm border border-gray-200/50">
                                                                {formatDateDivider(new Date(msg.timestamp))}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={`flex items-end gap-3 ${isUserMessage ? 'justify-end' : 'justify-start'} ${marginTopClass} group`}>
                                                        {!isUserMessage && (
                                                            <div className="w-10 flex-shrink-0">
                                                                {showAvatar ? (
                                                                    <img
                                                                        src={selectedProvider.avatarUrl}
                                                                        alt="provider avatar"
                                                                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-md"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10"></div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className={`max-w-[70%] md:max-w-lg ${isUserMessage
                                                            ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg'
                                                            : 'bg-white text-gray-800 shadow-md border border-gray-200/60'
                                                            } rounded-2xl ${isLastInSequence ? (isUserMessage ? 'rounded-br-md' : 'rounded-bl-md') : ''} px-4 py-3 transform transition-all duration-200 hover:scale-[1.02]`}>
                                                            <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                                                                {msg.text}
                                                            </p>
                                                            <div className={`flex items-center justify-end gap-1 mt-2 ${isUserMessage ? 'text-white/80' : 'text-gray-500'}`}>
                                                                <p className="text-xs">
                                                                    {formatTimestamp(msg.timestamp)}
                                                                </p>
                                                                {isUserMessage && (
                                                                    <CheckCircleIcon className="w-3 h-3 ml-1" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isUserMessage && (
                                                            <div className="w-10 flex-shrink-0">
                                                                {showAvatar && (
                                                                    <img
                                                                        src={user.avatarUrl}
                                                                        alt="user avatar"
                                                                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-md"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm sticky bottom-0">
                                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                placeholder={`Type a message to ${selectedProvider.name}...`}
                                                className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50/80 hover:bg-white transition-all text-sm"
                                                aria-label="Message input"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage(e as any);
                                                    }
                                                }}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                {message.trim() && (
                                                    <span className="text-xs text-gray-400">
                                                        Press Enter to send
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3.5 rounded-2xl hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                            aria-label="Send message"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-50 to-white">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                                        <PaperAirplaneIcon className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-600">Select a conversation</p>
                                    <p className="text-sm text-gray-500 mt-1">Choose a provider to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Messaging;
