
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Управление системой</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500">Здесь будут инструменты для управления школами, классами, пользователями, ролями и политиками хранения данных.</p>
                         <div className="mt-4 p-4 border rounded-lg bg-slate-100 dark:bg-slate-800">
                            Административные компоненты находятся в разработке.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
