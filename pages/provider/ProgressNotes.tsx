
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { ProgressNote } from '../../types';
import { SearchIcon, PencilAltIcon } from '../../components/shared/Icons';

const mockNotes: ProgressNote[] = [
    { id: 'note1', patientId: 'p1', patientName: 'John Doe', date: '2024-08-15', status: 'Signed', content: { subjective: 'Patient reports feeling well.', objective: 'BP 120/80, HR 72.', assessment: 'Stable.', plan: 'Continue current medications.' } },
    { id: 'note2', patientId: 'p2', patientName: 'Alice Johnson', date: '2024-08-15', status: 'Pending Signature', content: { subjective: 'Follow-up for seasonal allergies.', objective: 'Mild congestion.', assessment: 'Allergic rhinitis.', plan: 'Prescribed Loratadine.' } },
    { id: 'note3', patientId: 'p4', patientName: 'Charlie Brown', date: '2024-08-14', status: 'Draft', content: { subjective: 'Patient complains of sore throat.', objective: '', assessment: '', plan: '' } },
    { id: 'note4', patientId: 'p5', patientName: 'Diana Prince', date: '2024-08-12', status: 'Signed', content: { subjective: 'Routine physical exam.', objective: 'All systems normal.', assessment: 'Healthy.', plan: 'Return in 1 year.' } },
];

const NOTE_TEMPLATES = {
    'SOAP': { subjective: 'Chief Complaint:\n\nHistory of Present Illness:\n\nReview of Systems:\n', objective: 'Vital Signs:\n\nPhysical Exam:\n', assessment: 'Primary Diagnosis:\n\nSecondary Diagnosis:\n', plan: 'Medications:\n\nFollow-up:\n' },
    'Annual Physical': { subjective: 'Here for annual physical. No complaints.', objective: 'Vital signs stable. Exam unremarkable.', assessment: 'Healthy adult.', plan: 'Routine labs ordered. Follow up in 1 year.' },
};

const getStatusColor = (status: 'Draft' | 'Pending Signature' | 'Signed') => {
    if (status === 'Signed') return 'bg-emerald-100 text-emerald-800';
    if (status === 'Pending Signature') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
};

const NoteEditorModal: React.FC<{ note: ProgressNote | null; onClose: () => void; onSave: (note: ProgressNote) => void }> = ({ note, onClose, onSave }) => {
    const [editedNote, setEditedNote] = useState(note);
    if (!editedNote) return null;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedNote(prev => ({...prev!, content: {...prev!.content, [name]: value}}));
    };
    
    const applyTemplate = (templateName: keyof typeof NOTE_TEMPLATES) => {
        setEditedNote(prev => ({...prev!, content: NOTE_TEMPLATES[templateName] }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 p-6 animate-slide-in-up h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Note for {editedNote.patientName}</h2>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">Template:</label>
                        <select onChange={(e) => applyTemplate(e.target.value as keyof typeof NOTE_TEMPLATES)} className="text-sm border-gray-300 rounded-md">
                            <option value="">None</option>
                            <option value="SOAP">SOAP Note</option>
                            <option value="Annual Physical">Annual Physical</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                    <div>
                        <label className="font-semibold text-gray-700">Subjective</label>
                        <textarea name="subjective" value={editedNote.content.subjective} onChange={handleChange} rows={4} className="w-full p-2 border rounded mt-1"></textarea>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Objective</label>
                        <textarea name="objective" value={editedNote.content.objective} onChange={handleChange} rows={4} className="w-full p-2 border rounded mt-1"></textarea>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Assessment</label>
                        <textarea name="assessment" value={editedNote.content.assessment} onChange={handleChange} rows={4} className="w-full p-2 border rounded mt-1"></textarea>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Plan</label>
                        <textarea name="plan" value={editedNote.content.plan} onChange={handleChange} rows={4} className="w-full p-2 border rounded mt-1"></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={() => onSave(editedNote)} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Draft</button>
                </div>
            </div>
        </div>
    );
};

const ProgressNotes: React.FC = () => {
    const [notes, setNotes] = useState(mockNotes);
    const [selectedNote, setSelectedNote] = useState<ProgressNote | null>(notes[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const filteredNotes = useMemo(() =>
        notes.filter(note =>
            note.patientName.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [notes, searchTerm]
    );

    const handleSaveNote = (updatedNote: ProgressNote) => {
        setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
        setSelectedNote(updatedNote);
        setIsEditing(false);
    };
    
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Progress Notes</h1>
             <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <PencilAltIcon className="w-5 h-5"/>
                <span>Create New Note</span>
            </button>
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
        <Card className="lg:col-span-1 p-0 flex flex-col">
            <div className="p-4 border-b">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-primary-300"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {filteredNotes.map(note => (
                    <div 
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className={`p-4 border-b cursor-pointer ${selectedNote?.id === note.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-gray-800">{note.patientName}</p>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(note.status)}`}>{note.status}</span>
                        </div>
                        <p className="text-sm text-gray-500">{note.date}</p>
                    </div>
                ))}
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
                        <div className="flex space-x-2">
                             <button onClick={() => setIsEditing(true)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Edit</button>
                             {selectedNote.status !== 'Signed' && (
                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">Sign Note</button>
                             )}
                        </div>
                    </div>
                    <div className="mt-4 space-y-4 overflow-y-auto flex-1 pr-2">
                        <div><h3 className="font-bold text-gray-700">Subjective</h3><p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.subjective}</p></div>
                        <div><h3 className="font-bold text-gray-700">Objective</h3><p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.objective}</p></div>
                        <div><h3 className="font-bold text-gray-700">Assessment</h3><p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.assessment}</p></div>
                        <div><h3 className="font-bold text-gray-700">Plan</h3><p className="text-gray-600 whitespace-pre-wrap">{selectedNote.content.plan}</p></div>
                    </div>
                </div>
            ) : (
                <div className="text-center self-center">
                    <p className="text-gray-500">Select a note to view its details.</p>
                </div>
            )}
        </Card>
      </div>
      {isEditing && selectedNote && <NoteEditorModal note={selectedNote} onClose={() => setIsEditing(false)} onSave={handleSaveNote} />}
    </div>
  );
};

export default ProgressNotes;