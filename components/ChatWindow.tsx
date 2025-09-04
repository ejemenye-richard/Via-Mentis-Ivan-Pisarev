import React, { useRef, useEffect, useState } from 'react';
import { DialogueTurn } from '../types';
import { RobotIcon } from './icons/RobotIcon';
import { UserIcon } from './icons/UserIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { Button } from './ui/Button';

interface ChatWindowProps {
    messages: DialogueTurn[];
    isLoading: boolean;
}

interface ChatMessageProps {
    message: DialogueTurn;
    isPlaying: boolean;
    onTogglePlayback: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isPlaying, onTogglePlayback }) => {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex items-start gap-3 my-4 ${isAssistant ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAssistant ? 'bg-blue-500 text-white' : 'bg-slate-600 text-white'}`}>
                {isAssistant ? <RobotIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
            </div>
            <div className={`px-4 py-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg relative group ${isAssistant ? 'bg-white dark:bg-slate-700 rounded-bl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                 {isAssistant && message.audioUrl && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onTogglePlayback} 
                        className="absolute -right-11 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    >
                        {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
};


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
    const prevMessagesLength = useRef(messages.length);

    useEffect(() => {
        // Initialize audio element on mount
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const handlePlaybackEnd = () => setPlayingMessageId(null);
        audio.addEventListener('ended', handlePlaybackEnd);
        audio.addEventListener('pause', handlePlaybackEnd);
        audio.addEventListener('error', handlePlaybackEnd);

        return () => {
            audio.removeEventListener('ended', handlePlaybackEnd);
            audio.removeEventListener('pause', handlePlaybackEnd);
            audio.removeEventListener('error', handlePlaybackEnd);
            audio.pause();
        }
    }, []);

    const togglePlayback = (message: DialogueTurn) => {
        const audio = audioRef.current;
        if (!audio || !message.audioUrl) return;

        if (playingMessageId === message.id) {
            audio.pause();
            setPlayingMessageId(null);
        } else {
            audio.src = message.audioUrl;
            audio.play().catch(e => {
                console.error("Audio playback failed:", e);
                setPlayingMessageId(null);
            });
            setPlayingMessageId(message.id);
        }
    };

    useEffect(() => {
        // Auto-scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        // Auto-play for new assistant messages
        const lastMessage = messages[messages.length - 1];
        if (
            messages.length > prevMessagesLength.current &&
            lastMessage?.role === 'assistant' &&
            lastMessage.audioUrl &&
            !isLoading
        ) {
            togglePlayback(lastMessage);
        }
        prevMessagesLength.current = messages.length;

    }, [messages, isLoading]);

    return (
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
                <ChatMessage 
                    key={msg.id} 
                    message={msg}
                    isPlaying={playingMessageId === msg.id}
                    onTogglePlayback={() => togglePlayback(msg)}
                />
            ))}
            {isLoading && (
                <div className="flex items-start gap-3 my-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                        <RobotIcon className="w-5 h-5" />
                    </div>
                    <div className="px-4 py-3 rounded-lg bg-white dark:bg-slate-700 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
