import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CustomProvider = {
    id: string;
    name: string;
    type: 'custom';
    model: string;
    baseUrl: string;
    apiKey?: string;
};

interface LLMState {
    ragMode: boolean;
    setRagMode: (v: boolean) => void;

    // Только пользовательские провайдеры.
    // Ollama-модели приходят с бэка через useAvailableProviders.
    customProviders: CustomProvider[];
    addCustomProvider: (p: CustomProvider) => void;
    removeCustomProvider: (id: string) => void;

    selectedProviderId: string | null;
    setSelectedProviderId: (id: string) => void;
}

export const useLLMStore = create<LLMState>()(
    persist(
        (set) => ({
            ragMode: false,
            setRagMode: (v) => set({ ragMode: v }),

            customProviders: [],
            addCustomProvider: (p) =>
                set((state) => ({ customProviders: [...state.customProviders, p] })),
            removeCustomProvider: (id) =>
                set((state) => ({
                    customProviders: state.customProviders.filter((p) => p.id !== id),
                    selectedProviderId:
                        state.selectedProviderId === id ? null : state.selectedProviderId,
                })),

            selectedProviderId: null,
            setSelectedProviderId: (id) => set({ selectedProviderId: id }),
        }),
        {
            name: 'traceai-llm-store',
            partialize: (state) => ({
                ragMode: state.ragMode,
                customProviders: state.customProviders,
                selectedProviderId: state.selectedProviderId,
            }),
        }
    )
);