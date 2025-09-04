
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Removed duplicate type definitions and imported from a central location.
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export interface Command {
    command: string | string[];
    callback: (...args: any[]) => void;
    description?: string;
}

interface VoiceControlContextType {
    listening: boolean;
    transcript: string;
    registerCommands: (commands: Command[]) => void;
    unregisterCommands: (commands: Command[]) => void;
    isSupported: boolean;
}

const VoiceControlContext = createContext<VoiceControlContextType | undefined>(undefined);

export const VoiceControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const commandsRef = useRef<Command[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const navigate = useNavigate();

    const registerCommands = useCallback((newCommands: Command[]) => {
        commandsRef.current = [...commandsRef.current, ...newCommands];
    }, []);

    const unregisterCommands = useCallback((commandsToRemove: Command[]) => {
        const commandStringsToRemove = commandsToRemove.flatMap(c => Array.isArray(c.command) ? c.command : [c.command]);
        commandsRef.current = commandsRef.current.filter(c => {
            const currentCommands = Array.isArray(c.command) ? c.command : [c.command];
            return !currentCommands.some(cmd => commandStringsToRemove.includes(cmd));
        });
    }, []);
    
    useEffect(() => {
        if (!SpeechRecognitionAPI) {
            console.warn("Voice recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'ru-RU';

        // Fix: Use specific event types instead of `any` for better type safety.
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const lastResult = event.results[event.results.length - 1];
            if (lastResult.isFinal) {
                const said = lastResult[0].transcript.trim().toLowerCase();
                setTranscript(said);
                console.log("Recognized:", said);

                for (const { command, callback } of commandsRef.current) {
                    const commands = Array.isArray(command) ? command : [command];
                    const matchedCommand = commands.find(c => said.includes(c.toLowerCase()));
                    if (matchedCommand) {
                        console.log(`Executing command: ${matchedCommand}`);
                        callback();
                        // Clear transcript after command execution to avoid re-triggering
                        setTimeout(() => setTranscript(''), 1000); 
                        break; 
                    }
                }
            }
        };
        
        recognition.onend = () => {
            // Restart recognition if it stops unexpectedly, unless we intended to stop it.
             if (recognitionRef.current) {
                try {
                    recognition.start();
                    setListening(true);
                } catch(e) {
                    console.error("Could not restart recognition", e);
                    setListening(false);
                }
            }
        };

        // Fix: Use specific event types instead of `any` for better type safety.
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
             if (event.error === 'no-speech' || event.error === 'network') {
                // These are common, just let it restart on 'onend'
            } else {
                setListening(false);
            }
        };

        try {
            recognition.start();
            setListening(true);
        } catch(e){
            console.error("Could not start voice recognition.", e);
        }


        // Global commands
        const globalCommands: Command[] = [
             { command: ['выйти', 'разлогиниться'], callback: () => navigate('/login'), description: 'Выйти из системы' },
             { command: ['домой', 'на главную'], callback: () => navigate('/student/home'), description: 'Перейти на главный экран' },
        ];
        registerCommands(globalCommands);

        return () => {
            unregisterCommands(globalCommands);
            if (recognitionRef.current) {
                recognitionRef.current.onend = null; // prevent restart on unmount
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, [navigate, registerCommands, unregisterCommands]);

    const value = {
        listening,
        transcript,
        registerCommands,
        unregisterCommands,
        isSupported: !!SpeechRecognitionAPI
    };

    return (
        <VoiceControlContext.Provider value={value}>
            {children}
        </VoiceControlContext.Provider>
    );
};

export const useVoiceControl = (): VoiceControlContextType => {
    const context = useContext(VoiceControlContext);
    if (context === undefined) {
        throw new Error('useVoiceControl must be used within a VoiceControlProvider');
    }
    return context;
};
