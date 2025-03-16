import { useState, useRef, useEffect, useCallback } from 'react';
import { WorkoutPlan } from '@/data/workouts';
import { WorkoutConfig } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ChevronLeft,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Clock,
  Dumbbell,
  Target,
  Award,
  Check,
  Repeat,
  Hash,
  BicepsFlexed,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AnimatedCircularProgressBar from '@/components/ui/animated-circular-progress-bar';
import YouTubeEmbed from '@/components/youtube-embed';
import confetti from 'canvas-confetti';

type WorkoutState = 'active' | 'rest' | 'complete';

// Zyzz videos playlist - we'll use the first one as the main video and the rest as playlist
const ZYZZ_VIDEOS = [
  '5OZ-JOSWx1Q', // Tevvez - Legend Ψ - First video (main video)
  'QGl-oFys0_E', // Tevvez - Frozen in Time
  'T4MgmEc_rs4', // Zyzz "Legend" 2021 Playlist
];

interface WorkoutSessionProps {
  workout: WorkoutPlan;
  config: WorkoutConfig;
  onRestart: () => void;
}

export default function WorkoutSession({ workout, config, onRestart }: WorkoutSessionProps) {
  const [isReady, setIsReady] = useState(false);
  const [readyCountdown, setReadyCountdown] = useState(10);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('active');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hasStartedRep, setHasStartedRep] = useState(false);
  const audioRefs = useRef<{
    alert: HTMLAudioElement | null;
    start: HTMLAudioElement | null;
    rest: HTMLAudioElement | null;
    restOver: HTMLAudioElement | null;
    done: HTMLAudioElement | null;
  }>({
    alert: null,
    start: null,
    rest: null,
    restOver: null,
    done: null,
  });

  // Initialize audio elements early
  useEffect(() => {
    // Initialize all audio elements
    audioRefs.current = {
      alert: new Audio('/assets/alert.mp3'),
      start: new Audio('/assets/start.mp3'),
      rest: new Audio('/assets/rest.mp3'),
      restOver: new Audio('/assets/rest-over.mp3'),
      done: new Audio('/assets/done.mp3'),
    };

    // Play start sound when countdown begins
    audioRefs.current.start?.play().catch((e) => console.error('Error playing start sound:', e));
  }, []);

  // Helper: returns indices of selected exercises.
  const getSelectedIndices = useCallback(
    () =>
      workout.exercises.map((ex, i) => (config.selectedExercises.includes(ex.name) ? i : -1)).filter((i) => i !== -1),
    [workout.exercises, config.selectedExercises],
  );

  // Helper function to get adjusted reps for current exercise (doubled for alternating exercises)
  const getAdjustedReps = useCallback(() => {
    const exercise = workout.exercises[currentExercise];
    return exercise?.altering ? config.repsPerExercise * 2 : config.repsPerExercise;
  }, [workout.exercises, currentExercise, config.repsPerExercise]);

  // Ready countdown effect
  useEffect(() => {
    if (isReady) return;
    const timer = setInterval(() => {
      setReadyCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          // Play alert sound when countdown finishes and workout begins
          audioRefs.current.alert?.play().catch((e) => console.error('Error playing alert sound:', e));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isReady]);

  // Initialize state once ready
  useEffect(() => {
    if (!isReady) return;
    setCurrentExercise(getSelectedIndices()[0] || 0);
    setWorkoutState('active');
    setTimeRemaining(config.timePerRep);
    setCurrentRound(1);
    setCurrentRep(1);
    setIsPaused(false);
    setHasStartedRep(false);
  }, [isReady, config, workout.exercises, getSelectedIndices]);

  // Add effect to fire confetti on workout complete
  useEffect(() => {
    if (workoutState === 'complete') {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
      });
    }
  }, [workoutState]);

  // Function to advance state when active rep's timer ends.
  const advanceActive = useCallback(() => {
    const adjustedRepsRequired = getAdjustedReps();

    if (currentRep < adjustedRepsRequired) {
      if (!hasStartedRep) {
        setHasStartedRep(true);
      } else {
        setCurrentRep((prev) => prev + 1);
      }
      setTimeRemaining(config.timePerRep);
    } else {
      // Completed all reps for current exercise.
      const indices = getSelectedIndices();
      const curIndex = indices.indexOf(currentExercise);

      // Play rest sound when entering rest period
      audioRefs.current.rest?.play().catch((e) => console.error('Error playing rest sound:', e));

      if (config.workoutMode === 'straight-sets') {
        if (currentRound < config.rounds) {
          setCurrentRound((prev) => prev + 1);
          setCurrentRep(1);
          setWorkoutState('rest');
          setTimeRemaining(config.restPeriod);
        } else if (curIndex < indices.length - 1) {
          setCurrentExercise(indices[curIndex + 1]);
          setCurrentRound(1);
          setCurrentRep(1);
          setWorkoutState('rest');
          setTimeRemaining(config.restPeriod);
        } else {
          // Play done sound when workout completes
          audioRefs.current.done?.play().catch((e) => console.error('Error playing done sound:', e));
          setWorkoutState('complete');
        }
      } else {
        // circuit
        if (curIndex < indices.length - 1) {
          setCurrentExercise(indices[curIndex + 1]);
          setCurrentRep(1);
          setWorkoutState('rest');
          setTimeRemaining(config.restPeriod);
        } else if (currentRound < config.rounds) {
          setCurrentRound((prev) => prev + 1);
          setCurrentExercise(indices[0]);
          setCurrentRep(1);
          setWorkoutState('rest');
          setTimeRemaining(config.restPeriod);
        } else {
          // Play done sound when workout completes
          audioRefs.current.done?.play().catch((e) => console.error('Error playing done sound:', e));
          setWorkoutState('complete');
        }
      }
    }
  }, [currentRep, config, hasStartedRep, currentExercise, currentRound, getSelectedIndices, getAdjustedReps]);

  // Function to resume from rest
  const resumeActive = useCallback(() => {
    // Play rest-over sound when resuming exercise
    audioRefs.current.restOver?.play().catch((e) => console.error('Error playing rest-over sound:', e));
    setWorkoutState('active');
    setTimeRemaining(config.timePerRep);
    setHasStartedRep(false);
  }, [config]);

  // Timer effect consolidating both active and rest logic.
  useEffect(() => {
    if (!isReady || workoutState === 'complete' || isPaused) return;

    // Handle reaching zero
    if (timeRemaining <= 0) {
      // Show zero for a brief moment before advancing
      const delayForZeroDisplay = setTimeout(() => {
        if (workoutState === 'active') {
          advanceActive();
        } else if (workoutState === 'rest') {
          resumeActive();
        }
      }, 1000); // Brief delay so user can see the zero

      return () => clearTimeout(delayForZeroDisplay);
    } else {
      // Regular countdown
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isReady, workoutState, timeRemaining, isPaused, advanceActive, resumeActive]);

  function togglePause() {
    setIsPaused(!isPaused);
  }

  function skipCurrent() {
    if (workoutState !== 'active') return;
    const adjustedRepsRequired = getAdjustedReps();

    // If at the end of reps, mimic timer expiry.
    if (currentRep >= adjustedRepsRequired) {
      advanceActive();
    } else {
      setCurrentRep((prev) => Math.min(prev + 1, adjustedRepsRequired));
      setTimeRemaining(config.timePerRep);
    }
  }

  // Display complete workout state
  if (workoutState === 'complete') {
    return (
      <Card className='border-primary/30 overflow-hidden border shadow-lg'>
        <CardHeader className='relative z-10'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-semibold tracking-tight'>Workout Complete! 🎉</CardTitle>
            <Badge variant='outline'>
              <Check className='mr-1 h-3.5 w-3.5' />
              Done
            </Badge>
          </div>
          <CardDescription>Congratulations on completing your workout!</CardDescription>
        </CardHeader>

        <CardContent className='relative z-10'>
          <div className='mb-6 flex flex-col items-center justify-center'>
            <AnimatedCircularProgressBar
              max={100}
              value={100}
              min={0}
              gaugePrimaryColor='var(--primary)'
              gaugeSecondaryColor='var(--primary)/0.2'
              className='size-32'
            >
              <div className='flex flex-col items-center justify-center'>
                <Award className='text-primary mb-1 h-8 w-8' />
                <span className='text-sm font-medium'>Complete</span>
              </div>
            </AnimatedCircularProgressBar>
          </div>

          <div className='grid grid-cols-3 gap-3'>
            <div className='bg-muted/40 rounded-xl p-3 text-center'>
              <p className='text-muted-foreground mb-1 text-xs'>Rounds</p>
              <p className='text-xl font-bold'>{config.rounds}</p>
            </div>

            <div className='bg-muted/40 rounded-xl p-3 text-center'>
              <p className='text-muted-foreground mb-1 text-xs'>Exercises</p>
              <p className='text-xl font-bold'>{config.selectedExercises.length}</p>
            </div>

            <div className='bg-muted/40 rounded-xl p-3 text-center'>
              <p className='text-muted-foreground mb-1 text-xs'>Total Reps</p>
              <p className='text-xl font-bold'>
                {config.rounds * config.selectedExercises.length * config.repsPerExercise}
              </p>
            </div>
          </div>

          <div className='bg-primary/10 mt-5 rounded-lg p-3 text-center'>
            <p className='font-medium'>Great work! Keep it up!</p>
            <p className='text-muted-foreground mt-1 text-sm'>Consistency is key to getting results</p>
          </div>
        </CardContent>

        <CardFooter className='relative z-10 flex justify-between gap-4'>
          <Button variant='outline' asChild className='flex-1 rounded-full'>
            <Link href='/'>
              <ChevronLeft className='mr-2 h-4 w-4' />
              Home
            </Link>
          </Button>
          <Button
            onClick={onRestart}
            className='flex-1 rounded-full transition-transform hover:scale-105 active:scale-95'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            New Workout
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Render active workout or rest session
  const currentExerciseData = workout.exercises[currentExercise];
  if (!currentExerciseData) return <div>Loading...</div>;

  const isResting = workoutState === 'rest';
  const progressMax = isResting ? config.restPeriod : config.timePerRep;
  const progressValue = timeRemaining;
  const adjustedRepsForCurrentExercise = getAdjustedReps();

  // Calculate total progress - Updated for accuracy with different workout modes
  const selectedExerciseIndices = workout.exercises
    .map((ex, i) => (config.selectedExercises.includes(ex.name) ? i : -1))
    .filter((i) => i !== -1);
  const totalExercises = selectedExerciseIndices.length;
  const totalReps = config.rounds * totalExercises * config.repsPerExercise;

  let completedReps = 0;
  const currentExerciseIndex = selectedExerciseIndices.indexOf(currentExercise);

  if (config.workoutMode === 'straight-sets') {
    // For straight sets, we count completed exercises fully (all rounds)
    const completedExercises = selectedExerciseIndices.indexOf(currentExercise);
    completedReps = completedExercises * config.rounds * config.repsPerExercise; // All previous exercises

    // Add reps from current exercise
    completedReps += (currentRound - 1) * config.repsPerExercise; // Completed rounds
    completedReps += currentRep - 1; // Current round progress (subtract 1 to not count current rep)
  } else {
    // For circuit training, we count completed rounds fully
    completedReps = (currentRound - 1) * totalExercises * config.repsPerExercise; // Completed rounds

    // Add exercises from current round
    completedReps += currentExerciseIndex * config.repsPerExercise; // Completed exercises in current round
    completedReps += currentRep - 1; // Current exercise progress
  }

  // Calculate total progress percentage, taking into consideration rest periods as well
  const totalProgressPercent = Math.min((completedReps / totalReps) * 100, 100);

  // Get next exercise for preview
  let nextExercise = null;
  let nextExerciseIndex = -1;

  if (isResting) {
    // During rest period, show the exercise that will be next when rest ends
    nextExerciseIndex = currentExercise;
    nextExercise = workout.exercises[nextExerciseIndex];
  } else {
    // During active workout, calculate what comes after current exercise
    if (config.workoutMode === 'straight-sets') {
      // In straight sets, we complete all rounds of current exercise first
      if (currentRound < config.rounds) {
        // Next is the same exercise, next round
        nextExerciseIndex = currentExercise;
        nextExercise = workout.exercises[nextExerciseIndex];
      } else {
        // Check if there's another exercise after completing all rounds of current
        const nextPossibleIndex = selectedExerciseIndices.indexOf(currentExercise) + 1;
        if (nextPossibleIndex < selectedExerciseIndices.length) {
          nextExerciseIndex = selectedExerciseIndices[nextPossibleIndex];
          nextExercise = workout.exercises[nextExerciseIndex];
        }
      }
    } else {
      // In circuit, we move to the next exercise in sequence
      if (currentExerciseIndex < selectedExerciseIndices.length - 1) {
        // Move to the next exercise in this round
        nextExerciseIndex = selectedExerciseIndices[currentExerciseIndex + 1];
        nextExercise = workout.exercises[nextExerciseIndex];
      } else if (currentRound < config.rounds) {
        // Move to first exercise of next round
        nextExerciseIndex = selectedExerciseIndices[0];
        nextExercise = workout.exercises[nextExerciseIndex];
      }
    }
  }

  // Determine which video to show - For Zyzz mode, use the main video with a playlist parameter
  // const videoConfig = config.zyzzMode
  //   ? {
  //       videoId: ZYZZ_VIDEOS[0],
  //       playlist: ZYZZ_VIDEOS.join(','),
  //     }
  //   : {
  //       videoId: currentExerciseData.videoUrls[0],
  //       playlist: '',
  //     };

  return (
    <Card
      className={cn(
        'gap-8 overflow-hidden border py-0 shadow-lg',
        isResting ? 'border-muted' : 'border-primary/30',
        config.zyzzMode && 'border-amber-500/30',
      )}
    >
      {/* Progress bar at the very top */}
      <Progress
        value={totalProgressPercent}
        className={cn(
          'rounded-none',
          isResting ? 'bg-muted/30' : 'bg-primary/20',
          config.zyzzMode && 'bg-amber-500/20',
        )}
      />

      <CardContent className='relative z-10 space-y-8 px-4'>
        {/* Video section - Show both workout video and Zyzz video when in Zyzz mode */}
        <div className='relative'>
          {/* Always display the main exercise video */}
          <YouTubeEmbed
            videoId={currentExerciseData.videoUrls[0]}
            activePlayback={true}
            playbackActive={isReady && !isPaused}
            loop={true}
            muted={true}
            autoPlay={true}
            className='rounded-lg'
          />

          {/* If Zyzz mode is active, overlay a PiP Zyzz motivational video */}
          {config.zyzzMode && (
            <>
              {/* Zyzz Mode Badge */}
              <Badge
                variant='outline'
                className='absolute bottom-2 left-2 z-10 border-amber-400 bg-amber-500/80 text-white'
              >
                <BicepsFlexed className='mr-1 h-3 w-3' /> Zyzz Mode
              </Badge>

              {/* Picture-in-Picture Zyzz video with responsive sizing */}
              <div className='absolute right-2 bottom-2 z-10 w-1/3 max-w-1/2 min-w-[120px] overflow-hidden rounded-lg border-2 border-amber-500 shadow-lg transition-all duration-300 hover:w-full sm:w-1/4 md:w-1/5'>
                <div className='relative'>
                  <YouTubeEmbed
                    videoId={ZYZZ_VIDEOS[0]}
                    playlist={ZYZZ_VIDEOS.join(',')}
                    activePlayback={true}
                    playbackActive={isReady && !isPaused}
                    loop={true}
                    muted={false} // Enable audio for Zyzz videos
                    autoPlay={true}
                    className='rounded-md'
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className='flex flex-col items-center justify-center gap-1.5'>
          <div className='text-xl font-extrabold'>{isResting ? 'Rest Time' : currentExerciseData.name}</div>

          {/* Muscles or preview info directly under title */}
          {isResting ? (
            nextExercise && (
              <Badge variant='outline'>
                <div className='bg-secondary size-1.5 animate-pulse rounded-full' />
                <span>Coming up: {nextExercise.name}</span>
                {config.workoutMode === 'straight-sets' && nextExerciseIndex === currentExercise && (
                  <span className='text-muted-foreground'>(Set {currentRound})</span>
                )}
              </Badge>
            )
          ) : (
            <div className='flex flex-wrap gap-1.5'>
              {currentExerciseData?.targetMuscles.map((muscle) => (
                <Badge key={muscle} variant='outline'>
                  <Target className='h-3 w-3' />
                  {muscle}
                </Badge>
              ))}
              {!isResting && currentExerciseData.altering && (
                <Badge variant='outline' className='border-amber-500/20 bg-amber-500/10 text-amber-600'>
                  <Repeat className='mr-1 h-3 w-3' />
                  Alternating
                </Badge>
              )}
            </div>
          )}

          {/* Add Zyzz quote when in Zyzz mode */}
          {config.zyzzMode && (
            <div className='mb-1 text-sm text-amber-700 italic'>
              &quot;We&apos;re all gonna make it brah!&quot; - Zyzz
            </div>
          )}
        </div>

        {/* Timer section with exercise/set badges on sides */}
        <div className='flex w-full items-center justify-center gap-4'>
          {/* Exercise badge on left */}
          {isReady && (
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground mt-1 text-xs'>Exercise</span>
              <Badge variant='outline' className='px-3 py-1'>
                <Hash className='mr-1 h-3.5 w-3.5' />
                <span>
                  {currentExerciseIndex + 1}/{totalExercises}
                </span>
              </Badge>
            </div>
          )}

          {/* Timer in center */}
          <div className='flex flex-col items-center justify-center'>
            {!isReady ? (
              <AnimatedCircularProgressBar
                max={10}
                value={readyCountdown}
                min={0}
                reverse={true}
                gaugePrimaryColor='var(--primary)'
                gaugeSecondaryColor='var(--primary)/0.2'
                className='size-36'
              >
                <div className='flex flex-col items-center justify-center'>
                  <span className='text-3xl font-semibold'>{readyCountdown}</span>
                  <span className='text-muted-foreground text-sm'>Get Ready</span>
                </div>
              </AnimatedCircularProgressBar>
            ) : (
              <AnimatedCircularProgressBar
                max={progressMax}
                value={progressValue}
                min={0}
                reverse={true}
                gaugePrimaryColor={isResting ? 'var(--secondary)' : 'var(--primary)'}
                gaugeSecondaryColor={isResting ? 'var(--secondary)/0.2' : 'var(--primary)/0.2'}
                className='size-36'
              >
                <div className='flex flex-col items-center justify-center'>
                  <span className='text-3xl font-semibold'>{timeRemaining}</span>
                  <span className='text-muted-foreground text-xs'>sec</span>

                  {!isResting && (
                    <div className='bg-primary/10 mt-2 flex w-14 items-center justify-center rounded-full py-0.5'>
                      <span className='text-xs font-medium'>
                        {currentRep}/{adjustedRepsForCurrentExercise}
                      </span>
                    </div>
                  )}
                </div>
              </AnimatedCircularProgressBar>
            )}
          </div>

          {/* Set/Round badge on right */}
          {isReady && (
            <div className='flex flex-col items-center'>
              <span className='text-muted-foreground mt-1 text-xs'>
                {config.workoutMode === 'straight-sets' ? 'Set' : 'Round'}
              </span>
              <Badge variant='outline' className='px-3 py-1'>
                {isResting ? <Clock className='mr-1 h-3.5 w-3.5' /> : <Dumbbell className='mr-1 h-3.5 w-3.5' />}
                <span>
                  {currentRound}/{config.rounds}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      {/* Show footer with preview text during countdown or control buttons after ready */}
      {!isReady ? (
        <CardFooter className='relative z-10 flex items-center justify-center px-4 pt-0 pb-4'>
          <div className='bg-primary/10 w-full rounded-md p-2.5 text-center'>
            <p className='text-primary text-sm font-medium'>Your workout is about to begin!</p>
          </div>
        </CardFooter>
      ) : (
        <CardFooter className='relative z-10 flex items-center justify-between gap-3 px-4 pt-0 pb-4'>
          <Button variant='outline' size='icon' onClick={togglePause} className='size-10 rounded-full'>
            {isPaused ? <Play className='h-4 w-4' /> : <Pause className='h-4 w-4' />}
          </Button>

          <Button variant='outline' onClick={skipCurrent} disabled={isResting} className='rounded-full'>
            <SkipForward className='mr-1.5 h-4 w-4' />
            Skip
          </Button>

          <Button variant='destructive' size='sm' onClick={onRestart} className='rounded-full'>
            Exit
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
