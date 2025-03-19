import { Dumbbell, Github } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => (
  <footer className='border-border/40 bg-background/95 border-t py-10'>
    <div className='container'>
      <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
        <div className='flex flex-col items-center sm:items-start'>
          <div className='mb-2 flex items-center gap-2'>
            <Dumbbell className='text-primary h-5 w-5' />
            <span className='text-lg font-bold tracking-tight'>Next Workout</span>
          </div>
          <p className='text-muted-foreground text-center text-sm sm:text-left'>
            Your personal workout companion for achieving fitness goals.
          </p>
        </div>

        <div className='flex flex-col items-center gap-4 sm:items-end'>
          <div className='flex gap-4'>
            <a
              href='https://github.com/aleksa-codes/next-workout'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='GitHub'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Github className='h-5 w-5' />
            </a>
          </div>
          <div className='text-muted-foreground/70 text-xs'>
            © {new Date().getFullYear()} Next Workout. All rights reserved.
          </div>
        </div>
      </div>

      <div className='text-muted-foreground mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm'>
        <Link href='/' className='hover:text-primary transition-colors'>
          Home
        </Link>
        <Link href='#workouts' className='hover:text-primary transition-colors'>
          Workouts
        </Link>
        <Link href='/create' className='hover:text-primary transition-colors'>
          Create
        </Link>
        <Link href='/learn' className='hover:text-primary transition-colors'>
          Learn More
        </Link>
      </div>
    </div>
  </footer>
);
