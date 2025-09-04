
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RobotIcon } from '../components/icons/RobotIcon';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleLogin = (role: Role) => {
        // In a real app, this would involve authentication.
        // Here, we just navigate to the corresponding dashboard.
        if (role === Role.STUDENT) {
            navigate('/onboarding');
        } else {
            navigate(`/${role}/dashboard`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-4">
                        <RobotIcon className="w-12 h-12 text-blue-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">ИИ-Тьютор: Вход</CardTitle>
                    <p className="text-slate-500 dark:text-slate-400">Выберите вашу роль для входа</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={() => handleLogin(Role.STUDENT)} className="w-full">
                        <i className="fas fa-user-graduate mr-2"></i> Я Ученик
                    </Button>
                    <Button onClick={() => handleLogin(Role.PARENT)} className="w-full" variant="secondary">
                        <i className="fas fa-user-shield mr-2"></i> Я Родитель
                    </Button>
                    <Button onClick={() => handleLogin(Role.PSYCHOLOGIST)} className="w-full" variant="secondary">
                       <i className="fas fa-user-doctor mr-2"></i> Я Психолог
                    </Button>
                    <Button onClick={() => handleLogin(Role.ADMIN)} className="w-full" variant="outline">
                        <i className="fas fa-user-cog mr-2"></i> Я Администратор
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
