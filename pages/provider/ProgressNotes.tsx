import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ProgressNote } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { DocumentTextIcon, SparklesIcon } from '../../components/shared/Icons';
import GenerateNoteModal from './GenerateNoteModal';
import { useApp } from '../../contexts/AppContext';

const getStatusPill = (status: ProgressNote['status']) => {
    switch (status) {
        case 'Signed': return 'bg-emerald-100 text-emerald-800';
        case 'Pending Signature': return 'bg-yellow-100 text-yellow-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
    }
};

const ProgressNotes: React.FC = () => {
    const { progressNotes, addProgressNote } = useAuth();
    const { showToast } = useApp();
    const [selectedNote, setSelectedNote] = useState<ProgressNote | null>(progressNotes.length > 0 ? progressNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const filteredNotes = useMemo(() => 
        progressNotes.filter(note => 
            note.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [progressNotes, searchTerm]);

    const handleSaveNote = (note: Omit<ProgressNote, 'id'>) => {
        addProgressNote(note);
        showToast(`Draft note for ${note.patientName} has been saved.`, 'success');
        setIsAiModalOpen(false);
    }

    return (
        <div>
            <PageHeader title="Progress Notes">
                <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" fill="currentColor" />
                    <span>Generate with AI</span>
                </button>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-14rem)]">
                <Card className="lg:col-span-1 p-0 flex flex-col">
                    <div className="p-4 border-b">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary-300"
                        />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    onClick={() => setSelectedNote(note)}
                                    className={`p-4 border-b cursor-pointer ${selectedNote?.id === note.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800">{note.patientName}</p>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusPill(note.status)}`}>
                                            {note.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">{note.date}</p>
                                </div>
                            ))
                        ) : (
                             <div className="p-4 text-center text-gray-500 text-sm h-full flex flex-col justify-center items-center">
                                <DocumentTextIcon className="w-12 h-12 text-gray-300 mb-2" />
                                <p className="font-semibold">No Notes Found</p>
                                <p>Create a new note to get started.</p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="lg:col-span-2 flex flex-col">
                    {selectedNote ? (
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedNote.patientName}</h2>
                                    <p className="text-gray-500">{selectedNote.date}</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-2">
                                <div>
                                    <h3 className="font-bold text-gray-700">Subjective</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.subjective}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Objective</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.objective}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Assessment</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.assessment}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700">Plan</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.plan}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center self-center">
                            <p className="text-gray-500">Select a note to view its details.</p>
                        </div>
                    )}
                </Card>
            </div>
            <GenerateNoteModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onSave={handleSaveNote} />
        </div>
    );
};

export default ProgressNotes;