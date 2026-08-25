import { create } from 'zustand';

export interface LLMProvider {
    id: string;
    name: string;
    type: 'ollama' | 'openai' | 'anthropic' | 'g4f' | 'custom';
    model: string;
    baseUrl?: string;
    apiKey?: string;
}

interface LLMState {
    ragMode: boolean;
    providers: LLMProvider[];
    selectedProviderId: string | null;
    // Методы
    setRagMode: (enabled: boolean) => void;
    setSelectedProviderId: (id: string | null) => void;
    addProvider: (provider: LLMProvider) => void;
    removeProvider: (id: string) => void;
}

export const useLLMStore = create<LLMState>((set) => ({
    ragMode: false,
    providers: [
        { id: 'ollama-llama3', name: 'Ollama (Llama 3)', type: 'ollama', model: 'llama3', baseUrl: 'http://localhost:11434' },
        { id: 'ollama-mistral', name: 'Ollama (Mistral)', type: 'ollama', model: 'mistral', baseUrl: 'http://localhost:11434' },
        { id: 'openai-gpt4', name: 'OpenAI GPT-4', type: 'openai', model: 'gpt-4', baseUrl: 'https://api.openai.com/v1' },
        { id: 'openai-gpt35', name: 'OpenAI GPT-3.5 Turbo', type: 'openai', model: 'gpt-3.5-turbo', baseUrl: 'https://api.openai.com/v1' },
        { id: 'anthropic-sonnet', name: 'Anthropic Claude 3.5 Sonnet', type: 'anthropic', model: 'claude-3-5-sonnet-20241022', baseUrl: 'https://api.anthropic.com/v1' },
        { id: 'anthropic-opus', name: 'Anthropic Claude 3 Opus', type: 'anthropic', model: 'claude-3-opus-20240229', baseUrl: 'https://api.anthropic.com/v1' },
        { id: 'g4f-gpt4o', name: 'G4F (GPT-4o бесплатно)', type: 'g4f', model: 'gpt-4o' },
        { id: 'g4f-deepseek', name: 'G4F (DeepSeek V3)', type: 'g4f', model: 'deepseek-v3' },
        { id: 'g4f-gemini', name: 'G4F (Gemini 2.0 Flash)', type: 'g4f', model: 'gemini-2.0-flash' },
        { id: 'g4f-grok', name: 'G4F (Grok-2)', type: 'g4f', model: 'grok-2' },
    ],
    selectedProviderId: 'ollama-llama3',

    setRagMode: (enabled) => set({ ragMode: enabled }),
    setSelectedProviderId: (id) => set({ selectedProviderId: id }),
    addProvider: (provider) => set((state) => ({ providers: [...state.providers, provider] })),
    removeProvider: (id) => set((state) => ({ providers: state.providers.filter(p => p.id !== id) })),
}));