import { useState, useCallback } from 'react';
import { DialogueTurn } from '../types';
import { streamChatResponse } from '../services/geminiService';

export const useChat = (initialMessages: DialogueTurn[] = []) => {
    const [messages, setMessages] = useState<DialogueTurn[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMessage: DialogueTurn = {
            id: `msg-${Date.now()}`,
            role: 'student',
            text,
            timestamp: Date.now(),
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);
        setError(null);

        try {
            const stream = await streamChatResponse(newMessages.slice(0, -1), text);

            let assistantResponse = '';
            const assistantMessageId = `msg-${Date.now()}-ai`;
            
            setMessages(prev => [...prev, {
                id: assistantMessageId,
                role: 'assistant',
                text: '...',
                timestamp: Date.now()
            }]);

            for await (const chunk of stream) {
                assistantResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId ? { ...msg, text: assistantResponse } : msg
                ));
            }

            // Once the full message is received, simulate adding an audio URL.
            // In a real app, this URL would come from a Text-to-Speech service.
            setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { 
                    ...msg, 
                    text: assistantResponse,
                    // NOTE: This is a placeholder audio.
                    audioUrl: `https://actions.google.com/sounds/v1/alarms/beep_short.ogg`
                } : msg
            ));


        } catch (e) {
            const err = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(err);
             setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                role: 'assistant',
                text: `Извините, произошла ошибка. ${err}`,
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return { messages, isLoading, error, sendMessage };
};
