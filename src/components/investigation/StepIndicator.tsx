import { useInvestigationStore } from '@/stores/investigationStore';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const steps = [
    { id: 0, labelKey: 'step_0' },
    { id: 1, labelKey: 'step_1' },
    { id: 2, labelKey: 'step_2' },
    { id: 3, labelKey: 'step_3' },
    { id: 4, labelKey: 'step_4' },
];

export const StepIndicator = () => {
    const { step } = useInvestigationStore();
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto py-3 px-2 sm:px-6">
            {steps.map((s, idx) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                    <div key={s.id} className="flex items-center flex-1">
                        {/* Шаг: иконка + текст (центрированы по горизонтали) */}
                        <div className="flex flex-col items-center flex-1">
                            <motion.div
                                className={`
                  w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 
                  flex items-center justify-center text-xs sm:text-sm
                  ${isActive ? 'border-primary bg-primary/10' : ''}
                  ${isCompleted ? 'border-success bg-success/10' : ''}
                  ${!isActive && !isCompleted ? 'border-muted' : ''}
                `}
                                animate={{ scale: isActive ? 1.1 : 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-success" />
                                ) : isActive ? (
                                    <Loader2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary animate-spin" />
                                ) : (
                                    <Circle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-muted-foreground" />
                                )}
                            </motion.div>
                            <span className="text-[8px] sm:text-xs mt-1 font-medium text-muted-foreground text-center hidden sm:block">
                                {t(s.labelKey)}
                            </span>
                        </div>

                        {/* Линия между шагами */}
                        {idx < steps.length - 1 && (
                            <div
                                className={`
                  flex-1 h-0.5 mx-1 sm:mx-2
                  ${step > s.id ? 'bg-success' : 'bg-muted'}
                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};