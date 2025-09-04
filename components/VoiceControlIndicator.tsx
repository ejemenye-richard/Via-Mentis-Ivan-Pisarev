import React, { useState, useEffect } from 'react';
import { useVoiceControl } from '../context/VoiceControlContext';
import { MicIcon } from './icons/MicIcon';

const VoiceControlIndicator: React.FC = () => {
    const { listening, transcript, isSupported } = useVoiceControl();
    const [visibleTranscript, setVisibleTranscript] = useState('');

    useEffect(() => {
        if (transcript) {
            setVisibleTranscript(transcript);
            const timer = setTimeout(() => {
                setVisibleTranscript('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [transcript]);

    if (!isSupported) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-2 bg-slate-900/80 dark:bg-slate-800/80 text-white rounded-full shadow-lg backdrop-blur-sm">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${listening ? 'bg-red-500' : 'bg-slate-600'}`}>
                <MicIcon className={`w-5 h-5 ${listening ? 'animate-pulse' : ''}`} />
            </div>
            {visibleTranscript && (
                 <span className="pr-3 text-sm italic opacity-90">{visibleTranscript}</span>
            )}
        </div>
    );
};

export default VoiceControlIndicator;
