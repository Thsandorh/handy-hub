'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function NewTaskPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: '',
    locationAddress: '',
    locationLat: 47.4979, // Default Budapest
    locationLng: 19.0402,
    budgetType: 'FIXED' as 'FIXED' | 'HOURLY',
    budgetAmount: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      await api.createTask(
        {
          ...formData,
          budgetAmount: Number(formData.budgetAmount),
        },
        token
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sikertelen feladatfelvétel');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Új feladat feladása</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Feladat címe</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="pl. IKEA szekrény összeszerelése"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillId">Kategória</Label>
                <select
                  id="skillId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.skillId}
                  onChange={(e) =>
                    setFormData({ ...formData, skillId: e.target.value })
                  }
                  required
                >
                  <option value="">Válassz kategóriát...</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Leírás</Label>
                <textarea
                  id="description"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  placeholder="Írd le részletesen, mire van szükséged..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationAddress">Helyszín</Label>
                <Input
                  id="locationAddress"
                  value={formData.locationAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, locationAddress: e.target.value })
                  }
                  required
                  placeholder="Budapest, VIII. kerület, Üllői út 50."
                />
                <p className="text-xs text-gray-500">
                  TODO: Térkép integráció a pontos koordinátákhoz
                </p>
              </div>

              <div className="space-y-2">
                <Label>Költségvetés típusa</Label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="budgetType"
                      value="FIXED"
                      checked={formData.budgetType === 'FIXED'}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetType: 'FIXED' })
                      }
                      className="mr-2"
                    />
                    Fix ár
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="budgetType"
                      value="HOURLY"
                      checked={formData.budgetType === 'HOURLY'}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetType: 'HOURLY' })
                      }
                      className="mr-2"
                    />
                    Óradíj
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetAmount">
                  Összeg (Ft {formData.budgetType === 'HOURLY' && '/ óra'})
                </Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  value={formData.budgetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetAmount: e.target.value })
                  }
                  required
                  placeholder="15000"
                  min="1000"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Betöltés...' : 'Feladat feladása'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Mégse
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
