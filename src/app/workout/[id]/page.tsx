'use client';

import { type Exercise, type WorkoutPlan } from '@/data/workouts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dumbbell,
  Clock,
  RefreshCw,
  Target,
  PlayCircle,
  Award,
  Info,
  ChevronLeft,
  Edit,
  Plus,
  Save,
  X,
  Trash2,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import YouTubeEmbed from '@/components/youtube-embed';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { workouts as defaultWorkouts } from '@/data/workouts';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkouts } from '@/hooks/use-workouts';

// Function to extract YouTube video ID from various URL formats
function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Recommended channels for workout videos
const recommendedChannels = [
  {
    name: 'Functional Bodybuilding',
    url: 'https://www.youtube.com/@FunctionalBodybuilding',
    description: 'Short, clear exercise demonstrations with proper form',
  },
  {
    name: 'OPEX Fitness',
    url: 'https://www.youtube.com/@OPEXFitness',
    description: 'Professional exercise tutorials with technique breakdowns',
  },
];

// Function to generate YouTube search URL for an exercise
function generateYouTubeSearchUrl(exerciseName: string): string {
  // Format the exercise name for a search query
  const searchQuery = `How to ${exerciseName}`;
  const encodedQuery = encodeURIComponent(searchQuery);
  return `https://www.youtube.com/results?search_query=${encodedQuery}`;
}

