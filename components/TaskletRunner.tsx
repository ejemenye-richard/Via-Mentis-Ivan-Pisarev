import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';

interface TaskletRunnerProps {
    onComplete: () => void;
}

export interface TaskletRunnerHandles {
    completeTask: () => void;
}

const stroopItems = [
    { word: 'КРАСНЫЙ', color: 'blue', options: ['Красный', 'Синий', 'Зеленый'], answer: 'Синий' },
    { word: 'ЗЕЛЕНЫЙ', color: 'red', options: ['Желтый', 'Красный', 'Зеленый'], answer: 'Красный' },
    { word: 'СИНИЙ', color: 'green', options: ['Синий', 'Зеленый', 'Оранжевый'], answer: 'Зеленый' },
    { word: 'ЖЕЛТЫЙ', color: 'yellow', options: ['Синий', 'Желтый', 'Красный'], answer: 'Желтый' },
    { word: 'СИНИЙ', color: 'red', options: ['Синий', 'Красный', 'Зеленый'], answer: 'Красный' },
];

const TaskletRunner = forwardRef<TaskletRunnerHandles, TaskletRunnerProps>(({ onComplete }, ref) => {
    const [currentItem, setCurrentItem] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const handleAnswer = (option: string) => {
        if (feedback) return;

        if (option === stroopItems[currentItem].answer) {
            setScore(score + 1);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentItem < stroopItems.length - 1) {
                setCurrentItem(currentItem + 1);
            } else {
                onComplete();
            }
        }, 1000);
    };
    
    useImperativeHandle(ref, () => ({
        completeTask: () => {
            // This can be used to skip or force-complete the tasklet
            onComplete();
        }
    }));


    const item = stroopItems[currentItem];
    const progress = (currentItem / stroopItems.length) * 100;

    return (
        <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
            <CardHeader>
                <CardTitle>Мини-задание: Цвета</CardTitle>
                <CardDescription>Назовите цвет, которым написано слово.</CardDescription>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
                <div className="text-5xl font-extrabold mb-12" style={{ color: item.color }}>
                    {item.word}
                </div>
                <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                    {item.options.map((option) => (
                        <Button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            variant="outline"
                            className={`
                                py-4 text-lg
                                ${feedback && option === item.answer ? 'bg-green-500/20 border-green-500' : ''}
                                ${feedback === 'incorrect' && option !== item.answer ? 'bg-red-500/20 border-red-500' : ''}
                            `}
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </CardContent>
             <CardFooter className="text-center text-sm text-slate-500">
                Задание {currentItem + 1} из {stroopItems.length}
            </CardFooter>
        </Card>
    );
});

export default TaskletRunner;
