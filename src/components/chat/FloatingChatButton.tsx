import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingChatButton: React.FC = () => {
    const { isOpen, toggleChat } = useChat();

    return (
        <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:scale-105 transition-transform z-[9999] flex items-center justify-center border-none cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
            {isOpen ? <X size={20} className="md:w-6 md:h-6" /> : <MessageCircle size={20} className="md:w-6 md:h-6" />}
        </button>
    );
};