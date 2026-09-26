import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { contextApi } from '@/api/context';
import { sessionApi } from '@/api/session';
import { useInvestigationStore } from '@/stores/investigationStore';
import { useLLMStore } from '@/stores/llmStore';
import { useAvailableProviders } from '@/hooks/useAvailableProviders';

export const useContextCollection = () => {
    const { sessionId, setSessionId, setContext, setStep, addAction } = useInvestigationStore();
    const { i18n } = useTranslation();

    const { ragMode: storeRagMode, selectedProviderId, customProviders } = useLLMStore();
    const { providers: ollamaProviders } = useAvailableProviders();

    // Объединённый список: Ollama (с бэка) + Custom (из стора)
    const allProviders = useMemo(
        () => [...(ollamaProviders || []), ...(customProviders || [])],
        [ollamaProviders, customProviders]
    );

    const selectedProvider = allProviders.find((p) => p.id === selectedProviderId);

    return useMutation({
        mutationFn: async ({
            llmConfig: overrideConfig,
            ragMode: overrideRagMode,
        }: {
            llmConfig?: any;
            ragMode?: boolean;
        } = {}) => {
            let currentSessionId: string;

            // 1. Создать сессию, если нет
            if (!sessionId) {
                const startRes = await sessionApi.start();
                currentSessionId = startRes.data.session_id;
                setSessionId(currentSessionId);
            } else {
                currentSessionId = sessionId;
            }

            // 2. Собрать llm_config: приоритет — override, иначе из стора
            const llmConfig = overrideConfig || {
                type: selectedProvider?.type || 'ollama',
                model: selectedProvider?.model || 'qwen2.5:1.5b',
                baseUrl: (selectedProvider as any)?.baseUrl,
                apiKey: (selectedProvider as any)?.apiKey,
                name: selectedProvider?.name,
                language: i18n.language,   // ← язык гипотез и комментариев LLM
            };

            const ragMode = overrideRagMode ?? storeRagMode;

            console.log('[gather] llm_config:', llmConfig, 'rag_mode:', ragMode);

            try {
                const response = await contextApi.gather(currentSessionId, llmConfig, ragMode);
                return response.data;
            } catch (error: any) {
                // 3. Если 404 — сессия протухла, пересоздаём
                if (error.response?.status === 404) {
                    console.warn('Session expired, creating a new one...');

                    const startRes = await sessionApi.start();
                    currentSessionId = startRes.data.session_id;
                    setSessionId(currentSessionId);

                    const response = await contextApi.gather(currentSessionId, llmConfig, ragMode);
                    return response.data;
                }

                throw error;
            }
        },
        onSuccess: (data) => {
            setContext(data.context);
            setStep(1);
            addAction('Контекст собран');
        },
        onError: (error) => {
            console.error('Ошибка сбора контекста:', error);
        },
    });
};