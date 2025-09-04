
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { MicIcon } from './icons/MicIcon';
import { Button } from './ui/Button';
// Fix: Removed duplicate type definitions and imported from a central location.
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export interface MessageInputHandles {
    submitMessage: () => void;
    toggleRecording: () => void;
}

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionIsSupported = !!SpeechRecognitionAPI;

const MessageInput = forwardRef<MessageInputHandles, MessageInputProps>(({ onSendMessage, isLoading }, ref) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const messageBeforeRecording = useRef('');
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };
    
    const handleToggleRecording = () => {
        if (!recognitionIsSupported) {
            alert("Voice recognition is not supported in your browser.");
            return;
        }

        if (isRecording) {
            recognitionRef.current?.stop();
        } else {
            messageBeforeRecording.current = message;
            if (!recognitionRef.current) {
                const recognition = new SpeechRecognitionAPI();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'ru-RU';

                // Fix: Add explicit types for event handlers.
                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    let fullTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        fullTranscript += event.results[i][0].transcript;
                    }
                     setMessage((messageBeforeRecording.current + ' ' + fullTranscript).trim());
                };

                // Fix: Add explicit types for event handlers.
                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error:", event.error);
                    if (event.error === 'not-allowed') {
                        alert("Microphone access was denied. Please allow microphone access in your browser settings.");
                    }
                    setIsRecording(false);
                };

                recognition.onend = () => {
                    setIsRecording(false);
                };
                
                recognitionRef.current = recognition;
            }
            
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
                setIsRecording(false);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        submitMessage: () => {
            // We can call submit directly or trigger the form's submit event
            formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        },
        toggleRecording: handleToggleRecording
    }));

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <form ref={formRef} onSubmit={handleSubmit} className="flex items-center space-x-3">
                <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSubmit(e);
                        }
                    }}
                    placeholder={isRecording ? "Говорите..." : "Напишите ваше сообщение..."}
                    className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    disabled={isLoading}
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleToggleRecording}
                    className={`text-slate-500 hover:text-blue-500 ${isRecording ? 'text-red-500 hover:text-red-600' : ''}`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    disabled={!recognitionIsSupported}
                >
                    <MicIcon className="w-5 h-5" />
                </Button>
                <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                    <SendIcon className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
});

export default MessageInput;
