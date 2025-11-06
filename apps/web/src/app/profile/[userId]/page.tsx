'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/users/${userId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Profil nem található</p>
      </div>
    );
  }

  const isTasker = profile.role === 'TASKER';

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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/tasks" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Vissza
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-semibold">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold mb-1">
                    {profile.firstName} {profile.lastName}
                  </h1>

                  <p className="text-gray-600 mb-4">
                    {isTasker ? '🔨 Mester' : '👤 Megbízó'}
                  </p>

                  {isTasker && profile.taskerProfile && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-gray-600">Értékelés</span>
                        <span className="font-semibold">
                          ⭐ {Number(profile.taskerProfile.averageRating).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-gray-600">Feladatok</span>
                        <span className="font-semibold">
                          {profile.taskerProfile.completedTasks}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-gray-600">Óradíj</span>
                        <span className="font-semibold">
                          {profile.taskerProfile.hourlyRate
                            ? `${Number(profile.taskerProfile.hourlyRate).toLocaleString('hu-HU')} Ft/óra`
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-gray-600">Státusz</span>
                        <span className={`font-semibold ${
                          profile.taskerProfile.verificationStatus === 'VERIFIED'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}>
                          {profile.taskerProfile.verificationStatus === 'VERIFIED'
                            ? '✓ Ellenőrizve'
                            : profile.taskerProfile.verificationStatus === 'PENDING'
                            ? '⏳ Folyamatban'
                            : '❌ Elutasítva'}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button className="w-full mt-6" variant="outline">
                    💬 Üzenet küldése
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            {isTasker && profile.taskerProfile?.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Bemutatkozás</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {profile.taskerProfile.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {isTasker && profile.taskerProfile?.skills && profile.taskerProfile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Képességek</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.taskerProfile.skills.map((taskerSkill: any) => (
                      <div
                        key={taskerSkill.skill.id}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold"
                      >
                        {taskerSkill.skill.name}
                        {taskerSkill.experienceYears && (
                          <span className="ml-2 text-sm font-normal">
                            ({taskerSkill.experienceYears} év)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Értékelések</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* TODO: Fetch and display reviews */}
                  <p className="text-gray-600 text-center py-8">
                    Még nincsenek értékelések
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Work History (for Taskers) */}
            {isTasker && (
              <Card>
                <CardHeader>
                  <CardTitle>Befejezett munkák</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* TODO: Fetch and display completed tasks */}
                    <p className="text-gray-600 text-center py-8">
                      Még nincsenek befejezett munkák
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
