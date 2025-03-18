import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/global.css';
import { Toaster } from '@/components/ui/sonner';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Workout',
  description: 'AI-powered workout app to help you achieve your fitness goals',
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
