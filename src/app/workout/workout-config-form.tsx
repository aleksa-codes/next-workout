import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WorkoutPlan } from '@/data/workouts';
import { WorkoutConfig, workoutConfigSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, Repeat, RefreshCw, Dumbbell, Clock, Timer, BicepsFlexed, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface WorkoutConfigFormProps {
  workout: WorkoutPlan;
  onSubmit: (data: WorkoutConfig) => void;
}

export default function WorkoutConfigForm({ workout, onSubmit }: WorkoutConfigFormProps) {
  const [zyzzClicks, setZyzzClicks] = useState(0);

  // Setup form with default values
  const form = useForm<WorkoutConfig>({
    resolver: zodResolver(workoutConfigSchema),
    defaultValues: {
      selectedExercises: workout.exercises.map((ex) => ex.name),
      rounds: 2,
      repsPerExercise: 8,
      restPeriod: 30,
      timePerRep: 5,
      workoutMode: 'straight-sets',
      zyzzMode: false,
    },
  });

  // Update Zyzz easter egg click handler to trigger confetti with multiple emoji shapes
  const handleZyzzClick = () => {
    const newClicks = zyzzClicks + 1;
    setZyzzClicks(newClicks);
    if (newClicks === 3 && typeof window !== 'undefined') {
      // Define an array of Zyzz-themed emojis
      const emojis = ['⚡', '💪', '🏛️', '😎', '🦾', '🏋️', '👑'];
      // Convert each emoji into a confetti shape using canvas-confetti's shapeFromText helper
      const emojiShapes = emojis.map((emoji) =>
        confetti.shapeFromText({ text: emoji, scalar: 3, color: '#FFD700', fontFamily: 'Arial' }),
      );
      // Fire confetti using all emoji shapes at once
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 0.5, y: 0.5 },
        shapes: emojiShapes,
        scalar: 3,
      });
    }
  };

  return (
    <Card className='border-border/80 overflow-hidden border shadow-lg backdrop-blur-sm'>
      <div className='bg-primary/5 absolute inset-0 z-0'></div>
      <CardHeader className='relative z-10'>
        <CardTitle className='flex flex-row justify-between text-2xl font-medium tracking-tight'>
          Customize Your Workout
          <span onClick={handleZyzzClick} className='text-primary inline-block cursor-pointer select-none'>
            Ψ
          </span>
        </CardTitle>
        <CardDescription>Select exercises and set your workout parameters</CardDescription>
      </CardHeader>

      <CardContent className='relative z-10'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='selectedExercises'
              render={() => (
                <FormItem>
                  <div className='mb-3'>
                    <FormLabel className='text-base font-medium'>Exercises</FormLabel>
                    <FormDescription className='text-sm'>
                      Choose which exercises to include in your workout
                    </FormDescription>
                  </div>

                  <ScrollArea className='h-56 rounded-md border'>
                    <div className='space-y-2 p-2'>
                      {workout.exercises.map((exercise) => (
                        <FormField
                          key={exercise.name}
                          control={form.control}
                          name='selectedExercises'
                          render={({ field }) => (
                            <FormItem
                              key={exercise.name}
                              className='hover:bg-muted/30 flex flex-row items-center space-y-0 space-x-3 rounded-md border p-3 transition-colors'
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(exercise.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, exercise.name])
                                      : field.onChange(field.value?.filter((value) => value !== exercise.name));
                                  }}
                                />
                              </FormControl>
                              <div className='w-full space-y-1 leading-none'>
                                <div className='flex items-center justify-between'>
                                  <FormLabel className='font-medium'>{exercise.name}</FormLabel>
                                  <div className='flex flex-wrap justify-end gap-1'>
                                    {exercise.targetMuscles.length > 2 ? (
                                      <>
                                        <Badge variant='outline' className='text-xs'>
                                          {exercise.targetMuscles[0]}
                                        </Badge>
                                        <Badge variant='outline' className='text-xs'>
                                          +{exercise.targetMuscles.length - 1}
                                        </Badge>
                                      </>
                                    ) : (
                                      exercise.targetMuscles.map((muscle) => (
                                        <Badge key={muscle} variant='outline' className='text-xs'>
                                          {muscle}
                                        </Badge>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className='mb-3 text-base font-medium'>Workout Mode</h3>
              <FormField
                control={form.control}
                name='workoutMode'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormDescription className='mb-3 text-sm'>
                      Choose how you want to sequence your exercises
                    </FormDescription>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='grid grid-cols-1 gap-3 sm:grid-cols-2'
                    >
                      <FormItem>
                        <FormLabel className='[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/10'>
                          <FormControl>
                            <RadioGroupItem value='straight-sets' className='sr-only' />
                          </FormControl>
                          <div className='border-border/60 hover:border-primary/50 hover:bg-muted/50 flex items-start gap-3 rounded-md border p-3 transition-colors'>
                            <ArrowRight className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                            <div className='min-w-0 space-y-1'>
                              <p className='leading-none font-medium'>Straight Sets</p>
                              <p className='text-muted-foreground text-sm'>
                                Complete all sets of one exercise before moving to the next
                              </p>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className='[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-primary/10'>
                          <FormControl>
                            <RadioGroupItem value='circuit' className='sr-only' />
                          </FormControl>
                          <div className='border-border/60 hover:border-primary/50 hover:bg-muted/50 flex items-start gap-3 rounded-md border p-3 transition-colors'>
                            <Repeat className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                            <div className='min-w-0 space-y-1'>
                              <p className='leading-none font-medium'>Circuit Training</p>
                              <p className='text-muted-foreground text-sm'>
                                Complete one round of all exercises, then repeat
                              </p>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Zyzz Mode - Only visible after clicking the hidden trigger */}
              {zyzzClicks >= 3 && (
                <div className='animate-in fade-in slide-in-from-top mt-3 rounded-lg border border-amber-200/30 bg-gradient-to-r from-amber-100/30 to-yellow-100/30 p-3 duration-500'>
                  <div className='mb-2 text-center'>
                    <p className='text-xs font-medium text-amber-800/70'>
                      🕊️ In loving memory of Aziz Shavershian 💙
                      <br />
                      <span className='text-amber-700/60'>(1989-2011)</span>
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name='zyzzMode'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between space-y-0 space-x-2'>
                        <div className='space-y-0.5'>
                          <FormLabel className='flex items-center gap-1.5 text-base'>
                            <BicepsFlexed className='h-4 w-4 text-amber-500' />
                            Zyzz Mode
                          </FormLabel>
                          <FormDescription className='text-xs text-amber-700/70'>
                            &ldquo;We&apos;re all gonna make it brah&rdquo; - Zyzz
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='data-[state=checked]:bg-amber-500'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className='mb-3 text-base font-medium'>Workout Parameters</h3>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='rounds'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1.5'>
                        <RefreshCw className='text-primary h-3.5 w-3.5' />
                        Rounds
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className='focus-visible:ring-primary/20'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='restPeriod'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1.5'>
                        <Clock className='text-primary h-3.5 w-3.5' />
                        Rest Period (sec)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className='focus-visible:ring-primary/20'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='repsPerExercise'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1.5'>
                        <Dumbbell className='text-primary h-3.5 w-3.5' />
                        Reps per Exercise
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className='focus-visible:ring-primary/20'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='timePerRep'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-1.5'>
                        <Timer className='text-primary h-3.5 w-3.5 shrink-0' />
                        Rep Time (sec)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className='focus-visible:ring-primary/20'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <CardFooter className='flex justify-end px-0'>
              <Button
                type='submit'
                className='flex items-center gap-1 rounded-full transition-transform hover:scale-105 active:scale-95'
              >
                <PlayCircle className='h-4 w-4' />
                Start Workout
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
