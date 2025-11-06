import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MesterPont - Találd meg a tökéletes mestert',
  description:
    'Összekötjük azokat, akiknek gyors, helyi segítségre van szükségük azokkal, akik el tudják végezni a feladatokat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
