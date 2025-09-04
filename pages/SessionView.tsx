import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import TaskletRunner from '../components/TaskletRunner';
import { useChat } from '../hooks/useChat';
import { DialogueTurn } from '../types';
import { useVoiceControl } from '../context/VoiceControlContext';

const initialMessages: DialogueTurn[] = [
    {
        id: 'intro-1',
        role: 'assistant',
        text: 'Привет! Я твой ИИ-тьютор. Рад познакомиться! 😊 Как у тебя сегодня настроение?',
        timestamp: Date.now()
    }
];

// Define the shape of the ref handles
interface MessageInputHandles {
    submitMessage: () => void;
    toggleRecording: () => void;
}
interface TaskletRunnerHandles {
    completeTask: () => void;
}


const SessionView: React.FC = () => {
    const { messages, isLoading, sendMessage } = useChat(initialMessages);
    const [isTaskletVisible, setTaskletVisible] = useState(false);
    const { registerCommands, unregisterCommands } = useVoiceControl();

    const messageInputRef = useRef<MessageInputHandles>(null);
    const taskletRunnerRef = useRef<TaskletRunnerHandles>(null);


    // Simulate tasklet trigger
    React.useEffect(() => {
        if (messages.length > 2 && !isTaskletVisible) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && lastMessage.text.includes('задачку')) {
                 setTimeout(() => setTaskletVisible(true), 1000);
            }
        }
    }, [messages, isTaskletVisible]);

    useEffect(() => {
        const commands = [
            { command: 'отправить сообщение', callback: () => messageInputRef.current?.submitMessage() },
            { command: ['начать диктовку', 'включи микрофон'], callback: () => messageInputRef.current?.toggleRecording() },
            { command: ['остановить диктовку', 'выключи микрофон'], callback: () => messageInputRef.current?.toggleRecording() },
            { command: 'завершить задание', callback: () => taskletRunnerRef.current?.completeTask() }
        ];
        registerCommands(commands);
        return () => unregisterCommands(commands);
    }, [registerCommands, unregisterCommands, isTaskletVisible]);

    const handleTaskletComplete = () => {
        setTaskletVisible(false);
        sendMessage("Я закончил задание.");
    }

    return (
        <Layout>
            <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row">
                <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-800">
                    <ChatWindow messages={messages} isLoading={isLoading} />
                    <MessageInput ref={messageInputRef} onSendMessage={sendMessage} isLoading={isLoading} />
                </div>
                {isTaskletVisible && (
                    <div className="w-full md:w-1/3 md:max-w-sm lg:max-w-md border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col">
                       <TaskletRunner ref={taskletRunnerRef} onComplete={handleTaskletComplete} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SessionView;
