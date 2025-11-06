'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const data = await api.getTask(taskId);
      setTask(data);
      // Pre-fill offer amount with task budget
      setOfferAmount(data.budgetAmount.toString());
    } catch (error) {
      console.error('Failed to fetch task:', error);
      setError('Nem sikerült betölteni a feladatot');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmittingOffer(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      await api.createOffer(
        {
          taskId,
          proposedAmount: Number(offerAmount),
          message: offerMessage,
        },
        token
      );

      alert('Ajánlatod sikeresen elküldve!');
      fetchTask(); // Refresh to show new offer
      setOfferMessage('');
    } catch (err: any) {
      setError(err.message || 'Sikertelen ajánlat');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (!confirm('Biztosan elfogadod ezt az ajánlatot?')) {
      return;
    }

    try {
      await api.acceptOffer(offerId, token);
      alert('Ajánlat elfogadva! A mester hamarosan felveszi veled a kapcsolatot.');
      fetchTask();
    } catch (err: any) {
      alert(err.message || 'Sikertelen művelet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Feladat nem található</p>
          <Link href="/tasks">
            <Button>Vissza a feladatokhoz</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isClient = user?.id === task.client.id;
  const isTasker = user?.role === 'TASKER';
  const canMakeOffer = isTasker && task.status === 'OPEN' && !task.tasker;
  const userAlreadyOffered = task.offers?.some((offer: any) => offer.tasker.id === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MesterPont
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Link href="/tasks" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Vissza a feladatokhoz
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {task.skill?.name} • {task.locationAddress}
                    </CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    task.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'OPEN' ? 'Nyitott' :
                     task.status === 'ASSIGNED' ? 'Kiosztva' :
                     task.status === 'COMPLETED' ? 'Befejezve' :
                     task.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Leírás</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>

                {task.photos && task.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Képek</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {task.photos.map((photo: any) => (
                        <img
                          key={photo.id}
                          src={photo.photoUrl}
                          alt="Task photo"
                          className="rounded-lg w-full h-48 object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Költségvetés</p>
                    <p className="text-2xl font-bold">
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
                </div>

                {task.scheduledAt && (
                  <div>
                    <p className="text-sm text-gray-500">Ütemezett időpont</p>
                    <p className="font-semibold">
                      {new Date(task.scheduledAt).toLocaleString('hu-HU')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Offers Section */}
            {isClient && task.offers && task.offers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Érkezett ajánlatok ({task.offers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.offers.map((offer: any) => (
                      <div
                        key={offer.id}
                        className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-lg font-semibold">
                                  {offer.tasker.firstName[0]}{offer.tasker.lastName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">
                                  {offer.tasker.firstName} {offer.tasker.lastName}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span>⭐ {offer.tasker.taskerProfile?.averageRating || 'N/A'}</span>
                                  <span>•</span>
                                  <span>{offer.tasker.taskerProfile?.completedTasks || 0} feladat</span>
                                </div>
                              </div>
                            </div>

                            {offer.message && (
                              <p className="text-gray-700 mb-3">{offer.message}</p>
                            )}

                            <p className="text-2xl font-bold text-blue-600">
                              {Number(offer.proposedAmount).toLocaleString('hu-HU')} Ft
                            </p>
                          </div>

                          {offer.status === 'PENDING' && (
                            <Button
                              onClick={() => handleAcceptOffer(offer.id)}
                              size="sm"
                            >
                              Elfogadás
                            </Button>
                          )}

                          {offer.status === 'ACCEPTED' && (
                            <span className="text-green-600 font-semibold">✓ Elfogadva</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Make Offer Form (for Taskers) */}
            {canMakeOffer && !userAlreadyOffered && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajánlattétel</CardTitle>
                  <CardDescription>
                    Tegyél ajánlatot erre a feladatra
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitOffer} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="offerAmount">Ajánlott ár (Ft)</Label>
                      <Input
                        id="offerAmount"
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        required
                        min="1000"
                        placeholder="15000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offerMessage">Üzenet (opcionális)</Label>
                      <textarea
                        id="offerMessage"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        placeholder="Mutatkozz be, írd le a tapasztalataidat..."
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={submittingOffer}>
                      {submittingOffer ? 'Küldés...' : 'Ajánlat elküldése'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {userAlreadyOffered && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-green-600 font-semibold mb-2">
                    ✓ Már tettel ajánlatot erre a feladatra
                  </p>
                  <p className="text-gray-600 text-sm">
                    A megbízó hamarosan értesít, ha elfogadja az ajánlatodat.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>Megbízó</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold">
                      {task.client.firstName[0]}{task.client.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {task.client.firstName} {task.client.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Megbízó</p>
                  </div>
                </div>

                {task.tasker && (
                  <div className="mt-4">
                    <Link href={`/chat/${task.id}`}>
                      <Button variant="outline" className="w-full">
                        💬 Chat
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Helyszín</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">{task.locationAddress}</p>
                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                  📍 Térkép (Google Maps integráció hamarosan)
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {!user && (
              <Card>
                <CardContent className="py-6">
                  <Link href="/auth/register?role=tasker">
                    <Button className="w-full">
                      Regisztráció Mesterként
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
