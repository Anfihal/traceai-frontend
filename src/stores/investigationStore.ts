import { create } from 'zustand';
import { Alert, Context, Hypothesis, Artifacts, Finding } from '@/types';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface InvestigationState {
    sessionId: string | null;
    step: number;
    alert: Alert | null;
    context: Context | null;
    hypotheses: Hypothesis[] | null;
    selectedHypothesisId: string | null;
    artifacts: Artifacts | null;
    report: string | null;
    findings: Finding[];
    actionLog: { time: string; action: string; role: string }[];
    chatMessages: ChatMessage[];
    searchQuery: string;
    isLoading: boolean;
    error: string | null;

    setSessionId: (id: string) => void;
    setStep: (step: number) => void;
    setAlert: (alert: Alert) => void;
    setContext: (context: Context | null) => void;
    setHypotheses: (hypotheses: Hypothesis[] | null) => void;
    setSelectedHypothesisId: (id: string | null) => void;
    setArtifacts: (artifacts: Artifacts | null) => void;
    setReport: (report: string | null) => void;
    setFindings: (findings: Finding[]) => void;          // <-- добавлено
    addFinding: (finding: Finding) => void;
    removeFinding: (id: string) => void;                 // <-- добавлено
    addAction: (action: string) => void;
    reset: () => void;
    addChatMessage: (message: ChatMessage) => void;
    clearChatHistory: () => void;
    setSearchQuery: (query: string) => void;
}

export const useInvestigationStore = create<InvestigationState>((set) => ({
    sessionId: null,
    step: 0,
    alert: null,
    context: null,
    hypotheses: null,
    selectedHypothesisId: null,
    artifacts: null,
    report: null,
    findings: [],
    actionLog: [],
    chatMessages: [],
    searchQuery: '',
    isLoading: false,
    error: null,

    setSessionId: (id) => set({ sessionId: id }),
    setStep: (step) => set({ step }),
    setAlert: (alert) => set({ alert }),
    setContext: (context) => set({ context }),
    setHypotheses: (hypotheses) => set({ hypotheses }),
    setSelectedHypothesisId: (id) => set({ selectedHypothesisId: id }),
    setArtifacts: (artifacts) => set({ artifacts }),
    setReport: (report) => set({ report }),
    setFindings: (findings) => set({ findings }),
    addFinding: (finding) => set((state) => ({ findings: [...state.findings, finding] })),
    removeFinding: (id) => set((state) => ({
        findings: state.findings.filter(f => f.id !== id)
    })),
    addAction: (action) => set((state) => ({
        actionLog: [...state.actionLog, { time: new Date().toISOString(), action, role: state.alert?.user || 'unknown' }]
    })),
    addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, { ...message, timestamp: new Date().toISOString() }]
    })),
    clearChatHistory: () => set({ chatMessages: [] }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    reset: () => set({
        step: 0,
        alert: null,
        context: null,
        hypotheses: null,
        selectedHypothesisId: null,
        artifacts: null,
        report: null,
        findings: [],
        actionLog: [],
        chatMessages: [],
        searchQuery: '',
        isLoading: false,
        error: null,
    }),
}));