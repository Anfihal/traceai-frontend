import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '@/api/client';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useLLMStore } from '@/stores/llmStore';
import { useAvailableProviders } from '@/hooks/useAvailableProviders';

export const useChat = () => {
    const { sessionId, addChatMessage } = useInvestigationStore();
    const { ragMode, selectedProviderId, customProviders } = useLLMStore();
    const { providers: ollamaProviders } = useAvailableProviders();

    // Объединяем Ollama (с бэка) + Custom (из стора)
    const allProviders = useMemo(
        () => [...(ollamaProviders || []), ...(customProviders || [])],
        [ollamaProviders, customProviders]
    );

    const selectedProvider = allProviders.find((p) => p.id === selectedProviderId);

    return useMutation({
        mutationFn: async (question: string) => {
            if (!sessionId) throw new Error('Сессия не инициализирована');

            addChatMessage({ role: 'user', content: question });

            // Собираем конфиг провайдера в формате, который ждёт бэкенд:
            // { type, model, baseUrl, apiKey } — build_provider_from_config
            const providerConfig = selectedProvider
                ? {
                    type: selectedProvider.type,
                    model: selectedProvider.model,
                    baseUrl: (selectedProvider as any).baseUrl,
                    apiKey: (selectedProvider as any).apiKey,
                    name: selectedProvider.name,
                }
                : {
                    type: 'ollama',
                    model: 'llama3',
                };

            const payload = {
                question,
                rag_mode: ragMode,
                llm_config: providerConfig,
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
                content: '❌ Произошла ошибка при генерации ответа. Попробуйте позже.',
            });
        },
    });
};