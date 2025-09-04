
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const ParentDashboard: React.FC = () => {
    return (
        <Layout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Панель родителя</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Сводка по прогрессу ребенка</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">Здесь будет отображаться общая информация о пройденных этапах, рекомендации и возможность скачать отчет (без конфиденциальных ответов, помеченных ребенком).</p>
                        <div className="mt-4 p-4 border rounded-lg bg-slate-100 dark:bg-slate-800">
                            Компонент для отображения отчетов для родителей находится в разработке.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ParentDashboard;
