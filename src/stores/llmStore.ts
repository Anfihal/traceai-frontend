import { create } from 'zustand';

interface LLMState {
    ragMode: boolean;
    toggleRag: () => void;
}

export const useLLMStore = create<LLMState>((set) => ({
    ragMode: false,
    toggleRag: () => set((state) => ({ ragMode: !state.ragMode })),
}));