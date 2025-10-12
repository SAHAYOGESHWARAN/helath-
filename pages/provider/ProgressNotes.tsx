import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ProgressNote } from '../../types';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';

const getStatusPill = (status: ProgressNote['status']) => {
    switch (status) {
        case 'Signed': return 'bg-emerald-100 text-emerald-800';
        case 'Pending Signature': return 'bg-yellow-100 text-yellow-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
    }
};

const NoteEditorModal: React.FC<{ note: Partial<ProgressNote> | null, onClose: () => void, onSave: (note: Partial<ProgressNote>) => void, isSubmitting: boolean }> = ({ note, onClose, onSave, isSubmitting }) => {
    const [content, setContent] = useState(note?.content || { subjective: '', objective: '', assessment: '', plan: '' });
    
    useEffect(() => {
        setContent(note?.content || { subjective: '', objective: '', assessment: '', plan: '' });
    }, [note]);

    if (!note) return null;

    const handleSave = () => {
        onSave({ ...note, content });
    };

    return (
        <Modal isOpen={!!note} onClose={onClose} title={`Note for ${note.patientName} - ${note.date}`} size="xl">
            <div className="space-y-4">
                {Object.keys(content).map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                        <textarea rows={4} value={content[key as keyof typeof content]} onChange={(e) => setContent(c => ({ ...c, [key]: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                 <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center items-center">
                    {isSubmitting ? <SpinnerIcon/> : (note.id ? 'Save & Sign' : 'Save Draft')}
                </button>
            </div>
        </Modal>
    );
};

const ProgressNotes: React.FC = () => {
    const { progressNotes, addNote, updateNote } = useAuth();
    const { showToast } = useApp();
    const [selectedNote, setSelectedNote] = useState<Partial<ProgressNote> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveNote = (noteData: Partial<ProgressNote>) => {
        setIsSubmitting(true);
        setTimeout(() => {
            if (noteData.id) {
                updateNote({ ...noteData, status: 'Pending Signature' } as ProgressNote);
                showToast('Note updated and is pending signature.', 'success');
            } else {
                addNote(noteData as Omit<ProgressNote, 'id' | 'status'>);
                showToast('Draft saved successfully.', 'success');
            }
            setIsSubmitting(false);
            setSelectedNote(null);
        }, 1000);
    };

    const handleNewNote = () => {
        setSelectedNote({ patientName: '', date: new Date().toISOString().split('T')[0], content: { subjective: '', objective: '', assessment: '', plan: '' } });
    };

    return (
        <div>
            <PageHeader title="Progress Notes" buttonText="New Note" onButtonClick={handleNewNote} />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {progressNotes.map(note => (
                                <tr key={note.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{note.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(note.status)}`}>{note.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedNote(note)} className="text-primary-600 hover:underline">
                                            {note.status === 'Draft' || note.status === 'Pending Signature' ? 'Edit & Sign' : 'View'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <NoteEditorModal note={selectedNote} onClose={() => setSelectedNote(null)} onSave={handleSaveNote} isSubmitting={isSubmitting} />
        </div>
    );
};

export default ProgressNotes;
