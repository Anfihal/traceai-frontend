// src/components/search/GlobalSearch.tsx
import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const GlobalSearch = () => {
    const { searchQuery, setSearchQuery } = useInvestigationStore();
    const { t } = useTranslation();

    return (
        <div className="relative w-full max-w-md mx-auto mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder={t('search_placeholder_global', 'Поиск по всему инциденту...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm"
            />
        </div>
    );
};