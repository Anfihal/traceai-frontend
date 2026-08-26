// src/components/search/SearchTab.tsx
import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';

export const SearchTab = () => {
    const { searchQuery, context, hypotheses, artifacts, report } = useInvestigationStore();
    const { t } = useTranslation();

    if (!searchQuery.trim()) {
        return (
            <div className="text-center text-muted-foreground p-8">
                {t('search_empty', 'Введите запрос в поле поиска вверху страницы.')}
            </div>
        );
    }

    const results: string[] = [];
    const query = searchQuery.toLowerCase();

    if (context) {
        const str = JSON.stringify(context).toLowerCase();
        if (str.includes(query)) results.push(t('found_in_context'));
    }
    if (hypotheses) {
        hypotheses.forEach((h) => {
            const str = JSON.stringify(h).toLowerCase();
            if (str.includes(query)) results.push(`${t('found_in_hypothesis')} ${h.id}`);
        });
    }
    if (artifacts) {
        const str = JSON.stringify(artifacts).toLowerCase();
        if (str.includes(query)) results.push(t('found_in_artifacts'));
    }
    if (report) {
        if (report.toLowerCase().includes(query)) results.push(t('found_in_report'));
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">{t('search_results', 'Результаты поиска')}</h3>
            {results.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">{t('nothing_found', 'Ничего не найдено.')}</p>
            )}
        </div>
    );
};