// src/components/layout/MainLayout.tsx
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { MobileBreadcrumbs } from './MobileBreadcrumbs';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/appStore';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const { t } = useTranslation();
    const { toggleSidebar } = useAppStore();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-background border-b border-border">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-lg font-bold truncate">
                        <span className="hidden sm:inline">{t('page_title')}</span>
                        <span className="sm:inline">{t('page_title_short')}</span>
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <div className="flex flex-1 relative">
                <Sidebar />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-full">
                    <div className="max-w-6xl mx-auto">
                        {/* Глобальный поиск над вкладками */}
                        <GlobalSearch />
                        <MobileBreadcrumbs />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};