
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const PsychologistDashboard: React.FC = () => {
    return (
        <Layout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Панель психолога</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Обзор учеников</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">Здесь будет список учеников, их прогресс в сессиях, флаги валидности и доступ к отчетам.</p>
                        <div className="mt-4 p-4 border rounded-lg bg-slate-100 dark:bg-slate-800">
                            Компонент для отображения списка учеников находится в разработке.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default PsychologistDashboard;
