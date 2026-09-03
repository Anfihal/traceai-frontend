import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, User, Monitor, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import { ContextualTips } from '@/components/ui/ContextualTips';

export const AlertCard = () => {
    const { alert } = useInvestigationStore();
    const { t } = useTranslation();
    const { mutate: sendAlert, isPending, error } = useAlert();

    if (!alert) return null;

    const handleStartInvestigation = () => {
        sendAlert(alert);
    };

    return (
        <>
            <ContextualTips />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <div className="border-l-4 border-danger bg-card rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                            <h3 className="text-base sm:text-xl font-bold flex items-center gap-2">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-danger shrink-0" />
                                {t('current_alert')}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{alert.rule}</p>
                        </div>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full self-start whitespace-nowrap">
                            {alert.id}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5">
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-xs sm:text-sm">{t('src_ip')}:</span>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm break-all">{alert.src_ip}</code>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="font-medium text-xs sm:text-sm">{t('dst_ip')}:</span>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm break-all">{alert.dst_ip}</code>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-medium text-xs sm:text-sm">{t('user_label')}:</span>
                            <span className="text-xs sm:text-sm truncate">{alert.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-medium text-xs sm:text-sm">{t('host_label')}:</span>
                            <span className="text-xs sm:text-sm truncate">{alert.host?.name || alert.node}</span>
                        </div>
                        <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start gap-1">
                            <div className="flex items-start gap-1 w-full">
                                <Command className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{t('command_label')}:</span>
                            </div>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm w-full truncate">
                                {alert.cmd?.slice(0, 60)}...
                            </code>
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                        <Button
                            onClick={handleStartInvestigation}
                            className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                            disabled={isPending}
                        >
                            {isPending ? '⏳ Загрузка...' : 'Начать расследование'}
                        </Button>
                        <span className="text-xs text-muted-foreground text-center sm:text-left">
                            {t('context_info')}
                        </span>
                    </div>
                    {error && <div className="text-danger text-xs sm:text-sm mt-2">Ошибка: {error.message}</div>}
                </div>
            </motion.div>
        </>
    );
};