
import React, { useState, useMemo } from 'react';
import { getGenAIClient } from '../../services/gemini';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, ProgressNote } from '../../types';
import { SpinnerIcon } from '../../components/shared/Icons';
import { useApp } from '../../contexts/AppContext';
import { Type } from '@google/genai';

interface GenerateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<ProgressNote, 'id'>) => void;
}

type SOAPNote = {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
};

const GenerateNoteModal: React.FC<GenerateNoteModalProps> = ({ isOpen, onClose, onSave }) => {
  const { user: provider, users } = useAuth();
  const { showToast } = useApp();
  const [transcript, setTranscript] = useState('');
  const [generatedNote, setGeneratedNote] = useState<SOAPNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);
  
  const handleGenerate = async () => {
      if (!transcript.trim() || !selectedPatientId) {
          showToast('Please select a patient and provide a transcript.', 'error');
          return;
      }
      setIsLoading(true);
      setGeneratedNote(null);

      try {
          const ai = await getGenAIClient();
          const systemInstruction = "You are a medical scribe AI. Your task is to take a raw transcript of a patient-provider conversation and convert it into a structured SOAP note. The output must be in JSON format with four keys: 'subjective', 'objective', 'assessment', and 'plan'. Ensure the content is professional, concise, and accurately reflects the transcript.";

          const response = await ai.models.generateContent({
              model: 'gemini-2.5-pro',
              contents: `Transcript:\n${transcript}`,
              config: {
                  systemInstruction,
                  responseMimeType: 'application/json',
                  // Use Type enum from @google/genai
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          subjective: { type: Type.STRING, description: "Patient's subjective complaints, history of present illness, and review of systems as stated by the patient." },
                          objective: { type: Type.STRING, description: "Provider's objective findings from physical examination, vital signs, and test results mentioned in the transcript." },
                          assessment: { type: Type.STRING, description: "Provider's diagnosis or assessment of the patient's condition based on the subjective and objective information." },
                          plan: { type: Type.STRING, description: "The treatment plan, including medications, therapies, follow-up instructions, and patient education." }
                      },
                      required: ['subjective', 'objective', 'assessment', 'plan']
                  },
              },
          });

          // Fix: use response.text property, handle potential undefined
          const noteText = (response.text ?? String(response)).trim();
          const parsedNote = JSON.parse(noteText);
          setGeneratedNote(parsedNote);

      } catch (error) {
          console.error("Error generating SOAP note:", error);
          showToast('Failed to generate note. The AI may not have been able to process the transcript. Please try again.', 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleSave = () => {
      const patient = patients.find(p => p.id === selectedPatientId);
      if (!generatedNote || !patient || !provider) return;

      const newNote: Omit<ProgressNote, 'id'> = {
          patientId: patient.id,
          patientName: patient.name,
          providerId: provider.id,
          date: new Date().toISOString().split('T')[0],
          status: 'Draft',
          content: generatedNote
      };
      onSave(newNote);
      handleClose();
  };
  
  const handleClose = () => {
      setTranscript('');
      setGeneratedNote(null);
      setSelectedPatientId('');
      setIsLoading(false);
      onClose();
  };
  
  const handleNoteChange = (section: keyof SOAPNote, value: string) => {
    setGeneratedNote(prev => prev ? { ...prev, [section]: value } : null);
  };

  return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Generate SOAP Note with AI" size="xl">
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                  <select value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="">-- Select a patient --</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
              </div>
              {!generatedNote && (
                <>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Transcript</label>
                      <textarea
                          value={transcript}
                          onChange={e => setTranscript(e.target.value)}
                          rows={10}
                          placeholder="Paste or type the patient conversation transcript here..."
                          className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"
                          disabled={isLoading}
                      />
                  </div>
                  <div className="text-right">
                      <button onClick={handleGenerate} disabled={isLoading || !transcript.trim() || !selectedPatientId} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg w-48 flex justify-center items-center disabled:bg-gray-400">
                          {isLoading ? <SpinnerIcon /> : 'Generate Note'}
                      </button>
                  </div>
                </>
              )}
              {isLoading && !generatedNote && (
                <div className="flex justify-center items-center p-8">
                    <SpinnerIcon className="w-8 h-8"/>
                    <p className="ml-3 text-gray-600">Generating SOAP note, please wait...</p>
                </div>
              )}
              {generatedNote && (
                <div className="space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-lg text-gray-800">Review and Edit Generated Note</h3>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subjective</label>
                        <textarea value={generatedNote.subjective} onChange={e => handleNoteChange('subjective', e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Objective</label>
                        <textarea value={generatedNote.objective} onChange={e => handleNoteChange('objective', e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Assessment</label>
                        <textarea value={generatedNote.assessment} onChange={e => handleNoteChange('assessment', e.target.value)} rows={3} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Plan</label>
                        <textarea value={generatedNote.plan} onChange={e => handleNoteChange('plan', e.target.value)} rows={4} className="w-full p-2 border rounded-md bg-white focus:ring-primary-500 focus:border-primary-500"/>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                        <button onClick={() => setGeneratedNote(null)} className="text-sm font-medium text-gray-600 hover:underline">← Back to Transcript</button>
                        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg">Save as Draft</button>
                    </div>
                </div>
              )}
          </div>
      </Modal>
  );
};

export default GenerateNoteModal;