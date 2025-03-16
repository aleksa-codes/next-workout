'use client';

import { getWorkoutById, type Exercise } from '@/data/workouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Clock, RefreshCw, Target, PlayCircle, Award, Info, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import YouTubeEmbed from '@/components/youtube-embed';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <Card className='w-full overflow-hidden pt-0 transition-all hover:shadow-md'>
      <CardHeader className='bg-muted/30 py-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <span className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                {index + 1}
              </span>
              {exercise.name}
            </CardTitle>
          </div>
          <div className='flex flex-wrap justify-end gap-1.5'>
            {exercise.targetMuscles.map((muscle) => (
              <Badge key={muscle} variant='secondary' className='flex items-center gap-1'>
                <Target className='h-3 w-3' />
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 pt-6'>
        <div className='bg-muted/40 rounded-md p-3'>
          <h4 className='mb-2 flex items-center gap-1.5 font-medium'>
            <Info className='text-muted-foreground h-4 w-4' />
            Instructions
          </h4>
          <ul className='text-muted-foreground space-y-1.5 pl-4 text-sm'>
            {exercise.instructions.map((instruction, idx) => (
              <li key={idx} className='marker:text-primary list-disc'>
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='mb-2 flex items-center gap-1.5 font-medium'>
            <PlayCircle className='text-muted-foreground h-4 w-4' />
            Video Demonstrations
          </h4>
          <Tabs defaultValue={exercise.videoUrls[0]} className='w-full'>
            <TabsList
              className='mb-2 grid w-full'
              style={{
                gridTemplateColumns: `repeat(${exercise.videoUrls.length}, 1fr)`,
              }}
            >
              {exercise.videoUrls.map((_, idx) => (
                <TabsTrigger key={idx} value={exercise.videoUrls[idx]}>
                  Demo {idx + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {exercise.videoUrls.map((url: string) => (
              <TabsContent key={url} value={url}>
                <YouTubeEmbed videoId={url} loop />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>();
  const workout = getWorkoutById(params.id);

  if (!workout) {
    notFound();
  }

  return (
    <main className='bg-background min-h-screen'>
      {/* Hero section */}
      <div className='from-primary/10 to-background bg-gradient-to-b py-4'>
        <div className='container'>
          <Button variant='outline' size='sm' asChild className='mb-4'>
            <Link href='/#workouts' className='flex items-center gap-1'>
              <ChevronLeft className='h-4 w-4' />
              Back to Workouts
            </Link>
          </Button>
          <div className='text-muted-foreground mb-4 flex items-center gap-3 text-sm font-medium'>
            <Dumbbell className='text-primary h-5 w-5' />
            <span>Workout Program</span>
            <Badge variant='secondary' className='capitalize'>
              {workout.level}
            </Badge>
          </div>

          <h1 className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl'>
            {workout.title}
          </h1>

          <p className='text-muted-foreground max-w-2xl text-lg'>
            {workout.description} • {workout.duration}
          </p>
        </div>
      </div>

      <div className='container space-y-8'>
        {/* Instructions Card */}
        <Card className='border-primary/10 from-card to-background border-2 bg-gradient-to-br'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='text-primary h-5 w-5' />
              Workout Overview
            </CardTitle>
            <CardDescription>Follow these guidelines for best results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-3'>
              <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                <div className='flex items-center gap-2 font-medium'>
                  <RefreshCw className='text-primary h-4 w-4' />
                  <span>Rounds</span>
                </div>
                <p className='text-muted-foreground text-sm'>{workout.instructions.rounds}</p>
              </div>
              <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                <div className='flex items-center gap-2 font-medium'>
                  <Dumbbell className='text-primary h-4 w-4' />
                  <span>Repetitions</span>
                </div>
                <p className='text-muted-foreground text-sm'>{workout.instructions.reps}</p>
              </div>
              <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                <div className='flex items-center gap-2 font-medium'>
                  <Clock className='text-primary h-4 w-4' />
                  <span>Rest Period</span>
                </div>
                <p className='text-muted-foreground text-sm'>{workout.instructions.rest}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercises Section */}
        <div className='grid gap-6'>
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={exercise.name} exercise={exercise} index={index} />
          ))}
        </div>

        {/* Start Button */}
        <div className='fixed right-5 bottom-5 z-10'>
          <Button size='lg' className='bg-primary hover:bg-primary/90 rounded-full px-8 shadow-xl' asChild>
            <Link href={`/workout/${params.id}/start`} className='flex items-center gap-1'>
              <PlayCircle className='h-4 w-4' />
              Start Workout
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
