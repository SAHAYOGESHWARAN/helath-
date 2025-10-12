
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ProgressNote } from '../../types';
import Modal from '../../components/shared/Modal';

const mockNotes: ProgressNote[] = [
  { id: 'pn1', patientId: 'p1', patientName: 'John Doe', date: '2024-08-01', status: 'Signed', content: { subjective: 'Patient reports feeling well.', objective: 'Vitals stable.', assessment: 'Stable hypertension.', plan: 'Continue current medication.' } },
  { id: 'pn2', patientId: 'p2', patientName: 'Alice Johnson', date: '2024-07-15', status: 'Pending Signature', content: { subjective: 'Follow-up visit.', objective: 'Blood pressure 110/70.', assessment: 'Condition improving.', plan: 'Follow up in 3 months.' } },
  { id: 'pn3', patientId: 'p4', patientName: 'Charlie Brown', date: '2024-08-10', status: 'Draft', content: { subjective: 'Patient complains of cough.', objective: '', assessment: '', plan: '' } },
];

const getStatusPill = (status: ProgressNote['status']) => {
    switch (status) {
        case 'Signed': return 'bg-emerald-100 text-emerald-800';
        case 'Pending Signature': return 'bg-yellow-100 text-yellow-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
    }
};

const NoteEditorModal: React.FC<{ note: ProgressNote | null, onClose: () => void, onSave: (note: ProgressNote) => void }> = ({ note, onClose, onSave }) => {
    const [content, setContent] = useState(note?.content || { subjective: '', objective: '', assessment: '', plan: '' });

    if (!note) return null;

    const handleSave = () => {
        onSave({ ...note, content });
        onClose();
    };

    return (
        <Modal isOpen={!!note} onClose={onClose} title={`Note for ${note.patientName} - ${note.date}`} size="xl">
            <div className="space-y-4">
                {Object.keys(content).map((key) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                        <textarea
                            rows={4}
                            value={content[key as keyof typeof content]}
                            onChange={(e) => setContent(c => ({ ...c, [key]: e.target.value }))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save & Sign</button>
            </div>
        </Modal>
    );
};

const ProgressNotes: React.FC = () => {
    const [notes, setNotes] = useState(mockNotes);
    const [selectedNote, setSelectedNote] = useState<ProgressNote | null>(null);

    const handleSaveNote = (updatedNote: ProgressNote) => {
        setNotes(notes.map(n => n.id === updatedNote.id ? { ...updatedNote, status: 'Pending Signature' } : n));
    };

    return (
        <div>
            <PageHeader title="Progress Notes" buttonText="New Note" onButtonClick={() => { /* Logic to create a new note */ }} />
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
                            {notes.map(note => (
                                <tr key={note.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{note.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(note.status)}`}>{note.status}</span>
                                    </td>
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
            <NoteEditorModal note={selectedNote} onClose={() => setSelectedNote(null)} onSave={handleSaveNote} />
        </div>
    );
};

export default ProgressNotes;
