'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Betöltés...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/');
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
            <span className="text-sm text-gray-600">
              {user.firstName} {user.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Kijelentkezés
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Üdv, {user.firstName}! 👋
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profil típus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {user.role === 'CLIENT' ? 'Megbízó' : user.role === 'TASKER' ? 'Mester' : 'Admin'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Státusz</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 font-semibold">Aktív</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {user.role === 'CLIENT' && (
            <Card>
              <CardHeader>
                <CardTitle>Új feladat feladása</CardTitle>
                <CardDescription>
                  Adj fel egy új feladatot, és kapj ajánlatokat mesterektől
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks/new">
                  <Button className="w-full">Feladat létrehozása</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {user.role === 'TASKER' && (
            <Card>
              <CardHeader>
                <CardTitle>Feladatok böngészése</CardTitle>
                <CardDescription>
                  Nézd meg a környékedben elérhető feladatokat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks">
                  <Button className="w-full">Feladatok megtekintése</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Saját feladataim</CardTitle>
              <CardDescription>
                {user.role === 'CLIENT'
                  ? 'Tekintsd meg a feladott feladataidat'
                  : 'Tekintsd meg az elfogadott feladataidat'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/my-tasks">
                <Button variant="outline" className="w-full">
                  Megtekintés
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* MVP Notice */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🚧 MVP Fejlesztés alatt</h3>
          <p className="text-sm text-gray-700">
            Ez egy korai verzió. Hamarosan elérhető funkciók: valós idejű chat,
            fizetési integráció, értékelési rendszer, és még sok más!
          </p>
        </div>
      </div>
    </div>
  );
}
