import { create } from 'zustand';
import { Encounter } from '@/types';

interface EncounterState {
  encounters: Encounter[];
  setEncounters: (encounters: Encounter[]) => void;
}

export const useEncounterStore = create<EncounterState>((set) => ({
  encounters: [],
  setEncounters: (encounters) => set({ encounters }),
}));
