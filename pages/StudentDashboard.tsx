import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/Layout';
import { RobotIcon } from '../components/icons/RobotIcon';
import { Tasklet, TaskletDomain } from '../types';
import { useVoiceControl } from '../context/VoiceControlContext';

const todaySession = {
    id: 'session-123',
    title: 'Знакомство и разминка для ума',
    description: 'Сегодня мы познакомимся, и я предложу тебе пару интересных задачек, чтобы настроиться на рабочий лад.',
    tasklets: [
        { id: 't1', code: 'stroop_basic', title: 'Цветовой тест', domain: TaskletDomain.COGNITIVE, estMinutes: 3 },
        { id: 't2', code: 'san_mood', title: 'Как настроение?', domain: TaskletDomain.EMOTION, estMinutes: 2 },
    ]
};

const TaskletChip: React.FC<{ tasklet: Tasklet }> = ({ tasklet }) => {
    const domainColors: Record<TaskletDomain, string> = {
        [TaskletDomain.COGNITIVE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [TaskletDomain.PERSONALITY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        [TaskletDomain.EMOTION]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [TaskletDomain.SOCIAL]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        [TaskletDomain.INTEREST]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${domainColors[tasklet.domain]}`}>
            {tasklet.title}
        </span>
    );
};


const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { registerCommands, unregisterCommands } = useVoiceControl();

    const startSession = () => {
        navigate(`/student/session/${todaySession.id}`);
    };
    
    useEffect(() => {
        const commands = [
            { command: 'начать сессию', callback: startSession, description: 'Начать сегодняшнюю сессию' }
        ];
        registerCommands(commands);
        return () => unregisterCommands(commands);
    }, [registerCommands, unregisterCommands, navigate]);


    return (
        <Layout>
            <div className="p-4 md:p-8">
                <h1 className="text-3xl font-bold mb-2">Привет, Alex!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Готов к новому шагу на пути к самопознанию?</p>
                
                <Card className="max-w-2xl mx-auto shadow-xl transform hover:scale-105 transition-transform duration-300">
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="p-3 bg-blue-500/10 rounded-full">
                            <RobotIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Сессия на сегодня</CardTitle>
                            <CardDescription>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold text-lg mb-2">{todaySession.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{todaySession.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {todaySession.tasklets.map(t => <TaskletChip key={t.id} tasklet={t} />)}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={startSession} className="w-full">
                            <i className="fas fa-play mr-2"></i> Начать сессию (5-10 мин)
                        </Button>
                    </CardFooter>
                </Card>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4 text-center">Твой прогресс</h2>
                     <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                        <div className="bg-green-500 h-4 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <p className="text-center mt-2 text-sm text-slate-500">Пройдено 1 из 4 этапов</p>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
