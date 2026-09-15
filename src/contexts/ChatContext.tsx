import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChatMode = 'floating' | 'docked';
export type DockedTabId = string | null;

interface ChatState {
    isOpen: boolean;
    mode: ChatMode;
    dockedTab: DockedTabId;
    position: { x: number; y: number };
    wasDragged: boolean;
    pendingPrompt: string | null; // <-- для предзаполнения из гипотез
}

interface ChatContextValue extends ChatState {
    openChat: (prefill?: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
    setFloating: () => void;
    dockToTab: (tabId: DockedTabId) => void;
    undock: () => void;
    setPosition: (x: number, y: number) => void;
    setWasDragged: (value: boolean) => void;
    consumePendingPrompt: () => string | null;
}

const initialState: ChatState = {
    isOpen: false,
    mode: 'floating',
    dockedTab: null,
    position: { x: window.innerWidth - 440, y: window.innerHeight - 560 },
    wasDragged: false,
    pendingPrompt: null,
};

const STORAGE_KEY = 'chat_state';

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ChatState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // pendingPrompt не храним в localStorage
                const { pendingPrompt, ...rest } = parsed;
                return { ...initialState, ...rest };
            } catch {
                return initialState;
            }
        }
        return initialState;
    });

    useEffect(() => {
        // сохраняем всё, кроме pendingPrompt
        const { pendingPrompt, ...toSave } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }, [state]);

    const actions = {
        openChat: (prefill?: string) =>
            setState((s) => ({
                ...s,
                isOpen: true,
                mode: 'floating',
                pendingPrompt: prefill ?? s.pendingPrompt,
            })),
        closeChat: () => setState((s) => ({ ...s, isOpen: false })),
        toggleChat: () => setState((s) => ({ ...s, isOpen: !s.isOpen })),
        setFloating: () =>
            setState((s) => ({ ...s, mode: 'floating', dockedTab: null })),
        dockToTab: (tabId: DockedTabId) =>
            setState((s) => ({ ...s, mode: 'docked', dockedTab: tabId, isOpen: true })),
        undock: () =>
            setState((s) => ({ ...s, mode: 'floating', dockedTab: null })),
        setPosition: (x: number, y: number) =>
            setState((s) => ({ ...s, position: { x, y } })),
        setWasDragged: (value: boolean) =>
            setState((s) => ({ ...s, wasDragged: value })),
        consumePendingPrompt: (): string | null => {
            const p = state.pendingPrompt;
            if (p) setState((s) => ({ ...s, pendingPrompt: null }));
            return p;
        },
    };

    const value: ChatContextValue = { ...state, ...actions };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};