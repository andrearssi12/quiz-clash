import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuizClash - Kuis Interaktif Rebutan Kelompok',
  description: 'Aplikasi kuis kelompok interaktif berbasis Next.js dengan sumber bank soal dari spreadsheet/CSV.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
