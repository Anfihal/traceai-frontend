import { useState } from 'react';
import { motion } from 'framer-motion';

interface RagBookToggleProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export const RagBookToggle = ({ checked, onCheckedChange }: RagBookToggleProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        onCheckedChange(!checked);
    };

    return (
        <div
            className="relative flex items-center justify-center w-16 h-16 cursor-pointer"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="switch"
            aria-checked={checked}
            aria-label="RAG mode toggle"
        >
            {/* Полка (линия под книгой) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-muted-foreground/30 rounded-full" />

            {/* Книга: состоит из обложки и двух страниц */}
            <motion.div
                className="relative w-8 h-10 origin-bottom"
                animate={{
                    rotateX: checked ? 0 : 60, // стоя (0°) или лежа (60°)
                    y: checked ? -4 : 2, // немного поднимаем, когда стоит
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                }}
            >
                {/* Обложка (задняя) */}
                <div
                    className={`absolute inset-0 rounded-sm border-2 border-primary/30 bg-card shadow-md transition-colors ${checked ? 'border-primary' : 'border-muted'
                        }`}
                    style={{ transform: 'translateZ(-2px)' }}
                />
                {/* Страница 1 (передняя) */}
                <div
                    className="absolute inset-0 rounded-sm border-2 border-primary/20 bg-background shadow-sm transition-colors"
                    style={{ transform: 'translateZ(1px) rotateY(-2deg)' }}
                />
                {/* Страница 2 (самая передняя) */}
                <div
                    className="absolute inset-0 rounded-sm border-2 border-primary/10 bg-background transition-colors"
                    style={{ transform: 'translateZ(3px) rotateY(2deg)' }}
                />
                {/* Корешок (имитация) */}
                <div
                    className="absolute left-0 top-1 bottom-1 w-1 rounded-l-sm bg-primary/40 transition-colors"
                    style={{ transform: 'translateX(-2px)' }}
                />
            </motion.div>

            {/* Интерактивный тултип (подсказка) */}
            {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    {checked ? 'RAG включён' : 'RAG выключен'}
                </div>
            )}
        </div>
    );
};