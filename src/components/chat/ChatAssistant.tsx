import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '@/hooks/useChat';
import { useChat as useChatContext } from '@/contexts/ChatContext';
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
    Sparkles,
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
    const { t } = useTranslation();
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
    const { consumePendingPrompt } = useChatContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // === Быстрые вопросы — собираем явно из ключей (надёжно!) ===
    const quickQuestions: string[] = [
        t('chat.quickQuestions.c2'),
        t('chat.quickQuestions.stage'),
        t('chat.quickQuestions.action'),
        t('chat.quickQuestions.hypothesis'),
        t('chat.quickQuestions.alternatives'),
    ].filter((q) => q && !q.startsWith('chat.'));

    // === Подхват промпта из гипотез (кнопка «В чат») ===
    useEffect(() => {
        const pending = consumePendingPrompt();
        if (pending) {
            setInput(pending);
            inputRef.current?.focus();
        }
    }, [consumePendingPrompt]);

    // === Добавление контекста в поле ввода ===
    const addContextToInput = () => {
        const p = {
            alert: t('chat.contextPrefixes.alert'),
            context: t('chat.contextPrefixes.context'),
            hypotheses: t('chat.contextPrefixes.hypotheses'),
            artifacts: t('chat.contextPrefixes.artifacts'),
            selected: t('chat.contextPrefixes.selected'),
            notSelected: t('chat.contextPrefixes.notSelected'),
            user: t('chat.contextPrefixes.user'),
            source: t('chat.contextPrefixes.source'),
            target: t('chat.contextPrefixes.target'),
            unknown: t('chat.contextPrefixes.unknown'),
        };

        let ctxText = '';

        if (alert) {
            ctxText += `${p.alert} ${alert.rule}\n`;
            ctxText += `  ${p.user}: ${alert.user || p.unknown}\n`;
            ctxText += `  ${p.source}: ${alert.src_ip || 'N/A'} → ${p.target}: ${alert.dst_ip || 'N/A'}\n`;
        }

        if (context) {
            ctxText += `\n${p.context} ${JSON.stringify(context, null, 2).slice(0, 500)}...\n`;
        }

        if (hypotheses && hypotheses.length > 0) {
            const selected = hypotheses.find((h: Hypothesis) => h.id === selectedHypothesisId);
            ctxText += `\n${p.hypotheses} ${p.selected}: ${selected?.title || p.notSelected}\n`;
            ctxText += hypotheses
                .slice(0, 3)
                .map((h: Hypothesis) => `  - ${h.title}: ${h.llm_comment || ''}`)
                .join('\n');
            ctxText += '\n';
        }

        if (artifacts) {
            ctxText += `\n${p.artifacts} ${JSON.stringify(artifacts, null, 2).slice(0, 300)}...\n`;
        }

        if (ctxText) {
            setInput((prev) => (prev ? prev + '\n\n' : '') + ctxText);
            inputRef.current?.focus();
            toast.info(t('chat.toasts.contextAdded'));
        } else {
            toast.warning(t('chat.toasts.noContext'));
        }
    };

    // === Отправка сообщения ===
    const handleSend = (text?: string) => {
        const value = (text ?? input).trim();
        if (!value || isPending) return;
        sendMessage(value);
        if (!text) setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyMessage = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t('chat.toasts.copied'));
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
        toast.success(t('chat.toasts.exported'));
    };

    const clearChat = () => {
        if (chatMessages.length === 0) return;
        if (confirm(t('chat.toasts.confirmClear'))) {
            clearChatHistory();
            toast.info(t('chat.toasts.cleared'));
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        if (!isPending) inputRef.current?.focus();
    }, [isPending]);

    return (
        <div className={`flex flex-col h-full ${className} bg-white dark:bg-[#0d0e13] text-[#171922] dark:text-[#f7f8fa]`}>
            {/* === ХЕДЕР === */}
            {!hideHeader && (
                <>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#dfe2e5] dark:border-[#292b34] shrink-0">
                        <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap">
                            {t('chat.title')}
                        </h2>
                        {!hideActions && (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="h-8 w-8 p-0 text-[#676b75] hover:text-[#171922] dark:text-[#a3a6af] dark:hover:text-[#f7f8fa]"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-[#15161d] border border-[#dfe2e5] dark:border-[#292b34] rounded-md shadow-lg z-50 py-1">
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#20f0e7]/10 transition-colors"
                                            onClick={() => { setShowContext(!showContext); setShowMenu(false); }}
                                        >
                                            {showContext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            {showContext ? t('chat.actions.hideContext') : t('chat.actions.showContext')}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#20f0e7]/10 transition-colors"
                                            onClick={() => { addContextToInput(); setShowMenu(false); }}
                                        >
                                            <PlusCircle className="h-4 w-4" /> {t('chat.actions.insertContext')}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#20f0e7]/10 transition-colors disabled:opacity-40"
                                            onClick={() => { exportChat(); setShowMenu(false); }}
                                            disabled={chatMessages.length === 0}
                                        >
                                            <Download className="h-4 w-4" /> {t('chat.actions.export')}
                                        </button>
                                        <button
                                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[#ff4d4d]/10 text-[#ff4d4d] transition-colors disabled:opacity-40"
                                            onClick={() => { clearChat(); setShowMenu(false); }}
                                            disabled={chatMessages.length === 0}
                                        >
                                            <Trash2 className="h-4 w-4" /> {t('chat.actions.clear')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {showContext && (
                        <div className="mt-2 mb-2 max-h-48 overflow-y-auto shrink-0">
                            <ContextDisplay />
                        </div>
                    )}

                    {/* Быстрые вопросы в хедере (только для docked-режима) */}
                    {!hideActions && quickQuestions.length > 0 && (
                        <div className="flex flex-wrap md:flex-nowrap gap-1.5 py-2 border-b border-[#dfe2e5] dark:border-[#292b34] overflow-x-auto scrollbar-hide shrink-0">
                            {quickQuestions.map((q) => (
                                <Button
                                    key={q}
                                    variant="secondary"
                                    size="sm"
                                    className="shrink-0 bg-[#20f0e7]/10 text-[#0bbdb7] hover:bg-[#20f0e7]/20 dark:text-[#20f0e7] dark:hover:bg-[#20f0e7]/20 border border-[#20f0e7]/20 text-xs whitespace-nowrap transition-colors"
                                    onClick={() => handleSend(q)}
                                    disabled={isPending}
                                >
                                    {q}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* === ЛЕНТА СООБЩЕНИЙ === */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 my-2 bg-[#f7f7f5] dark:bg-[#15161d] rounded-lg">
                {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-5">
                        <Sparkles className="w-10 h-10 text-[#20f0e7]" />
                        <div>
                            <p className="text-sm font-medium text-[#171922] dark:text-[#f7f8fa]">
                                {t('chat.empty.title')}
                            </p>
                            <p className="text-xs text-[#676b75] dark:text-[#a3a6af] mt-1">
                                {t('chat.empty.subtitle')}
                            </p>
                        </div>

                        {/* Быстрые вопросы в пустом состоянии — ТОЛЬКО для плавающего окна */}
                        {hideActions && quickQuestions.length > 0 && (
                            <div className="flex flex-col gap-2 w-full max-w-[340px]">
                                {quickQuestions.slice(0, 3).map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        disabled={isPending}
                                        className="text-left text-xs px-3 py-2.5 rounded-lg border border-[#dfe2e5] dark:border-[#292b34] bg-white dark:bg-[#1b1c24] text-[#171922] dark:text-[#f7f8fa] hover:border-[#20f0e7] hover:bg-[#20f0e7]/5 transition-all disabled:opacity-50"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chatMessages.map((msg: ChatMessage, idx: number) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[90%] sm:max-w-[85%] rounded-xl px-3.5 py-2.5 ${msg.role === 'user'
                                        ? 'bg-[#20f0e7] text-[#06100f]'
                                        : 'bg-white dark:bg-[#1b1c24] border border-[#dfe2e5] dark:border-[#292b34] text-[#171922] dark:text-[#f7f8fa] shadow-sm'
                                        }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
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
                                            <button
                                                onClick={() => copyMessage(msg.content)}
                                                title={t('chat.actions.copy')}
                                                className="mt-1.5 inline-flex items-center text-[#676b75] hover:text-[#20f0e7] dark:text-[#a3a6af] dark:hover:text-[#20f0e7] transition-colors"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap break-words text-sm">
                                            {msg.content}
                                        </div>
                                    )}
                                    {msg.timestamp && (
                                        <div
                                            className={`text-[10px] mt-1 ${msg.role === 'user'
                                                ? 'opacity-60'
                                                : 'text-[#676b75] dark:text-[#a3a6af]'
                                                }`}
                                        >
                                            {new Date(msg.timestamp).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-[#1b1c24] border border-[#dfe2e5] dark:border-[#292b34] shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#20f0e7]" />
                                    <span className="text-sm text-[#676b75] dark:text-[#a3a6af]">
                                        {t('chat.typing')}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* === ПОЛЕ ВВОДА === */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#dfe2e5] dark:border-[#292b34] shrink-0">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('chat.placeholder')}
                    disabled={isPending}
                    className="flex-1 h-10 bg-white dark:bg-[#1b1c24] border-[#dfe2e5] dark:border-[#292b34] text-[#171922] dark:text-[#f7f8fa] text-sm focus:border-[#20f0e7] focus-visible:ring-[#20f0e7] focus-visible:ring-1 focus-visible:ring-offset-0 outline-none"
                />
                <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isPending}
                    title={t('chat.actions.send')}
                    className="h-10 w-10 shrink-0 p-0 bg-[#20f0e7] hover:bg-[#0bd6cf] text-[#06100f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};