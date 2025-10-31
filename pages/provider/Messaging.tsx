import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, Message } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { PaperAirplaneIcon } from '../../components/shared/Icons';

const Messaging: React.FC = () => {
    const { user, users, messages, sendMessage, markMessagesAsRead } = useAuth();
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const patientsWithMessages = useMemo(() => {
        if (!user) return [];
        const patientIdsWithMessages = new Set(Object.keys(messages));
        return users.filter(u => u.role === UserRole.PATIENT && patientIdsWithMessages.has(u.id));
    }, [users, messages, user]);

    useEffect(() => {
        if (patientsWithMessages.length > 0 && !selectedPatient) {
            setSelectedPatient(patientsWithMessages[0]);
        }
    }, [patientsWithMessages, selectedPatient]);

    useEffect(() => {
        if (selectedPatient) {
            markMessagesAsRead(selectedPatient.id);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedPatient, messages, markMessagesAsRead]);

    const currentMessages = useMemo(() => {
        if (!selectedPatient) return [];
        return messages[selectedPatient.id] || [];
    }, [messages, selectedPatient]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user || !selectedPatient) return;
        sendMessage({
            senderId: user.id,
            receiverId: selectedPatient.id,
            text: message,
        });
        setMessage('');
    };

    if (!user) return null;

    return (
        <div>
            <PageHeader title="Secure Messaging" />
            <Card className="p-0 h-[calc(100vh-12rem)] flex">
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Conversations with Patients</h2>
                    </div>
                    <div className="overflow-y-auto">
                        {patientsWithMessages.map(p => {
                            const lastMessage = messages[p.id]?.[messages[p.id].length - 1];
                            const unreadCount = messages[p.id]?.filter(m => !m.isRead && m.senderId !== user.id).length || 0;

                            return (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={`p-4 border-b cursor-pointer ${selectedPatient?.id === p.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{p.name}</p>
                                        {unreadCount > 0 && <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{lastMessage?.text || 'No messages yet'}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-2/3 flex flex-col">
                    {selectedPatient ? (
                        <>
                            <div className="p-4 border-b flex items-center">
                                <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <h3 className="font-semibold">{selectedPatient.name}</h3>
                                    <p className="text-sm text-gray-500">DOB: {selectedPatient.dob}</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {currentMessages.map(msg => (
                                    <div key={msg.id} className={`flex items-start gap-3 ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                        {msg.senderId !== user.id && <img src={selectedPatient.avatarUrl} alt="patient avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                        <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.senderId === user.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        {msg.senderId === user.id && <img src={user.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder={`Message ${selectedPatient.name}...`}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        aria-label="Message input"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!message.trim()}
                                        className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400"
                                        aria-label="Send message"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
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
            </Card>
        </div>
    );
};

export default Messaging;
