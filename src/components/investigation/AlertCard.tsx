import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, User, Monitor, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';

export const AlertCard = () => {
    const { alert } = useInvestigationStore(); // убрали setStep и addAction
    const { t } = useTranslation();
    const { mutate: sendAlert, isPending, error } = useAlert();

    if (!alert) return null;

    const handleCollectContext = () => {
        sendAlert(alert);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <div className="border-l-4 border-danger bg-card rounded-xl shadow-sm p-4 sm:p-6">
                {/* Заголовок */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-danger shrink-0" />
                            {t('current_alert')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.rule}</p>
                    </div>
                    <span className="text-xs bg-muted px-3 py-1 rounded-full self-start">
                        {alert.id}
                    </span>
                </div>

                {/* Детали – сетка с улучшенными отступами */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm shrink-0">{t('src_ip')}:</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm break-all flex-1 min-w-0">
                            {alert.src_ip}
                        </code>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm shrink-0">{t('dst_ip')}:</span>
                        <code className="bg-muted px-2 py-1 rounded text-sm break-all flex-1 min-w-0">
                            {alert.dst_ip}
                        </code>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm shrink-0">{t('user_label')}:</span>
                        <span className="text-sm truncate">{alert.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-sm shrink-0">{t('host_label')}:</span>
                        <span className="text-sm truncate">{alert.host?.name || alert.node}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start gap-2">
                        <div className="flex items-center gap-1 w-full sm:w-auto">
                            <Command className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                            <span className="font-medium text-sm shrink-0">{t('command_label')}:</span>
                        </div>
                        <code className="bg-muted px-2 py-1 rounded text-sm w-full truncate">
                            {alert.cmd?.slice(0, 80)}...
                        </code>
                    </div>
                </div>

                {/* Кнопка действия */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button
                        onClick={handleCollectContext}
                        className="w-full sm:w-auto h-11 px-6 text-base"
                        disabled={isPending}
                    >
                        {isPending ? '⏳ Загрузка...' : t('run_context')}
                    </Button>
                    <span className="text-xs text-muted-foreground text-center sm:text-left">
                        {t('context_info')}
                    </span>
                </div>
                {error && <div className="text-danger text-sm mt-2">Ошибка: {error.message}</div>}
            </div>
        </motion.div>
    );
};