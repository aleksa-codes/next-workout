'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CalendarDays,
  BarChart3,
  Target,
  Timer,
  Clock,
  Dumbbell,
  ChevronRight,
  Plus,
  Sparkles,
  Loader2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import YouTubeEmbed from '@/components/youtube-embed';
import { useWorkouts } from '@/hooks/use-workouts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { workouts as defaultWorkouts } from '@/data/workouts';

export function WorkoutSection() {
  const { workouts, isLoading, deleteWorkout } = useWorkouts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to check if a workout is custom (not default)
  const isCustomWorkout = (id: string) => {
    return !defaultWorkouts.some((workout) => workout.id === id);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    const success = deleteWorkout(id);
    if (success) {
      setDeletingId(null);
    }
  };

  return (
    <div id='workouts' className='container py-16'>
      <div className='mb-10'>
        <Badge variant='secondary' className='mb-2'>
          <CalendarDays className='mr-1 h-3.5 w-3.5' />
          WORKOUT LIBRARY
        </Badge>
        <h2 className='mb-3 text-3xl font-bold tracking-tight'>Choose Your Workout</h2>
        <p className='text-muted-foreground'>Browse our collection of workout programs or create your own</p>
      </div>

      {/* Add a card for creating a custom workout */}
      <Card className='group hover:border-primary/50 mb-6 overflow-hidden border transition-all duration-300 hover:shadow-md'>
        <div className='p-6 text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            <Sparkles className='text-primary h-6 w-6' />
          </div>
          <h3 className='mb-2 text-xl font-semibold'>Create Custom Workout</h3>
          <p className='text-muted-foreground mb-6'>Generate your own personalized workout plan with AI assistance</p>
          <Button asChild className='rounded-full'>
            <Link href='/create' className='flex items-center justify-center gap-1.5'>
              <Plus className='h-4 w-4' />
              Create Workout
            </Link>
          </Button>
        </div>
      </Card>

      {/* Loading state */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-10'>
          <Loader2 className='text-primary h-8 w-8 animate-spin' />
          <p className='text-muted-foreground mt-2'>Loading workouts...</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {workouts.length === 0 ? (
            <div className='py-10 text-center'>
              <p className='text-muted-foreground'>No workouts found. Create your first one!</p>
            </div>
          ) : (
            workouts.map((workout, index) => (
              <Card
                key={workout.id || index}
                className={`group hover:border-primary/50 overflow-hidden border transition-all duration-300 hover:shadow-md ${
                  index == 0 ? 'border-secondary/20 bg-secondary/5' : ''
                }`}
              >
                {/* Mobile: Stacked layout (current) / Desktop: Organized rows */}
                <div className='flex flex-col p-4 sm:p-6'>
                  {/* First row: Video, Title/Description, Stats - side by side on desktop */}
                  <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
                    {/* Left side: Video and key info */}
                    <div className='relative w-full sm:w-2/5'>
                      <div className='aspect-video overflow-hidden rounded-lg'>
                        <YouTubeEmbed
                          videoId={workout.exercises[0]?.videoUrls[0] || ''}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='absolute top-0 left-0 flex flex-col gap-2 p-2'>
                        <Badge className='border-0 bg-black/60 text-xs text-white backdrop-blur-sm'>
                          <Clock className='mr-1.5 h-3 w-3' />
                          {workout.duration}
                        </Badge>
                        <Badge
                          variant='outline'
                          className='border-0 bg-black/60 text-xs text-white capitalize backdrop-blur-sm'
                        >
                          <BarChart3 className='mr-1 h-3 w-3' />
                          {workout.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Middle: Title and description */}
                    <div className='flex flex-1 flex-col'>
                      <div className='mb-4'>
                        <h3 className='group-hover:text-primary mb-2 text-xl font-semibold transition-colors'>
                          {workout.title}
                        </h3>
                        <p className='text-muted-foreground text-sm'>{workout.description}</p>
                      </div>

                      {/* Stats row */}
                      <div className='grid grid-cols-3 gap-2 text-xs sm:mt-auto'>
                        <div className='bg-muted/30 rounded-md p-2 text-center'>
                          <Dumbbell className='text-primary/70 mx-auto mb-1 h-4 w-4' />
                          <span className='block font-medium'>{workout.exercises.length} Exercises</span>
                        </div>
                        <div className='bg-muted/30 rounded-md p-2 text-center'>
                          <Clock className='text-primary/70 mx-auto mb-1 h-4 w-4' />
                          <span className='block font-medium'>{workout.instructions.rounds}</span>
                        </div>
                        <div className='bg-muted/30 rounded-md p-2 text-center'>
                          <Timer className='text-primary/70 mx-auto mb-1 h-4 w-4' />
                          <span className='block font-medium'>{workout.instructions.rest}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second row: Target Muscles and Buttons - better layout for desktop */}
                  <div className='mt-4 flex flex-col sm:mt-5 sm:flex-row sm:items-center sm:justify-between'>
                    {/* Muscle tags */}
                    <div className='mb-4 sm:mb-0 sm:flex-1'>
                      <div className='text-muted-foreground mb-1.5 text-xs font-medium'>Target Muscles:</div>
                      <div className='flex flex-wrap gap-1.5 sm:w-2/3'>
                        {Array.from(new Set(workout.exercises.flatMap((ex) => ex.targetMuscles)))
                          .slice(0, 5)
                          .map((muscle, idx) => (
                            <Badge key={idx} variant='secondary' className='text-xs'>
                              <Target className='mr-1 h-3 w-3 opacity-70' />
                              {muscle}
                            </Badge>
                          ))}
                        {Array.from(new Set(workout.exercises.flatMap((ex) => ex.targetMuscles))).length > 5 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{Array.from(new Set(workout.exercises.flatMap((ex) => ex.targetMuscles))).length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex items-center gap-2 sm:justify-end'>
                      {/* Delete button for custom workouts only */}
                      {isCustomWorkout(workout.id) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='outline' className='rounded-full' size='icon'>
                              {deletingId === workout.id ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <Trash2 className='text-destructive h-4 w-4' />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete workout</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{workout.title}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(workout.id)}
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button asChild className='flex-1 rounded-full sm:flex-none'>
                        <Link href={`/workout/${workout.id}`} className='flex items-center justify-center gap-1.5'>
                          <ChevronRight className='h-4 w-4' />
                          View Workout
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
