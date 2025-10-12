import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, ChatMessage, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import { SearchIcon, SparklesIcon } from '../../components/shared/Icons';

const mockProviders: User[] = [
    { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider/100', specialty: 'Cardiology' },
    { id: 'pro2', name: 'Dr. David Chen', email: 'david.chen@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider2/100', specialty: 'Dermatology' },
];

const mockMessages: { [key: string]: ChatMessage[] } = {
    'pro1': [
        { id: 'msg1', senderId: 'pro1', receiverId: 'pat1', text: 'Hello John, how are you feeling today?', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isRead: false },
        { id: 'msg2', senderId: 'pat1', receiverId: 'pro1', text: 'I am feeling much better, thank you Dr. Smith!', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), isRead: true },
    ],
    'pro2': [
        { id: 'msg3', senderId: 'pro2', receiverId: 'pat1', text: 'Your test results are back and look good.', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: true },
    ]
};

const ChatSkeletonLoader = () => (
    <div className="flex-1 px-6 py-4 space-y-6 animate-pulse">
        <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full shimmer-bg"></div>
            <div className="w-2/5 h-12 rounded-lg shimmer-bg"></div>
        </div>
        <div className="flex items-end gap-2 justify-end">
            <div className="w-3/5 h-16 rounded-lg shimmer-bg"></div>
            <div className="w-8 h-8 rounded-full shimmer-bg"></div>
        </div>
        <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full shimmer-bg"></div>
            <div className="w-1/2 h-10 rounded-lg shimmer-bg"></div>
        </div>
    </div>
);


const Messaging: React.FC = () => {
    const { user } = useAuth();
    const [selectedProvider, setSelectedProvider] = useState<User>(mockProviders[0]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching messages
        setTimeout(() => {
            setMessages(mockMessages[selectedProvider.id] || []);
            setIsLoading(false);
        }, 300);
    }, [selectedProvider]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: user.id,
            receiverId: selectedProvider.id,
            text: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Messaging</h1>
            <Card className="p-0 flex h-[calc(100vh-12rem)]">
                {/* Contact List Column */}
                <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                         <div className="relative">
                            <input type="text" placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-primary-300" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {mockProviders.map(provider => (
                            <div key={provider.id} onClick={() => setSelectedProvider(provider)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors duration-150 ${selectedProvider.id === provider.id ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:bg-gray-50'}`}>
                                <img src={provider.avatarUrl} alt={provider.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                                <div className="ml-3 flex-grow overflow-hidden">
                                    <p className="font-semibold text-gray-800 truncate">{provider.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{provider.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    <div className="p-4 border-b flex items-center bg-white">
                         <img src={selectedProvider.avatarUrl} alt={selectedProvider.name} className="w-10 h-10 rounded-full" />
                         <p className="ml-3 font-semibold text-xl text-gray-800">{selectedProvider.name}</p>
                    </div>
                    {isLoading ? <ChatSkeletonLoader /> : (
                        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xl p-3 rounded-lg break-words ${msg.senderId === user?.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                     <div className="p-4 border-t bg-white">
                        <form onSubmit={handleSendMessage} className="flex space-x-3">
                            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500" />
                            <button type="submit" className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Messaging;