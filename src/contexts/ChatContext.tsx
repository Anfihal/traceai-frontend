import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ChatMode = 'floating' | 'docked';
export type DockedTabId = string | null; // теперь строка

interface ChatState {
    isOpen: boolean;
    mode: ChatMode;
    dockedTab: DockedTabId;
    position: { x: number; y: number };
}

interface ChatContextValue extends ChatState {
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
    setFloating: () => void;
    dockToTab: (tabId: DockedTabId) => void;
    undock: () => void;
    setPosition: (x: number, y: number) => void;
}

const initialState: ChatState = {
    isOpen: false,
    mode: 'floating',
    dockedTab: null,
    position: { x: window.innerWidth - 440, y: window.innerHeight - 560 },
};

const STORAGE_KEY = 'chat_state';

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ChatState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...initialState, ...parsed };
            } catch {
                return initialState;
            }
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const actions = {
        openChat: () => setState((s) => ({ ...s, isOpen: true })),
        closeChat: () => setState((s) => ({ ...s, isOpen: false })),
        toggleChat: () => setState((s) => ({ ...s, isOpen: !s.isOpen })),
        setFloating: () => setState((s) => ({ ...s, mode: 'floating', dockedTab: null })),
        dockToTab: (tabId: DockedTabId) =>
            setState((s) => ({ ...s, mode: 'docked', dockedTab: tabId, isOpen: true })),
        undock: () =>
            setState((s) => ({ ...s, mode: 'floating', dockedTab: null })),
        setPosition: (x: number, y: number) =>
            setState((s) => ({ ...s, position: { x, y } })),
    };

    const value: ChatContextValue = { ...state, ...actions };
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within ChatProvider');
    return context;
};