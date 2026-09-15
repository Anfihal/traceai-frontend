import React from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingChatButton: React.FC = () => {
    const { isOpen, toggleChat } = useChat();

    return (
        <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#20f0e7] text-[#06100f] shadow-lg shadow-[#20f0e7]/20 hover:scale-105 hover:bg-[#0bd6cf] transition-all z-[9999] flex items-center justify-center border-none cursor-pointer floating-chat-button"
        >
            {isOpen ? <X size={20} className="md:w-6 md:h-6" /> : <MessageCircle size={20} className="md:w-6 md:h-6" />}
        </button>
    );
};