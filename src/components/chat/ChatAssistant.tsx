import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useInvestigationStore, ChatMessage } from '@/stores/investigationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Loader2,
    Copy,
    Download,
    Trash2,
    Send,
    PlusCircle,
    Eye,
    EyeOff,
    MoreHorizontal,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { ContextDisplay } from './ContextDisplay';
import { Hypothesis } from '@/types';

interface ChatAssistantProps {
    className?: string;
    hideHeader?: boolean;
    hideActions?: boolean;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
    className = '',
    hideHeader = false,
    hideActions = false,
}) => {
    const {
        chatMessages,
        clearChatHistory,
        context,
        hypotheses,
        selectedHypothesisId,
        artifacts,
        alert,
    } = useInvestigationStore();
    const [input, setInput] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { mutate: sendMessage, isPending } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const addContextToInput = () => {
        let ctxText = '';
        if (alert) {
            ctxText += `🔍 Алерт: ${alert.rule}\n`;
            ctxText += `  Пользователь: ${alert.user || 'неизвестен'}\n`;
            ctxText += `  Источник: ${alert.src_ip || 'N/A'} -> Цель: ${alert.dst_ip || 'N/A'}\n`;
        }
        if (context) {
            ctxText += `\n📊 Контекст: ${JSON.stringify(context, null, 2).slice(0, 500)}...\n`;
        }
        if (hypotheses && hypotheses.length > 0) {
            const selected = hypotheses.find((h: Hypothesis) => h.id === selectedHypothesisId);
            ctxText += `\n💡 Выбранная гипотеза: ${selected?.title || 'не выбрана'}\n`;
            ctxText += hypotheses
                .slice(0, 3)
                .map((h: Hypothesis) => `  - ${h.title}: ${h.llm_comment || ''}`)
                .join('\n');
        }
        if (artifacts) {
            ctxText += `\n📦 Артефакты: ${JSON.stringify(artifacts, null, 2).slice(0, 300)}...\n`;
        }
        if (ctxText) {
            setInput((prev) => (prev ? prev + '\n\n' : '') + ctxText);
            inputRef.current?.focus();
            toast.info('Контекст добавлен в сообщение');
        } else {
            toast.warning('Нет доступного контекста');
        }
    };

    const handleSend = () => {
        if (!input.trim() || isPending) return;
        sendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyMessage = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Скопировано в буфер обмена');
    };

    const exportChat = () => {
        const data = JSON.stringify(chatMessages, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Чат экспортирован');
    };

    const clearChat = () => {
        if (chatMessages.length === 0) return;
        if (confirm('Очистить всю историю чата?')) {
            clearChatHistory();
            toast.info('История чата очищена');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        if (!isPending) inputRef.current?.focus();
    }, [isPending]);

    const quickQuestions = [
        'Показать все C2 адреса',
        'Какая следующая стадия атаки?',
        'Что делать с этим инцидентом?',
        'Показать историю действий',
        'Объясни эту гипотезу подробнее',
        'Какие есть альтернативные версии?',
    ];

    return (
        <div className={`flex flex-col h-full ${className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            {!hideHeader && (
                <>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap">Чат-ассистент</h2>
                        {!hideActions && (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 py-1">
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => { setShowContext(!showContext); setShowMenu(false); }}
                                        >
                                            {showContext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            {showContext ? 'Скрыть контекст' : 'Показать контекст'}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => { addContextToInput(); setShowMenu(false); }}
                                        >
                                            <PlusCircle className="h-4 w-4" /> Вставить контекст
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => { exportChat(); setShowMenu(false); }}
                                            disabled={chatMessages.length === 0}
                                        >
                                            <Download className="h-4 w-4" /> Экспорт
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                                            onClick={() => { clearChat(); setShowMenu(false); }}
                                            disabled={chatMessages.length === 0}
                                        >
                                            <Trash2 className="h-4 w-4" /> Очистить
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {showContext && (
                        <div className="mt-2 mb-2 max-h-48 overflow-y-auto">
                            <ContextDisplay />
                        </div>
                    )}

                    {!hideActions && (
                        <div className="flex flex-wrap md:flex-nowrap gap-1.5 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
                            {quickQuestions.map((q) => (
                                <Button
                                    key={q}
                                    variant="secondary"
                                    size="sm"
                                    className="shrink-0 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 text-xs whitespace-nowrap"
                                    onClick={() => sendMessage(q)}
                                    disabled={isPending}
                                >
                                    {q}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg my-2">
                {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm text-center px-2">
                        Начните диалог с ИИ-ассистентом. Задайте вопрос или выберите один из быстрых вопросов выше.
                    </div>
                ) : (
                    chatMessages.map((msg: ChatMessage, idx: number) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[90%] sm:max-w-[80%] rounded-lg px-3 py-2 ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 shadow-sm'
                                    }`}
                            >
                                {msg.role === 'assistant' ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                code({ className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return match ? (
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mt-1 h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            onClick={() => copyMessage(msg.content)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                )}
                                {msg.timestamp && (
                                    <div className="text-xs opacity-50 mt-1 text-gray-500 dark:text-gray-400">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isPending && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Ассистент печатает...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Задайте вопрос ассистенту..."
                    disabled={isPending}
                    className="flex-1 h-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm sm:text-base"
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isPending}
                    className="h-10 w-10 shrink-0 p-0 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};