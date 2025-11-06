import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Encounter, PatientNote } from '../types';
import { MOCK_ENCOUNTERS } from '../mockData';
import { socketService } from '../services/socketService';

interface EncounterContextType {
  encounter: Encounter | null;
  notes: PatientNote[];
  updateNote: (noteId: string, content: string) => void;
  isSaving: boolean;
  lastSaved: Date | null;
}

const EncounterContext = createContext<EncounterContextType | undefined>(undefined);

export const EncounterProvider: React.FC<{ encounterId: string; children: ReactNode }> = ({ encounterId, children }) => {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const foundEncounter = MOCK_ENCOUNTERS.find(e => e.id === encounterId);
    if (foundEncounter) {
      setEncounter(foundEncounter);
      setNotes(foundEncounter.notes);
    }

    socketService.connect(encounterId);
    socketService.onMessage((data) => {
      if (data.type === 'NOTE_UPDATE') {
        setNotes(prevNotes =>
          prevNotes.map(note => note.id === data.payload.id ? { ...note, content: data.payload.content } : note)
        );
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [encounterId]);

  const updateNote = (noteId: string, content: string) => {
    setIsSaving(true);
    const updatedNotes = notes.map(note => note.id === noteId ? { ...note, content } : note);
    setNotes(updatedNotes);

    socketService.sendMessage({ type: 'UPDATE_NOTE', payload: { id: noteId, content } });

    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  };

  return (
    <EncounterContext.Provider value={{ encounter, notes, updateNote, isSaving, lastSaved }}>
      {children}
    </EncounterContext.Provider>
  );
};

export const useEncounter = () => {
  const context = useContext(EncounterContext);
  if (context === undefined) {
    throw new Error('useEncounter must be used within an EncounterProvider');
  }
  return context;
};