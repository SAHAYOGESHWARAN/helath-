
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, ChatMessage, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import { SearchIcon, MessageSquareIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';
import { useApp } from '../../App';

const mockMessages: { [key: string]: ChatMessage[] } = {
    'user_1720556108835': [
        { id: 'msg1', senderId: 'user_1720556157018', receiverId: 'user_1720556108835', text: 'Hello John, how are you feeling today?', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isRead: false },
        { id: 'msg2', senderId: 'user_1720556108835', receiverId: 'user_1720556157018', text: 'I am feeling much better, thank you Dr. Smith!', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), isRead: true },
    ],
    'pat2': [ // This is a placeholder, a real app would have more dynamic data
        { id: 'msg3', senderId: 'user_1720556157018', receiverId: 'pat2', text: 'Your test results are back and look good.', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: true },
    ]
};

const ChatSkeletonLoader: React.FC = () => (
    <div className="flex-1 px-6 py-4 space-y-6 animate-pulse">
        <div className="flex items-end gap-2 justify-start"><div className="w-3/5 h-16 rounded-lg shimmer-bg"></div><div className="w-8 h-8 rounded-full shimmer-bg"></div></div>
        <div className="flex items-end gap-2 justify-end"><div className="w-1/2 h-12 rounded-lg shimmer-bg"></div><div className="w-8 h-8 rounded-full shimmer-bg"></div></div>
        <div className="flex items-end gap-2 justify-start"><div className="w-2/5 h-10 rounded-lg shimmer-bg"></div><div className="w-8 h-8 rounded-full shimmer-bg"></div></div>
    </div>
);

const TypingIndicator: React.FC<{ avatar: string | undefined }> = ({ avatar }) => (
  <div className="flex items-start gap-3 justify-start">
    <img src={avatar} alt="typing user" className="w-8 h-8 rounded-full flex-shrink-0" />
    <div className="p-3 rounded-lg bg-white shadow-sm flex items-center space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

const Messaging: React.FC = () => {
    const { user, users } = useAuth();
    const { showToast } = useApp();

    const availablePatients = useMemo(() => {
        if (!user?.state) return [];
        return users.filter(u => u.role === UserRole.PATIENT && u.state === user.state);
    }, [users, user]);

    const [selectedPatient, setSelectedPatient] = useState<User | null>(availablePatients.length > 0 ? availablePatients[0] : null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (selectedPatient) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages(mockMessages[selectedPatient.id] || []);
                setIsLoading(false);
            }, 300);
        } else {
             setMessages([]);
             setIsLoading(false);
        }
    }, [selectedPatient]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !selectedPatient) return;

        const message: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: user.id,
            receiverId: selectedPatient.id,
            text: newMessage,
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Simulate notification
        const recipient = users.find(u => u.id === selectedPatient.id);
        if (recipient?.notificationSettings?.emailMessages) {
            showToast(`Simulating email notification to ${recipient.name}`, 'info');
        }
        if (recipient?.notificationSettings?.smsMessages && recipient.phone) {
            showToast(`Simulating SMS notification to ${recipient.name}`, 'info');
        }
        
        // Simulate typing and response from patient
        setIsTyping(true);
        setTimeout(() => {
            const reply: ChatMessage = {
                 id: `msg_${Date.now() + 1}`,
                 senderId: selectedPatient.id,
                 receiverId: user.id,
                 text: `Thank you, Doctor. I've received your message.`,
                 timestamp: new Date().toISOString(),
                 isRead: false,
            };
            setIsTyping(false);
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div>
            <PageHeader title="Patient Messaging" />
            <Card className="p-0 flex h-[calc(100vh-14rem)]">
                {/* Contact List Column */}
                <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                         <div className="relative"><input type="text" placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary-300" /><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {availablePatients.map(patient => {
                            const lastMessage = mockMessages[patient.id]?.slice(-1)[0];
                            const unread = lastMessage && lastMessage.senderId === patient.id && !lastMessage.isRead;
                             return (
                                <div key={patient.id} onClick={() => setSelectedPatient(patient)} className={`flex items-center p-4 cursor-pointer border-l-4 transition-colors duration-150 ${selectedPatient?.id === patient.id ? 'border-primary-500 bg-primary-50' : 'border-transparent hover:bg-gray-50'}`}>
                                    <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full flex-shrink-0" />
                                    <div className="ml-3 flex-grow overflow-hidden">
                                        <div className="flex justify-between items-center"><p className="font-semibold text-gray-800 truncate">{patient.name}</p>{lastMessage && <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{timeSince(lastMessage.timestamp)}</p>}</div>
                                        <div className="flex justify-between items-center"><p className={`text-sm text-gray-500 truncate ${unread ? 'font-bold text-gray-800' : ''}`}>{lastMessage?.text || `DOB: ${patient.dob}`}</p>{unread && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 ml-2"></div>}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedPatient ? (
                        <>
                            <div className="p-4 border-b flex items-center bg-white shadow-sm z-10">
                                <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-10 h-10 rounded-full" />
                                <div className="ml-3"><p className="font-semibold text-xl text-gray-800">{selectedPatient.name}</p><p className="text-xs text-gray-500">Patient</p></div>
                            </div>
                            {isLoading ? <ChatSkeletonLoader /> : (
                                <div className="flex-1 px-6 py-4 overflow-y-auto space-y-2">
                                     {messages.map((msg) => (
                                        <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                                            {msg.senderId !== user?.id && <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-8 h-8 rounded-full flex-shrink-0" />}
                                            <div className={`flex flex-col max-w-xl ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                                                <div className={`p-3 rounded-lg ${msg.senderId === user?.id ? 'bg-accent text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            {msg.senderId === user?.id && <img src={user?.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full flex-shrink-0" />}
                                        </div>
                                    ))}
                                    {isTyping && <TypingIndicator avatar={selectedPatient.avatarUrl} />}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={handleSendMessage} className="flex space-x-3"><input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500" /><button type="submit" disabled={!newMessage.trim()} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button></form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8"><MessageSquareIcon className="w-16 h-16 text-gray-300 mb-4" /><h3 className="text-lg font-semibold text-gray-700">No Patients Available</h3><p>As patients from your state register, they will appear here.</p></div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Messaging;