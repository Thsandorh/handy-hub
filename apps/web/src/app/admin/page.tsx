'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pendingTaskers, setPendingTaskers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTaskers: 0,
    totalClients: 0,
    totalTasks: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (!storedUser || !token) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'ADMIN') {
      alert('Csak adminisztrátorok férhetnek hozzá ehhez az oldalhoz');
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      // Fetch all users (simplified - in production use proper admin endpoints)
      const usersResponse = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        // In real implementation, backend should provide admin endpoints
        // For now, we'll simulate the data
      }

      // Simulate stats (in production, these should come from backend)
      setStats({
        totalUsers: 15,
        totalTaskers: 8,
        totalClients: 7,
        totalTasks: 23,
        pendingVerifications: 3,
      });

      // Simulate pending verifications
      setPendingTaskers([
        {
          id: '1',
          firstName: 'János',
          lastName: 'Kiss',
          email: 'janos.kiss@example.com',
          bio: 'Tapasztalt bútorszerelő vagyok 15 év gyakorlattal.',
          idDocumentUrl: 'https://example.com/id.jpg',
          selfieVerificationUrl: 'https://example.com/selfie.jpg',
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTasker = async (taskerId: string, approved: boolean) => {
    const token = localStorage.getItem('accessToken');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

    try {
      // TODO: Implement admin verification endpoint in backend
      alert(
        approved
          ? 'Mester jóváhagyva! (Production backend endpoint szükséges)'
          : 'Mester elutasítva! (Production backend endpoint szükséges)'
      );

      // Remove from pending list
      setPendingTaskers((prev) => prev.filter((t) => t.id !== taskerId));
      setStats((prev) => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1,
      }));
    } catch (error) {
      console.error('Failed to verify tasker:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MesterPont Admin
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Összes felhasználó
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mesterek
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.totalTaskers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Megbízók
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.totalClients}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Feladatok
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-yellow-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ellenőrzésre vár
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pendingVerifications}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Függőben lévő ellenőrzések</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTaskers.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                Nincsenek függőben lévő ellenőrzések
              </p>
            ) : (
              <div className="space-y-4">
                {pendingTaskers.map((tasker) => (
                  <div
                    key={tasker.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {tasker.firstName} {tasker.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{tasker.email}</p>
                        <p className="text-gray-700 mb-4">{tasker.bio}</p>

                        <div className="flex gap-4">
                          {tasker.idDocumentUrl && (
                            <div>
                              <p className="text-sm font-semibold mb-1">
                                Személyi igazolvány:
                              </p>
                              <img
                                src={tasker.idDocumentUrl}
                                alt="ID Document"
                                className="w-48 h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                          {tasker.selfieVerificationUrl && (
                            <div>
                              <p className="text-sm font-semibold mb-1">
                                Szelfi ellenőrzés:
                              </p>
                              <img
                                src={tasker.selfieVerificationUrl}
                                alt="Selfie"
                                className="w-48 h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                          Regisztráció: {new Date(tasker.createdAt).toLocaleString('hu-HU')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleVerifyTasker(tasker.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ Jóváhagyás
                        </Button>
                        <Button
                          onClick={() => handleVerifyTasker(tasker.id, false)}
                          variant="destructive"
                        >
                          ✗ Elutasítás
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* MVP Notice */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">⚠️ MVP Verzió</h3>
          <p className="text-sm text-gray-700">
            Ez egy egyszerűsített admin felület. Production környezetben a következő funkciók szükségesek:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Teljes user management (szerkesztés, törlés, tiltás)</li>
            <li>Feladat moderáció (tartalom ellenőrzés)</li>
            <li>Analytics dashboard (statisztikák, grafikonok)</li>
            <li>Email értesítések küldése</li>
            <li>Vitás ügyek kezelése</li>
            <li>Pénzügyi jelentések</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
