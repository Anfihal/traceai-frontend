import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { MobileBreadcrumbs } from './MobileBreadcrumbs';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Хедер */}
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-background border-b border-border">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden h-10 w-10"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                    <h1 className="text-lg font-bold truncate">
                        <span className="hidden sm:inline">{t('page_title')}</span>
                        <span className="sm:hidden">SOC</span>
                    </h1>
                </div>
                <ThemeToggle />
            </header>

            <div className="flex flex-1 relative">
                {/* Оверлей */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 sm:hidden overlay-transition"
                        onClick={closeSidebar}
                    />
                )}

                {/* Сайдбар */}
                <aside
                    className={`
            fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r border-border z-30
            transform transition-transform duration-300 ease-in-out
            sm:relative sm:translate-x-0 sm:z-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
                >
                    <Sidebar onClose={closeSidebar} />
                </aside>

                {/* Контент */}
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-full">
                    <div className="max-w-6xl mx-auto">
                        <MobileBreadcrumbs />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};