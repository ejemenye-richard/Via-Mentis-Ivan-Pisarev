
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [consentStudent, setConsentStudent] = useState(false);
    const [consentParent, setConsentParent] = useState(false);

    const canProceed = consentStudent && consentParent;

    const handleContinue = () => {
        if (canProceed) {
            // In a real app, this consent would be saved to the database.
            navigate('/student/home');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Добро пожаловать!</CardTitle>
                    <CardDescription>Прежде чем мы начнем, пожалуйста, ознакомьтесь с условиями и подтвердите согласия.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                        <h3 className="font-semibold mb-2">Политика конфиденциальности и условия использования</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 max-h-32 overflow-y-auto">
                            Здесь будет полный текст юридического соглашения. Мы обязуемся защищать ваши данные. Вся информация, собранная в ходе сессий, используется исключительно для формирования вашего образовательного профиля и рекомендаций. Чувствительные данные доступны только школьному психологу. Вы имеете право на удаление своих данных в любой момент.
                        </p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Checkbox id="consentStudent" checked={consentStudent} onCheckedChange={(checked) => setConsentStudent(Boolean(checked))} />
                        <label htmlFor="consentStudent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Я (ученик) понимаю и принимаю условия использования и политику конфиденциальности.
                        </label>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Checkbox id="consentParent" checked={consentParent} onCheckedChange={(checked) => setConsentParent(Boolean(checked))} />
                        <label htmlFor="consentParent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Мой родитель/опекун ознакомлен и дает согласие на мое участие.
                        </label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleContinue} disabled={!canProceed} className="w-full">
                        Продолжить
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Onboarding;
