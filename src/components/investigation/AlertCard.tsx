import { useInvestigationStore } from '@/stores/investigationStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, User, Monitor, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AlertCard = () => {
    const { alert, setStep, setLoading, setError, addAction } = useInvestigationStore();
    const { t } = useTranslation();

    if (!alert) return null;

    const handleCollectContext = async () => {
        setLoading(true);
        try {
            setTimeout(() => {
                setStep(1);
                addAction(t('run_context'));
                setLoading(false);
            }, 1000);
        } catch {
            setError(t('context_error'));
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="border-l-4 border-danger bg-card rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-danger" />
                            {t('current_alert')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.rule}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded self-start">{alert.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium text-sm">{t('src_ip')}:</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-sm break-all">{alert.src_ip}</code>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium text-sm">{t('dst_ip')}:</span>
                        <code className="bg-muted px-2 py-0.5 rounded text-sm break-all">{alert.dst_ip}</code>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{t('user_label')}:</span>
                        <span className="text-sm">{alert.user}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                        <Monitor className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{t('host_label')}:</span>
                        <span className="text-sm">{alert.host?.name || alert.node}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-start gap-1">
                        <div className="flex items-start gap-1 w-full">
                            <Command className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="font-medium text-sm whitespace-nowrap">{t('command_label')}:</span>
                        </div>
                        <code className="bg-muted px-2 py-0.5 rounded text-sm w-full truncate">
                            {alert.cmd?.slice(0, 80)}...
                        </code>
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                    <Button onClick={handleCollectContext} className="w-full sm:w-auto">
                        {t('run_context')}
                    </Button>
                    <span className="text-xs text-muted-foreground text-center sm:text-left">{t('context_info')}</span>
                </div>
            </div>
        </motion.div>
    );
};