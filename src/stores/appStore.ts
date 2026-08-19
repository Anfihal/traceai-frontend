import { create } from 'zustand';

interface AppState {
    language: string;
    role: string;
    setLanguage: (lang: string) => void;
    setRole: (role: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    language: 'ru',
    role: 'analyst',
    setLanguage: (lang) => set({ language: lang }),
    setRole: (role) => set({ role: role }),
}));