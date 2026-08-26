import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useLLMStore } from '@/stores/llmStore';

export const useChat = () => {
    const { sessionId, addChatMessage } = useInvestigationStore();
    const { ragMode, selectedProviderId, providers } = useLLMStore();

    const selectedProvider = providers.find(p => p.id === selectedProviderId);

    return useMutation({
        mutationFn: async (question: string) => {
            if (!sessionId) throw new Error('Сессия не инициализирована');

            // Добавляем сообщение пользователя сразу
            addChatMessage({ role: 'user', content: question });

            const payload = {
                question,
                rag_mode: ragMode,
                llm_config: {
                    provider: selectedProvider?.type || 'ollama',
                    model: selectedProvider?.model || 'llama3',
                    api_key: selectedProvider?.apiKey || '',
                    base_url: selectedProvider?.baseUrl || 'http://localhost:11434',
                }
            };

            const response = await apiClient.post(`/session/${sessionId}/chat`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            addChatMessage({ role: 'assistant', content: data.answer });
        },
        onError: (error) => {
            console.error('Ошибка чата:', error);
            addChatMessage({
                role: 'assistant',
                content: '❌ Произошла ошибка при генерации ответа. Попробуйте позже.'
            });
        },
    });
};