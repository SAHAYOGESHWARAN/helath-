import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, ChatMessage, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import { SearchIcon, MessageSquareIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';

const ChatSkeletonLoader: React.FC = () => (
    <div className="flex-1 px-6 py-4 space-y-6 animate-pulse">
        <div className="flex items-end gap-2 justify-start"><div className="w-8 h-8 rounded-full shimmer-bg"></div><div className="w-2/5 h-12 rounded-lg shimmer-bg"></div></div>
        <div className="flex items-end gap-2 justify-end"><div className="w-3/5 h-16 rounded-lg shimmer-bg"></div><div className="w-8 h-8 rounded-full shimmer-bg"></div></div>
        <div className="flex items-end gap-2 justify-start"><div className="w-8 h-8 rounded-full shimmer-bg"></div><div className="w-1/2 h-10 rounded-lg shimmer-bg"></div></div>
    </div>
);

const TypingIndicator: React.FC<{ avatar: string | undefined }> = ({ avatar }) => (
  <div className="flex items-start gap-3 justify-start">
    <img src={avatar} alt="typing user" className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none shadow-sm flex items-center space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

const Messaging: React.FC = () => {
    const { user, users, messages, sendMessage, markMessagesAsRead } = useAuth();
    
    const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
    const availableProviders = useMemo(() => {
        if (!user?.state) return [];
        return users.filter(u => 
            u.role === UserRole.PROVIDER && 
            u.isVerified &&
            u.state === user.state
        );
    }, [users, user]);
    
    const providersInConversations = useMemo(() => {
        const providerIds = new Set(Object.keys(messages));
        return availableProviders.filter(p => providerIds.has(p.id));
    }, [messages, availableProviders]);

    const [selectedProvider, setSelectedProvider] = useState<User | null>(providersInConversations.length > 0 ? providersInConversations[0] : null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedProvider) {
            // Add a small delay to let the user see the unread count before it disappears
            setTimeout(() => {
                markMessagesAsRead(selectedProvider.id);
            }, 500);
        }
    }, [selectedProvider, markMessagesAsRead]);

    const currentMessages = useMemo(() => {
        if (!selectedProvider) return [];
        return messages[selectedProvider.id] || [];
    }, [selectedProvider, messages]);

    const isTyping = useMemo(() => {
        if (!user || currentMessages.length === 0) return false;
        const lastMessage = currentMessages[currentMessages.length - 1];
        return lastMessage.senderId === user.id;
    }, [currentMessages, user]);

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };
    
    useEffect(() => {
        if (!selectedProvider && providersInConversations.length > 0) {
            setSelectedProvider(providersInConversations[0]);
        }
    }, [providersInConversations, selectedProvider]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, isLoading, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !selectedProvider) return;
        sendMessage({
            senderId: user.id,
            receiverId: selectedProvider.id,
            text: newMessage,
        });
        setNewMessage('');
    };
    
    const startNewConversation = (providerId: string) => {
        const provider = availableProviders.find(p => p.id === providerId);
        if (provider) {
            setSelectedProvider(provider);
        }
        setIsNewMessageModalOpen(false);
    };

    return (
        <div>
            <PageHeader title="Secure Messaging" buttonText="New Message" onButtonClick={() => setIsNewMessageModalOpen(true)} />
            <Card className="p-0 flex h-[calc(100vh-14rem)]">
                {/* Contact List Column */}
                <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                         <div className="relative"><input type="text" placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary-300" /><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {providersInConversations.map(provider => {
                            const thread = messages[provider.id] || [];
                            const lastMessage = thread.length > 0 ? thread[thread.length - 1] : null;
                            const unreadCount = thread.filter(msg => !msg.isRead && msg.senderId === provider.id).length;
                            return (
                                <div key={provider.id} onClick={() => setSelectedProvider(provider)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors duration-150 ${selectedProvider?.id === provider.id ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:bg-gray-50'}`}>
                                    <div className="relative flex-shrink-0"><img src={provider.avatarUrl} alt={provider.name} className="w-12 h-12 rounded-full" /><div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div></div>
                                    <div className="ml-3 flex-grow overflow-hidden">
                                        <div className="flex justify-between items-center"><p className="font-semibold text-gray-800 truncate">{provider.name}</p>{lastMessage && <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{timeSince(lastMessage.timestamp)}</p>}</div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm text-gray-500 truncate ${unreadCount > 0 ? 'font-bold text-gray-800' : ''}`}>
                                                {lastMessage?.text || provider.specialty}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedProvider ? (
                        <>
                        <div className="p-4 border-b flex items-center bg-white shadow-sm z-10">
                            <img src={selectedProvider.avatarUrl} alt={selectedProvider.name} className="w-10 h-10 rounded-full" />
                            <div className="ml-3"><p className="font-semibold text-xl text-gray-800">{selectedProvider.name}</p><p className="text-xs text-emerald-600">Online</p></div>
                        </div>
                        {isLoading ? <ChatSkeletonLoader /> : (
                            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-2">
                                {currentMessages.map((msg) => (
                                    <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.senderId !== user?.id && <img src={selectedProvider.avatarUrl} alt={selectedProvider.name} className="w-8 h-8 rounded-full flex-shrink-0" />}
                                        <div className={`flex flex-col max-w-xl ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 rounded-lg ${msg.senderId === user?.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                                <p className="text-sm">{msg.text}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        {msg.senderId === user?.id && <img src={user?.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full flex-shrink-0" />}
                                    </div>
                                ))}
                                {isTyping && <TypingIndicator avatar={selectedProvider.avatarUrl} />}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                        <div className="p-4 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex space-x-3"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500" /><button type="submit" disabled={!newMessage.trim()} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400 transition-colors flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button></form>
                        </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8"><MessageSquareIcon className="w-16 h-16 text-gray-300 mb-4" /><h3 className="text-lg font-semibold text-gray-700">No Conversations</h3><p>Click "New Message" to start a secure chat with a provider.</p></div>
                    )}
                </div>
            </Card>

            <Modal isOpen={isNewMessageModalOpen} onClose={() => setIsNewMessageModalOpen(false)} title="Start a New Conversation">
                <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-4">Select a provider to message:</p>
                    {availableProviders.map(p => (
                        <button key={p.id} onClick={() => startNewConversation(p.id)} className="w-full text-left p-3 flex items-center rounded-lg hover:bg-gray-100">
                            <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full mr-3"/>
                            <div>
                                <p className="font-semibold">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.specialty}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Messaging;