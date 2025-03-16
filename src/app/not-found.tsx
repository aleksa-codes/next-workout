import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Frown, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='container flex h-screen flex-col items-center justify-center text-center'>
      <Frown className='text-muted-foreground mb-6 h-20 w-20' />
      <h1 className='mb-2 text-3xl font-bold'>Workout Not Found</h1>
      <p className='text-muted-foreground mb-6'>
        Sorry, the workout you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild>
        <Link href='/'>
          <Home className='mr-2 h-4 w-4' />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
