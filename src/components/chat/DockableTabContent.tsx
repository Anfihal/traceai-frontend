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
                    ? 'ring-2 ring-indigo-500 ring-offset-2 bg-indigo-50/50 dark:bg-indigo-900/30'
                    : ''
                    }`}
            >
                {children}
            </div>
            {isDockedHere && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Pin size={14} /> Чат-ассистент
                        </span>
                        <button
                            onClick={undock}
                            className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            Открепить
                        </button>
                    </div>
                    <div className="h-[250px] md:h-[300px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <ChatAssistant className="flex flex-col h-full" />
                    </div>
                </div>
            )}
        </TabsContent>
    );
};