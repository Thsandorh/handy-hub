'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyTasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'completed'>('all');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchMyTasks();
  }, [router]);

  const fetchMyTasks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      const response = await fetch(`${apiUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // Filter tasks based on user role
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const myTasks = data.filter((task: any) => {
        if (storedUser.role === 'CLIENT') {
          return task.client.id === storedUser.id;
        } else if (storedUser.role === 'TASKER') {
          return task.tasker?.id === storedUser.id ||
                 task.offers?.some((offer: any) => offer.tasker.id === storedUser.id);
        }
        return false;
      });

      setTasks(myTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status.toLowerCase() === filter;
  });

  const statusCounts = {
    all: tasks.length,
    open: tasks.filter((t) => t.status === 'OPEN').length,
    assigned: tasks.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

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
            <span className="text-sm text-gray-600">
              {user?.firstName} {user?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Kijelentkezés
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Saját feladataim</h1>
          {user?.role === 'CLIENT' && (
            <Link href="/tasks/new">
              <Button>+ Új feladat</Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-colors ${
              filter === 'all' ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Összes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statusCounts.all}</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              filter === 'open' ? 'ring-2 ring-green-600' : ''
            }`}
            onClick={() => setFilter('open')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Nyitott
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{statusCounts.open}</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              filter === 'assigned' ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={() => setFilter('assigned')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Folyamatban
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{statusCounts.assigned}</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-colors ${
              filter === 'completed' ? 'ring-2 ring-gray-600' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Befejezve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-600">{statusCounts.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">Még nincsenek feladataid ebben a kategóriában</p>
              {user?.role === 'CLIENT' && (
                <Link href="/tasks/new">
                  <Button>Első feladat feladása</Button>
                </Link>
              )}
              {user?.role === 'TASKER' && (
                <Link href="/tasks">
                  <Button>Feladatok böngészése</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const isClient = user?.id === task.client.id;
              const myOffer = task.offers?.find((offer: any) => offer.tasker.id === user?.id);

              return (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {task.skill?.name} • {task.locationAddress}
                        </CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        task.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                        task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status === 'OPEN' ? 'Nyitott' :
                         task.status === 'ASSIGNED' ? 'Kiosztva' :
                         task.status === 'IN_PROGRESS' ? 'Folyamatban' :
                         task.status === 'COMPLETED' ? 'Befejezve' :
                         task.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Költségvetés</p>
                        <p className="font-bold text-lg">
                          {Number(task.budgetAmount).toLocaleString('hu-HU')} Ft
                          {task.budgetType === 'HOURLY' && '/óra'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Közzétéve</p>
                        <p className="font-semibold">
                          {new Date(task.createdAt).toLocaleDateString('hu-HU')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {isClient ? 'Ajánlatok' : 'Saját ajánlat'}
                        </p>
                        <p className="font-semibold">
                          {isClient
                            ? `${task.offers?.length || 0} ajánlat`
                            : myOffer
                            ? `${Number(myOffer.proposedAmount).toLocaleString('hu-HU')} Ft`
                            : 'Nincs ajánlat'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/tasks/${task.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Részletek
                        </Button>
                      </Link>
                      {task.tasker && (
                        <Link href={`/chat/${task.id}`}>
                          <Button variant="outline">
                            💬 Chat
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
