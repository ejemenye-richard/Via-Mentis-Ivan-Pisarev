
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DialogueTurn } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const SYSTEM_INSTRUCTION = `Ты — ИИ-тьютор для школьников 11–17 лет. Твоя цель — через короткие дружеские беседы (чат или голос) сформировать когнитивно-личностный и профориентационный профиль ученика. 
Принципы: безопасность, доброжелательность, уважение, никакой стигмы. Не давай диагнозов. Предлагай простые шаги, поддерживай мотивацию. 
Избегай чувствительных тем без запроса (суицид, насилие, вещества). Если ученик поднимает рискованные темы — мягко переключи на безопасный скрининг и покажи правила обращения к взрослым и экстренным службам.
Твои ответы должны быть короткими, дружелюбными и подходящими для чата. Используй эмодзи умеренно.`;

export const streamChatResponse = async (history: DialogueTurn[], studentMessage: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history.map(turn => ({
            role: turn.role === 'student' ? 'user' : 'model',
            parts: [{ text: turn.text }]
        })),
    });

    try {
        const result = await chat.sendMessageStream({ message: studentMessage });
        return result;
    } catch (error) {
        console.error("Error streaming chat response:", error);
        throw new Error("Failed to get response from AI Tutor.");
    }
};
