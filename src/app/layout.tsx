import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/global.css';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Workout',
  description: 'Workout app to help you stay fit and healthy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
