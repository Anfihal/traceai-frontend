// src/stores/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarPosition = 'left' | 'right' | 'top' | 'bottom';
export type Language = 'ru' | 'en' | 'de' | 'fr' | 'es' | 'zh';

interface AppState {
    role: 'analyst' | 'supervisor' | 'admin';
    sidebarPosition: SidebarPosition;
    sidebarWidth: number;
    sidebarHeight: number;
    isSidebarOpen: boolean;
    language: Language;               // <-- добавлено
    setRole: (role: AppState['role']) => void;
    setSidebarPosition: (position: SidebarPosition) => void;
    setSidebarSize: (width: number, height: number) => void;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    setLanguage: (lang: Language) => void; // <-- добавлено
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            role: 'analyst',
            sidebarPosition: 'left',
            sidebarWidth: 320,
            sidebarHeight: 400,
            isSidebarOpen: true,
            language: 'ru',               // <-- значение по умолчанию
            setRole: (role) => set({ role }),
            setSidebarPosition: (position) => set({ sidebarPosition: position }),
            setSidebarSize: (width, height) => set({ sidebarWidth: width, sidebarHeight: height }),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            openSidebar: () => set({ isSidebarOpen: true }),
            closeSidebar: () => set({ isSidebarOpen: false }),
            setLanguage: (lang) => set({ language: lang }), // <-- добавлено
        }),
        {
            name: 'app-storage',
        }
    )
);