function ExerciseCard({
  exercise,
  index,
  isCustomWorkout,
  onUpdateVideos,
}: {
  exercise: Exercise;
  index: number;
  isCustomWorkout: boolean;
  onUpdateVideos: (exerciseIndex: number, newVideos: string[]) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>([...exercise.videoUrls]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  const handleSaveVideos = () => {
    // Filter out empty URLs
    const filteredUrls = videoUrls.filter((url) => url.trim() !== '');

    if (filteredUrls.length === 0) {
      toast.error('At least one video URL is required');
      return;
    }

    onUpdateVideos(index, filteredUrls);
    setEditMode(false);
  };

  const handleAddVideo = () => {
    const videoId = extractYoutubeId(newVideoUrl);

    if (!videoId) {
      toast.error('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    if (videoUrls.length >= 3) {
      toast.error('Maximum of 3 videos allowed per exercise.');
      return;
    }

    const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setVideoUrls([...videoUrls, fullUrl]);
    setNewVideoUrl('');
    toast.success('Video added successfully!');
  };

  const handleRemoveVideo = (indexToRemove: number) => {
    if (videoUrls.length <= 1) {
      toast.error('Cannot remove the last video. At least one video is required.');
      return;
    }

    const updatedUrls = videoUrls.filter((_, i) => i !== indexToRemove);
    setVideoUrls(updatedUrls);
  };

  return (
    <Card className='w-full overflow-hidden pt-0 transition-all hover:shadow-md'>
      <CardHeader className='bg-muted/30 py-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <span className='bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold'>
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
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='flex items-center gap-1.5 font-medium'>
              <PlayCircle className='text-muted-foreground h-4 w-4' />
              Videos
            </h4>

            {isCustomWorkout && (
              <div className='flex items-center gap-2'>
                {editMode ? (
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => window.open(generateYouTubeSearchUrl(exercise.name), '_blank')}
                    className='flex items-center gap-1.5'
                  >
                    <Youtube className='h-4 w-4' />
                    Find Videos
                  </Button>
                ) : (
                  <Button variant='outline' size='sm' onClick={() => setEditMode(true)}>
                    <Edit className='mr-1 h-3.5 w-3.5' />
                    Edit Videos
                  </Button>
                )}
              </div>
            )}
          </div>

          {editMode ? (
            <div className='bg-muted/20 space-y-3 rounded-md p-2'>
              {videoUrls.map((url, idx) => (
                <div key={idx} className='flex items-center gap-2'>
                  <Input
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...videoUrls];
                      newUrls[idx] = e.target.value;
                      setVideoUrls(newUrls);
                    }}
                    placeholder='YouTube URL'
                    className='flex-1'
                  />
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => handleRemoveVideo(idx)}
                    disabled={videoUrls.length <= 1}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}

              {videoUrls.length < 3 && (
                <div className='mt-3 flex items-center gap-2'>
                  <Input
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder='Add new YouTube URL'
                    className='flex-1'
                  />
                  <Button variant='secondary' onClick={handleAddVideo}>
                    <Plus className='mr-1 h-4 w-4' />
                    Add
                  </Button>
                </div>
              )}
              <div className='mt-4 flex justify-center gap-2'>
                <Button variant='outline' onClick={() => setEditMode(false)}>
                  <X className='mr-1 h-3.5 w-3.5' />
                  Cancel
                </Button>
                <Button onClick={handleSaveVideos}>
                  <Save className='mr-1 h-3.5 w-3.5' />
                  Save
                </Button>
              </div>
              <div className='mt-4 rounded-md border border-amber-200 bg-amber-50 p-2'>
                <div className='flex items-start gap-2 text-xs text-amber-800'>
                  <Info className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
                  <div>
                    <p className='mb-1 font-medium'>Tips for best results:</p>
                    <ul className='list-disc space-y-1 pl-4'>
                      <li>
                        Use <strong>short videos</strong> (20-30s) that demonstrate the exercise clearly
                      </li>
                      <li>The first video will be used as the primary demonstration during workouts</li>
                      <li>
                        Click the <strong>Find Videos</strong> button to search for good demonstration videos
                      </li>
                    </ul>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant='link' className='mt-1 h-auto p-0 text-xs text-amber-800 underline'>
                          <Youtube className='mr-1 h-3 w-3' />
                          Recommended channels
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-80'>
                        <div className='space-y-3'>
                          <h4 className='font-medium'>Recommended Channels</h4>
                          <div className='space-y-2'>
                            {recommendedChannels.map((channel) => (
                              <div key={channel.name} className='text-sm'>
                                <a
                                  href={channel.url}
                                  target='_blank'
                                  rel='noreferrer'
                                  className='text-primary block font-medium hover:underline'
                                >
                                  {channel.name}
                                </a>
                                <p className='text-muted-foreground text-xs'>{channel.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                  <YouTubeEmbed videoId={url} loop={true} muted={true} className='rounded-md' />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseCardSkeleton() {
  return (
    <Card className='w-full overflow-hidden pt-0 transition-all hover:shadow-md'>
      <CardHeader className='bg-muted/30 py-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-6 rounded-full' />
              <Skeleton className='h-6 w-40' />
            </div>
          </div>
          <div className='flex flex-wrap justify-end gap-1.5'>
            <Skeleton className='h-5 w-16 rounded-full' />
            <Skeleton className='h-5 w-16 rounded-full' />
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6 pt-6'>
        <div className='bg-muted/40 rounded-md p-3'>
          <div className='mb-2 flex items-center gap-1.5'>
            <Skeleton className='h-4 w-4 rounded-full' />
            <Skeleton className='h-4 w-24' />
          </div>
          <div className='space-y-1.5 pl-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </div>

        <div>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Skeleton className='h-4 w-4 rounded-full' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
          <Skeleton className='aspect-video w-full rounded-md' />
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkoutDetailPage() {
  const params = useParams<{ id: string }>();
  const { getWorkoutById } = useWorkouts();
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [isCustomWorkout, setIsCustomWorkout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      setIsLoading(true);

      try {
        const fetchedWorkout = getWorkoutById(params.id);
        if (!fetchedWorkout) {
          notFound();
        }

        setWorkout(fetchedWorkout);
        setIsCustomWorkout(!defaultWorkouts.some((w) => w.id === params.id));
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkout();
    // Since getWorkoutById is now stable thanks to useCallback, it's safe to include in dependencies
  }, [params.id, getWorkoutById]);

  const updateExerciseVideos = (exerciseIndex: number, newVideos: string[]) => {
    if (!isCustomWorkout) {
      toast.error('Cannot edit default workouts');
      return;
    }

    // Create a deep copy of the workout
    const updatedWorkout = JSON.parse(JSON.stringify(workout)) as WorkoutPlan;

    // Update the videos for the specified exercise
    updatedWorkout.exercises[exerciseIndex].videoUrls = newVideos;

    // Update local storage
    try {
      const customWorkoutsJSON = localStorage.getItem('customWorkouts');
      if (customWorkoutsJSON) {
        const customWorkouts: WorkoutPlan[] = JSON.parse(customWorkoutsJSON);

        // Find and update the workout
        const updatedWorkouts = customWorkouts.map((w) => (w.id === workout?.id ? updatedWorkout : w));

        localStorage.setItem('customWorkouts', JSON.stringify(updatedWorkouts));
        toast.success('Videos updated successfully!');

        // Update state
        setWorkout(updatedWorkout);
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      toast.error('Failed to update videos');
    }
  };

  return (
    <main className='bg-background min-h-screen'>
      {/* Hero section with skeleton while loading */}
      <div className='from-primary/10 to-background bg-gradient-to-b py-4'>
        <div className='container'>
          <Button variant='outline' size='sm' asChild className='mb-4'>
            <Link href='/#workouts' className='flex items-center gap-1'>
              <ChevronLeft className='h-4 w-4' />
              Back to Workouts
            </Link>
          </Button>

          {isLoading ? (
            <>
              <Skeleton className='mb-2 h-10 w-3/4 max-w-md' />
              <Skeleton className='mb-4 h-6 w-1/2 max-w-xs' />
              <div className='flex gap-3'>
                <Skeleton className='h-5 w-24 rounded-full' />
                <Skeleton className='h-5 w-24 rounded-full' />
              </div>
            </>
          ) : (
            <>
              <h1 className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl'>
                {workout?.title}
              </h1>
              <p className='text-muted-foreground max-w-2xl text-lg'>{workout?.description}</p>
              <div className='text-muted-foreground mt-4 flex items-center gap-3 text-sm font-medium'>
                {isCustomWorkout && (
                  <Badge variant='outline' className='bg-primary/5 text-primary'>
                    Custom Workout
                  </Badge>
                )}
                <Badge variant='outline' className='bg-primary/5 text-primary'>
                  {workout?.duration}
                </Badge>
                <Badge variant='secondary' className='capitalize'>
                  {workout?.level}
                </Badge>
              </div>
            </>
          )}
        </div>
      </div>

      <div className='container space-y-8'>
        {/* Instructions Card with skeleton */}
        <div className='flex flex-wrap items-center justify-between gap-4 pt-2'>
          <Card className='border-primary/10 from-card to-background w-full border-2 bg-gradient-to-br'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Award className='text-primary h-5 w-5' />
                Workout Overview
              </CardTitle>
              <CardDescription>Follow these guidelines for best results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 sm:grid-cols-3'>
                {isLoading ? (
                  // Skeleton UI for workout instructions
                  <>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <RefreshCw className='text-primary h-4 w-4' />
                        <span>Rounds</span>
                      </div>
                      <Skeleton className='h-5 w-full' />
                    </div>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Dumbbell className='text-primary h-4 w-4' />
                        <span>Repetitions</span>
                      </div>
                      <Skeleton className='h-5 w-full' />
                    </div>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Clock className='text-primary h-4 w-4' />
                        <span>Rest Period</span>
                      </div>
                      <Skeleton className='h-5 w-full' />
                    </div>
                  </>
                ) : (
                  // Real data
                  <>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <RefreshCw className='text-primary h-4 w-4' />
                        <span>Rounds</span>
                      </div>
                      <p className='text-muted-foreground text-sm'>{workout?.instructions.rounds}</p>
                    </div>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Dumbbell className='text-primary h-4 w-4' />
                        <span>Repetitions</span>
                      </div>
                      <p className='text-muted-foreground text-sm'>{workout?.instructions.reps}</p>
                    </div>
                    <div className='bg-muted/50 space-y-1 rounded-lg p-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Clock className='text-primary h-4 w-4' />
                        <span>Rest Period</span>
                      </div>
                      <p className='text-muted-foreground text-sm'>{workout?.instructions.rest}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercises Section with skeletons */}
        <div className='grid gap-6'>
          {isLoading
            ? // Show 3 skeleton card placeholders while loading
              Array(3)
                .fill(null)
                .map((_, i) => <ExerciseCardSkeleton key={i} />)
            : // Show actual exercise cards once loaded
              workout?.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.name}
                  exercise={exercise}
                  index={index}
                  isCustomWorkout={isCustomWorkout}
                  onUpdateVideos={updateExerciseVideos}
                />
              ))}
        </div>

        {/* Start Button */}
        <div className='fixed right-5 bottom-5 z-10'>
          <Button
            size='lg'
            className='bg-primary hover:bg-primary/90 rounded-full px-8 shadow-xl'
            asChild
            disabled={isLoading}
          >
            <Link href={isLoading ? '#' : `/workout/${params.id}/start`} className='flex items-center gap-1'>
              <PlayCircle className='h-4 w-4' />
              Start Workout
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
