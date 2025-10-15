
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ProgressNote, User, UserRole } from '../../types';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { SpinnerIcon, SparklesIcon } from '../../components/shared/Icons';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { GoogleGenAI, Type } from '@google/genai';


const getStatusPill = (status: ProgressNote['status']) => {
    switch (status) {
        case 'Signed': return 'bg-emerald-100 text-emerald-800';
        case 'Pending Signature': return 'bg-yellow-100 text-yellow-800';
        case 'Draft': return 'bg-gray-100 text-gray-800';
    }
};

interface NoteFormValues {
    id?: string;
    patientId: string;
    patientName?: string;
    date: string;
    unstructuredNotes: string;
    content: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
}

// --- Form Validation Schema ---
const NoteSchema = Yup.object().shape({
    patientId: Yup.string().required('A patient must be selected.'),
    date: Yup.date().required('Date is required.'),
    content: Yup.object().shape({
        subjective: Yup.string(),
        objective: Yup.string(),
        assessment: Yup.string().required("Assessment is required to save a note."),
        plan: Yup.string().required("Plan is required to save a note."),
    }),
});


// --- Note Editor Modal ---
const NoteEditorModal: React.FC<{ 
    note: Partial<ProgressNote> & { unstructuredNotes?: string } | null; 
    onClose: () => void; 
    onSave: (values: any) => void; 
    isSubmitting: boolean;
    patients: User[];
}> = ({ note, onClose, onSave, isSubmitting, patients }) => {

    if (!note) return null;
    const { showToast } = useApp();
    const [isAiLoading, setIsAiLoading] = useState(false);

    const initialValues: NoteFormValues = {
        id: note.id,
        patientId: note.patientId || '',
        patientName: note.patientName || '',
        date: note.date || new Date().toISOString().split('T')[0],
        unstructuredNotes: note.unstructuredNotes || '',
        content: note.content || { subjective: '', objective: '', assessment: '', plan: '' },
    };
    
    const isEditing = !!note.id;

    const handleGenerateAINote = async (
      text: string, 
      setFieldValue: FormikHelpers<NoteFormValues>['setFieldValue']
    ) => {
        if (!text.trim()) {
            showToast('Please enter some notes for the AI to process.', 'error');
            return;
        }
        setIsAiLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Convert the following clinical notes into a structured SOAP note: "${text}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            subjective: { type: Type.STRING, description: "Patient's subjective complaints." },
                            objective: { type: Type.STRING, description: "Objective findings from exam/labs." },
                            assessment: { type: Type.STRING, description: "Assessment or diagnosis." },
                            plan: { type: Type.STRING, description: "The treatment plan." }
                        }
                    }
                }
            });

            const jsonStr = response.text.trim();
            const soapNote = JSON.parse(jsonStr);

            setFieldValue('content.subjective', soapNote.subjective || '');
            setFieldValue('content.objective', soapNote.objective || '');
            setFieldValue('content.assessment', soapNote.assessment || '');
            setFieldValue('content.plan', soapNote.plan || '');
            showToast('SOAP note generated successfully!', 'success');

        } catch (error) {
            console.error("AI Scribe Error:", error);
            showToast('Failed to generate AI note. Please try again.', 'error');
        } finally {
            setIsAiLoading(false);
        }
    };

    const contentKeys: (keyof ProgressNote['content'])[] = ['subjective', 'objective', 'assessment', 'plan'];

    return (
        <Modal 
            isOpen={!!note} 
            onClose={onClose} 
            title={isEditing ? `Note for ${note.patientName} - ${note.date}` : 'Create New Progress Note'} 
            size="xl"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={NoteSchema}
                onSubmit={onSave}
                enableReinitialize
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
                                <Field as="select" id="patientId" name="patientId" disabled={isEditing} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'} ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
                                    <option value="">Select a patient...</option>
                                    {patients.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                                </Field>
                                <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date of Service</label>
                                <Field type="date" id="date" name="date" disabled={isEditing} className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.date && touched.date ? 'border-red-500' : 'border-gray-300'} ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                                <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="unstructuredNotes" className="block text-sm font-medium text-gray-700">AI Scribe Input</label>
                             <Field as="textarea" id="unstructuredNotes" name="unstructuredNotes" rows={4} className="mt-1 block w-full p-2 border rounded-md" placeholder="Enter unstructured notes here, then click the AI Scribe button..." />
                             <button type="button" onClick={() => handleGenerateAINote(values.unstructuredNotes, setFieldValue)} disabled={isAiLoading} className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-accent px-4 py-2 rounded-lg shadow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait">
                                {isAiLoading ? <SpinnerIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                                {isAiLoading ? 'Generating...' : 'AI Scribe: Create SOAP Note'}
                            </button>
                        </div>
                        
                        <div className="border-t pt-4 space-y-4">
                            {contentKeys.map((key) => (
                                <div key={key}>
                                    <label htmlFor={`content.${key}`} className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                    <Field as="textarea" id={`content.${key}`} name={`content.${key}`} rows={key === 'subjective' || key === 'objective' ? 3 : 5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder={key === 'subjective' ? 'Patient reports...' : key === 'objective' ? 'Vitals, exam findings...' : key === 'assessment' ? 'Diagnosis or impression...' : 'Treatment plan, prescriptions, follow-up...'}/>
                                    <ErrorMessage name={`content.${key}`} component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                                {isSubmitting ? <SpinnerIcon/> : (isEditing ? 'Save & Sign' : 'Save Draft')}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};


const ProgressNotes: React.FC = () => {
    const { user, users, progressNotes, addNote, updateNote } = useAuth();
    const { showToast } = useApp();
    const [selectedNote, setSelectedNote] = useState<Partial<ProgressNote> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const providerPatients = useMemo(() => {
        if (!user) return [];
        return users.filter(u => u.role === UserRole.PATIENT && u.state === user.state);
    }, [users, user]);

    const handleSaveNote = (values: any) => {
        setIsSubmitting(true);
        setTimeout(() => {
            if (values.id) { // Editing existing note
                const noteToUpdate = { ...values, status: 'Pending Signature' };
                updateNote(noteToUpdate as ProgressNote);
                showToast('Note updated and is pending signature.', 'success');
            } else { // Creating new note
                const patient = providerPatients.find(p => p.id === values.patientId);
                if (!patient) {
                    showToast('Could not find selected patient.', 'error');
                    setIsSubmitting(false);
                    return;
                }
                const noteData = {
                    patientId: patient.id,
                    patientName: patient.name,
                    date: values.date,
                    content: values.content
                };
                addNote(noteData);
                showToast('Draft saved successfully.', 'success');
            }
            setIsSubmitting(false);
            setSelectedNote(null);
        }, 1000);
    };

    const handleNewNote = () => {
        setSelectedNote({ 
            patientId: '', 
            patientName: '', 
            date: new Date().toISOString().split('T')[0], 
            content: { subjective: '', objective: '', assessment: '', plan: '' } 
        });
    };
    
    const getPatientAvatar = (patientId: string) => {
        const patient = users.find(u => u.id === patientId);
        return patient?.avatarUrl || `https://i.pravatar.cc/150?u=${patientId}`;
    };

    return (
        <div>
            <PageHeader title="Progress Notes" buttonText="New Note" onButtonClick={handleNewNote} />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {progressNotes.map(note => (
                                <tr key={note.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={getPatientAvatar(note.patientId)} alt="Patient" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{note.patientName}</div>
                                                <div className="text-sm text-gray-500">ID: {note.patientId}</div>
                                            </div>
                                        </div>
                                    </td>
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
            <NoteEditorModal 
                note={selectedNote} 
                onClose={() => setSelectedNote(null)} 
                onSave={handleSaveNote} 
                isSubmitting={isSubmitting}
                patients={providerPatients}
            />
        </div>
    );
};

export default ProgressNotes;