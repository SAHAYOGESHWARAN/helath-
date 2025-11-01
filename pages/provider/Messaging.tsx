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
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const patientsWithMessages = useMemo(() => {
        if (!user) return [];
        const patientConversations = new Map<string, { patient: User; lastMessage: Message | null; unreadCount: number }>();
        const allMessages: Message[] = Object.values(messages).flat();
        
        allMessages.forEach(msg => {
            let patientId: string | null = null;
            if (msg.senderId === user.id) {
                patientId = msg.receiverId;
            } else if (msg.receiverId === user.id) {
                patientId = msg.senderId;
            }

            if (patientId) {
                const patient = users.find(u => u.id === patientId && u.role === UserRole.PATIENT);
                if (patient) {
                    if (!patientConversations.has(patient.id)) {
                        patientConversations.set(patient.id, {
                            patient,
                            lastMessage: null,
                            unreadCount: 0,
                        });
                    }
                    const convo = patientConversations.get(patient.id)!;
                    if (!convo.lastMessage || new Date(msg.timestamp) > new Date(convo.lastMessage.timestamp)) {
                        convo.lastMessage = msg;
                    }
                    if (!msg.isRead && msg.senderId !== user.id) {
                        convo.unreadCount += 1;
                    }
                }
            }
        });
        
        return Array.from(patientConversations.values()).sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [users, messages, user]);


    useEffect(() => {
        if (patientsWithMessages.length > 0 && !selectedPatient) {
            setSelectedPatient(patientsWithMessages[0].patient);
        }
    }, [patientsWithMessages, selectedPatient]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedPatient, isLoading]);
    
    useEffect(() => {
        if (selectedPatient && user) {
            markMessagesAsRead(selectedPatient.id);
        }
    }, [selectedPatient, user, markMessagesAsRead, messages]);

    const currentMessages = useMemo(() => {
        if (!selectedPatient || !user) return [];
        const allMessages: Message[] = Object.values(messages).flat();
        const relevantMessages = allMessages.filter(
            m => (m.senderId === user.id && m.receiverId === selectedPatient.id) || 
                 (m.senderId === selectedPatient.id && m.receiverId === user.id)
        );
        const uniqueMessages = Array.from(new Map(relevantMessages.map(m => [m.id, m])).values());
        return uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, selectedPatient, user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !selectedPatient) return;

        setIsLoading(true);
        sendMessage({
            senderId: user.id,
            receiverId: selectedPatient.id,
            text: message,
        });
        setMessage('');
        setIsLoading(false);
    };

    if (!user) return null;

    return (
         <div className="flex h-[calc(100vh-6.5rem)] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Patient Messages</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {patientsWithMessages.map(({ patient, lastMessage, unreadCount }) => (
                        <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`flex items-center p-3 cursor-pointer border-l-4 ${selectedPatient?.id === patient.id ? 'bg-primary-50 border-primary-600' : 'border-transparent hover:bg-gray-50'}`}
                        >
                            <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full mr-3" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-800 truncate">{patient.name}</p>
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
                {selectedPatient ? (
                    <>
                        <div className="p-4 border-b bg-white flex items-center shadow-sm">
                            <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedPatient.name}</h3>
                                <p className="text-sm text-gray-500">DOB: {selectedPatient.dob}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {currentMessages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.senderId !== user.id && <img src={selectedPatient.avatarUrl} alt="patient avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                    <div className={`max-w-lg p-3 rounded-2xl ${msg.senderId === user.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1.5 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    {msg.senderId === user.id && <img src={user.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                </div>
                            ))}
                            {isLoading && (
                                 <div className="flex items-end gap-3 justify-end">
                                    <div className="max-w-lg p-3 rounded-2xl bg-primary-600 text-white rounded-br-none">
                                        <div className="flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                    </div>
                                    <img src={user.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
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
                                    placeholder={`Message ${selectedPatient.name}...`}
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
