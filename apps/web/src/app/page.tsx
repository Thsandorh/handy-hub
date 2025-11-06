import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Találd meg a tökéletes mestert minden feladathoz
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Bútorszerelés, takarítás, költöztetés, karbantartás - megbízható
              szakemberek, gyorsan és biztonságosan.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/tasks/new">
                <Button size="lg" variant="secondary">
                  Feladat feladása
                </Button>
              </Link>
              <Link href="/auth/register?role=tasker">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Mesterként csatlakozom
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Hogyan működik?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Feladat feladása</h3>
              <p className="text-gray-600">
                Írd le, mire van szükséged, adj meg egy helyszínt és egy árat
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ajánlatok érkezése</h3>
              <p className="text-gray-600">
                Ellenőrzött mesterek ajánlatot tesznek a feladatra
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Biztonságos fizetés</h3>
              <p className="text-gray-600">
                A pénz letétbe kerül, és csak a munka befejezése után kerül kiadásra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Népszerű kategóriák
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Bútorszerelés',
              'Takarítás',
              'Költöztetés',
              'Festés-mázolás',
              'Kertrendezés',
              'Vízvezeték szerelés',
              'Villanyszerelés',
              'Házi karbantartás',
            ].map((category) => (
              <Link
                key={category}
                href={`/tasks?category=${category}`}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Készen állsz a kezdésre?</h2>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">Regisztráció</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Bejelentkezés
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
