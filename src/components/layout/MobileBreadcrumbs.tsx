import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';

const stepLabels = ['step_0', 'step_1', 'step_2', 'step_3', 'step_4'];

export const MobileBreadcrumbs = () => {
    const { step } = useInvestigationStore();
    const { t } = useTranslation();

    const stepNames = [
        t('alert'),
        t('context'),
        t('hypotheses'),
        t('artifacts'),
        t('report')
    ];

    return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground sm:hidden py-1 px-2 bg-muted/30 rounded-md">
            <span>{t(stepLabels[step])}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">
                {stepNames[step]}
            </span>
        </div>
    );
};