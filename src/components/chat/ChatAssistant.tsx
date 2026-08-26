import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useInvestigationStore } from '@/stores/investigationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Download, Trash2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

export const ChatAssistant = () => {
    const { chatMessages, clearChatHistory } = useInvestigationStore();
    const [input, setInput] = useState('');
    const { mutate: sendMessage, isPending } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    useEffect(() => {
        if (!isPending) inputRef.current?.focus();
    }, [isPending]);

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

    const quickQuestions = [
        'Показать все C2 адреса',
        'Какая следующая стадия атаки?',
        'Что делать с этим инцидентом?',
        'Показать историю действий',
        'Объясни эту гипотезу подробнее',
        'Какие есть альтернативные версии?',
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex items-center justify-between pb-3 border-b">
                <h2 className="text-lg font-semibold">Чат-ассистент</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportChat} disabled={chatMessages.length === 0}>
                        <Download className="h-4 w-4 mr-1" /> Экспорт
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearChat} disabled={chatMessages.length === 0}>
                        <Trash2 className="h-4 w-4 mr-1" /> Очистить
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
                {quickQuestions.map((q) => (
                    <Button
                        key={q}
                        variant="secondary"
                        size="sm"
                        className="shrink-0"
                        onClick={() => sendMessage(q)}
                        disabled={isPending}
                    >
                        {q}
                    </Button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
                {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Начните диалог с ИИ-ассистентом. Задайте вопрос или выберите один из быстрых вопросов выше.
                    </div>
                ) : (
                    chatMessages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-card border shadow-sm'
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
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mt-1 h-6 w-6"
                                            onClick={() => copyMessage(msg.content)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                )}
                                {msg.timestamp && (
                                    <div className="text-xs opacity-50 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isPending && (
                    <div className="flex justify-start">
                        <div className="bg-card border shadow-sm rounded-lg px-4 py-2 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Ассистент печатает...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 pt-3 border-t">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Задайте вопрос ассистенту..."
                    disabled={isPending}
                    className="flex-1"
                />
                <Button onClick={handleSend} disabled={!input.trim() || isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};