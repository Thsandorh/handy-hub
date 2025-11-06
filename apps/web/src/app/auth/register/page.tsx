'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [role, setRole] = useState<'client' | 'tasker'>(
    roleParam === 'tasker' ? 'tasker' : 'client'
  );
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    hourlyRate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      };

      let response;
      if (role === 'tasker') {
        response = await api.registerTasker({
          ...registerData,
          bio: formData.bio,
          hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
          skillIds: [], // TODO: Skill selection
        });
      } else {
        response = await api.registerClient(registerData);
      }

      // Store token
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sikertelen regisztráció');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Regisztráció</CardTitle>
          <CardDescription>
            Hozz létre egy új MesterPont fiókot
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={role === 'client' ? 'default' : 'outline'}
                onClick={() => setRole('client')}
                className="flex-1"
              >
                Megbízó
              </Button>
              <Button
                type="button"
                variant={role === 'tasker' ? 'default' : 'outline'}
                onClick={() => setRole('tasker')}
                className="flex-1"
              >
                Mester
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Keresztnév</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Vezetéknév</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email cím</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefonszám (opcionális)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+36301234567"
              />
            </div>

            {role === 'tasker' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bemutatkozás</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Rövid bemutatkozás a tapasztalataidról..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Óradíj (Ft)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: e.target.value })
                    }
                    placeholder="5000"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Betöltés...' : 'Regisztráció'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Van már fiókod?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Bejelentkezés
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
