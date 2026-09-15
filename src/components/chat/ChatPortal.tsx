import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDrag } from 'react-dnd';
import { useChat } from '../../contexts/ChatContext';
import { ChatAssistant } from './ChatAssistant';
import { Pin, X, Anchor } from 'lucide-react';

export const ChatPortal: React.FC = () => {
    const {
        isOpen,
        mode,
        position,
        setPosition,
        undock,
        closeChat,
        wasDragged,
        setWasDragged,
    } = useChat();

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const chatRef = useRef<HTMLDivElement>(null);

    const calculateInitialPosition = () => {
        const button = document.querySelector('.floating-chat-button') as HTMLElement;
        if (!button) return null;

        const rect = button.getBoundingClientRect();
        const chatWidth = 480;
        const chatHeight = 600;
        const gap = 12;

        let x = rect.right + gap;
        let y = rect.bottom + gap;

        if (x + chatWidth > window.innerWidth) {
            x = rect.left - chatWidth - gap;
        }
        if (y + chatHeight > window.innerHeight) {
            y = rect.top - chatHeight - gap;
        }

        x = Math.max(gap, Math.min(x, window.innerWidth - chatWidth - gap));
        y = Math.max(gap, Math.min(y, window.innerHeight - chatHeight - gap));

        return { x, y };
    };

    const resetPosition = () => {
        setWasDragged(false);
        const newPos = calculateInitialPosition();
        if (newPos) {
            setPosition(newPos.x, newPos.y);
        }
    };

    useEffect(() => {
        if (isOpen && mode === 'floating' && !wasDragged) {
            const newPos = calculateInitialPosition();
            if (newPos) {
                setPosition(newPos.x, newPos.y);
            }
        }
    }, [isOpen, mode, wasDragged, setPosition]);

    const clampPosition = (x: number, y: number) => {
        const width = chatRef.current?.offsetWidth || 480;
        const height = chatRef.current?.offsetHeight || 600;
        const maxX = Math.max(0, window.innerWidth - width);
        const maxY = Math.max(0, window.innerHeight - height);
        return { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) };
    };

    useEffect(() => {
        const handleResize = () => {
            if (isOpen && mode === 'floating') {
                const clamped = clampPosition(position.x, position.y);
                if (clamped.x !== position.x || clamped.y !== position.y) {
                    setPosition(clamped.x, clamped.y);
                }
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, mode, position, setPosition]);

    const [{ isDragging: isDnDDragging }, drag] = useDrag({
        type: 'CHAT_WINDOW',
        item: { id: 'floating-chat' },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });

    useEffect(() => {
        if (!isDragging) return;

        const onMouseMove = (e: MouseEvent) => {
            if (!chatRef.current) return;
            const rect = chatRef.current.getBoundingClientRect();
            let newX = e.clientX - dragOffset.x;
            let newY = e.clientY - dragOffset.y;
            newX = Math.max(0, Math.min(window.innerWidth - rect.width, newX));
            newY = Math.max(0, Math.min(window.innerHeight - rect.height, newY));
            setPosition(newX, newY);
            setWasDragged(true);
        };

        const onMouseUp = () => setIsDragging(false);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, dragOffset, setPosition, setWasDragged]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!chatRef.current) return;
        const rect = chatRef.current.getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsDragging(true);
    };

    if (!isOpen || mode !== 'floating') return null;

    return ReactDOM.createPortal(
        <div
            ref={(node) => {
                chatRef.current = node;
                if (node) drag(node);
            }}
            className="fixed bg-white dark:bg-[#0d0e13] rounded-xl shadow-2xl shadow-black/20 flex flex-col z-[9998] overflow-hidden border border-[#dfe2e5] dark:border-[#292b34]
                 w-[95vw] max-w-[480px] h-[75vh] max-h-[600px] md:w-[480px] md:h-[600px] transition-all duration-200"
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'default',
                opacity: isDnDDragging ? 0.5 : 1,
            }}
        >
            <div
                className="px-4 py-3 bg-[#f7f7f5] dark:bg-[#15161d] border-b border-[#dfe2e5] dark:border-[#292b34] cursor-grab flex justify-between items-center select-none"
                onMouseDown={handleMouseDown}
            >
                <span className="font-medium text-[#171922] dark:text-[#f7f8fa]">AI Assistant</span>
                <div className="flex gap-1">
                    <button
                        onClick={resetPosition}
                        className="text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7] transition-colors p-1"
                        title="Привязать к иконке"
                    >
                        <Anchor size={16} />
                    </button>
                    <button
                        onClick={undock}
                        className="text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7] transition-colors p-1"
                        title="Открепить"
                    >
                        <Pin size={16} />
                    </button>
                    <button
                        onClick={closeChat}
                        className="text-[#676b75] hover:text-[#ff4d4d] dark:text-[#a3a6af] dark:hover:text-[#ff4d4d] transition-colors p-1"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
                <ChatAssistant className="flex flex-col h-full" hideHeader hideActions />
            </div>
        </div>,
        document.body
    );
};