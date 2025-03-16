'use client';

import { getWorkoutById } from '@/data/workouts';
import WorkoutClient from '@/app/workout/workout-client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function WorkoutStartPage() {
  const params = useParams<{ id: string }>();
  const workout = getWorkoutById(params.id);

  if (!workout) {
    notFound();
  }

  return (
    <main className='bg-background min-h-screen'>
      {/* Hero section - similar to the workout detail page */}
      <div className='from-primary/10 to-background bg-gradient-to-b py-4'>
        <div className='container'>
          <Button variant='outline' size='sm' asChild className='mb-4'>
            <Link href={`/workout/${params.id}`} className='flex items-center gap-1'>
              <ChevronLeft className='h-4 w-4' />
              Back to Workout Details
            </Link>
          </Button>
          <h1 className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl'>
            {workout.title}
          </h1>
        </div>
      </div>
      <WorkoutClient workout={workout} />
    </main>
  );
}
