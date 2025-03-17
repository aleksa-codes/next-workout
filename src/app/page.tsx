import { WorkoutSection } from '@/components/workout-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Timer, Brain, Dumbbell, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='bg-background min-h-screen'>
      <div className='from-primary/10 to-background relative bg-gradient-to-b py-12'>
        <div className='container'>
          <div className='mx-auto text-center'>
            <Badge variant='outline' className='border-primary/20 mb-4 rounded-full px-4 py-1'>
              <Dumbbell className='text-primary mr-1 h-4 w-4' />
              <span className='font-medium tracking-wide'>FITNESS MADE SIMPLE</span>
            </Badge>

            <h1 className='mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl'>
              Next <span className='text-primary'>Workout</span>
            </h1>

            <p className='text-muted-foreground mx-auto mb-8 max-w-md text-lg'>
              Your personal workout companion designed to help you achieve your fitness goals with simple, effective
              workouts.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4'>
              <Button size='lg' className='rounded-full px-6 shadow-md'>
                <Link href='#workouts' className='flex items-center'>
                  Start Now
                  <ChevronRight className='ml-1 h-4 w-4' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='rounded-full px-6' asChild>
                <Link href='/learn'>Learn More</Link>
              </Button>
            </div>

            {/* Feature highlights - Updated to show actual app capabilities */}
            <div className='mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='bg-card/60 flex flex-col items-center rounded-xl p-4 shadow-sm backdrop-blur-sm'>
                <div className='bg-primary/10 mb-2 flex size-9 items-center justify-center rounded-full'>
                  <Brain className='text-primary size-5' />
                </div>
                <h3 className='mb-1 font-medium'>AI Workout Creation</h3>
                <p className='text-muted-foreground text-sm'>Generate custom workouts with AI assistance</p>
              </div>
              <div className='bg-card/60 flex flex-col items-center rounded-xl p-4 shadow-sm backdrop-blur-sm'>
                <div className='bg-primary/10 mb-2 flex size-9 items-center justify-center rounded-full'>
                  <Youtube className='text-primary size-5' />
                </div>
                <h3 className='mb-1 font-medium'>Video Demonstrations</h3>
                <p className='text-muted-foreground text-sm'>Follow along with visual exercise guides</p>
              </div>
              <div className='bg-card/60 flex flex-col items-center rounded-xl p-4 shadow-sm backdrop-blur-sm'>
                <div className='bg-primary/10 mb-2 flex size-9 items-center justify-center rounded-full'>
                  <Timer className='text-primary size-5' />
                </div>
                <h3 className='mb-1 font-medium'>Interactive Workout Timer</h3>
                <p className='text-muted-foreground text-sm'>
                  Visual countdown timers with rest periods and audio cues
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WorkoutSection />
    </main>
  );
}
