import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { TabsContent } from '@/components/ui/tabs';
import { useChat } from '../../contexts/ChatContext';
import { ChatAssistant } from './ChatAssistant';
import { Pin } from 'lucide-react';

interface DockableTabContentProps {
    value: string;
    children: React.ReactNode;
}

export const DockableTabContent: React.FC<DockableTabContentProps> = ({ value, children }) => {
    const { mode, dockedTab, undock, dockToTab } = useChat();
    const isDockedHere = mode === 'docked' && dockedTab === value;

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: 'CHAT_WINDOW',
        drop: () => dockToTab(value),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const ref = useRef<HTMLDivElement>(null);
    drop(ref);

    return (
        <TabsContent value={value} className="relative">
            <div
                ref={ref}
                className={`transition-all duration-200 rounded-lg p-1 ${isOver && canDrop
                    ? 'ring-2 ring-[#20f0e7] ring-offset-2 ring-offset-white dark:ring-offset-[#0d0e13] bg-[#20f0e7]/5 dark:bg-[#20f0e7]/10'
                    : ''
                    }`}
            >
                {children}
            </div>
            {isDockedHere && (
                <div className="mt-4 border-t border-[#dfe2e5] dark:border-[#292b34] pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#676b75] dark:text-[#a3a6af] flex items-center gap-1">
                            <Pin size={14} className="text-[#20f0e7]" /> Чат-ассистент
                        </span>
                        <button
                            onClick={undock}
                            className="text-xs text-[#0bbdb7] hover:text-[#20f0e7] dark:text-[#20f0e7] dark:hover:text-[#0bd6cf] hover:underline transition-colors"
                        >
                            Открепить
                        </button>
                    </div>
                    <div className="h-[250px] md:h-[300px] border border-[#dfe2e5] dark:border-[#292b34] rounded-lg overflow-hidden">
                        <ChatAssistant className="flex flex-col h-full" />
                    </div>
                </div>
            )}
        </TabsContent>
    );
};