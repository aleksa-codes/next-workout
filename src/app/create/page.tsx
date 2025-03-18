import { Metadata } from 'next';
import WorkoutGenerator from './workout-generator';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Workout | Next Workout',
  description: 'Generate your own custom workout plan with AI assistance',
};

export default function CreatePage() {
  return (
    <main className='bg-background min-h-screen'>
      {/* Hero section styled to match other pages */}
      <div className='from-primary/10 to-background bg-gradient-to-b py-4'>
        <div className='container'>
          <Button variant='outline' size='sm' asChild className='mb-4'>
            <Link href='/#workouts' className='flex items-center gap-1'>
              <ChevronLeft className='h-4 w-4' />
              Back to Workouts
            </Link>
          </Button>
          <h1 className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl'>
            Create Your Workout
          </h1>

          <p className='text-muted-foreground max-w-2xl text-lg'>
            Generate your own personalized workout plan with AI assistance
          </p>
        </div>
      </div>
      <div className='container py-10'>
        <WorkoutGenerator />
      </div>
    </main>
  );
}
