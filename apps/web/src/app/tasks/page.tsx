'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks({ status: 'OPEN' });
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MesterPont
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Elérhető feladatok</h1>
          <Link href="/tasks/new">
            <Button>+ Új feladat</Button>
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Még nincsenek elérhető feladatok.
            </p>
            <Link href="/tasks/new">
              <Button>Légy az első!</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                  <CardDescription>
                    {task.skill?.name} • {task.locationAddress}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Költségvetés</p>
                      <p className="font-bold text-lg">
                        {Number(task.budgetAmount).toLocaleString('hu-HU')} Ft
                        {task.budgetType === 'HOURLY' && '/óra'}
                      </p>
                    </div>
                    <Link href={`/tasks/${task.id}`}>
                      <Button size="sm">Részletek</Button>
                    </Link>
                  </div>
                  {task.distance && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {task.distance} km távolság
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
