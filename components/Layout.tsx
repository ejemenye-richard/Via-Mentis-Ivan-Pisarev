
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RobotIcon } from './icons/RobotIcon';
import { Button } from './ui/Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-10 h-16">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/student/home')}>
                    <RobotIcon className="w-8 h-8 text-blue-500" />
                    <span className="font-bold text-lg">AI Tutor</span>
                </div>
                <div>
                     <Button variant="ghost" onClick={() => navigate('/login')}>
                         Выйти <i className="fas fa-sign-out-alt ml-2"></i>
                     </Button>
                </div>
            </header>
            <main className="flex-1 bg-slate-50 dark:bg-slate-900">
                {children}
            </main>
        </div>
    );
};
