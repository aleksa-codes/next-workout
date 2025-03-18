'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  WandSparkles,
  CopyCheck,
  ExternalLink,
  Dumbbell,
  Sparkles,
  AlertTriangle,
  Trophy,
  Youtube,
  ChevronRight,
  BicepsFlexed,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { workoutPlanSchema, type WorkoutPlan } from '@/data/workouts';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Equipment options
const equipmentOptions = [
  { id: 'none', label: 'No Equipment / Bodyweight' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'resistanceBands', label: 'Resistance Bands' },
  { id: 'kettlebell', label: 'Kettlebell' },
  { id: 'pullupBar', label: 'Pull-up Bar' },
  { id: 'bench', label: 'Bench' },
];

// Muscle group options
const muscleOptions = [
  { id: 'fullBody', label: 'Full Body' },
  { id: 'upperBody', label: 'Upper Body' },
  { id: 'lowerBody', label: 'Lower Body' },
  { id: 'core', label: 'Core / Abs' },
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'legs', label: 'Legs' },
  { id: 'glutes', label: 'Glutes' },
];

// Form schema
const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.string(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  focusAreas: z.array(z.string()),
  equipment: z.array(z.string()),
  specificNeeds: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WorkoutGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [importedWorkout, setImportedWorkout] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // Track current step

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '15-20',
      fitnessLevel: 'beginner',
      focusAreas: [],
      equipment: [],
      specificNeeds: '',
    },
  });

  const generateChatGPTPrompt = (values: FormValues) => {
    const selectedMuscles = muscleOptions
      .filter((muscle) => values.focusAreas.includes(muscle.id))
      .map((muscle) => muscle.label)
      .join(', ');

    const selectedEquipment = equipmentOptions
      .filter((eq) => values.equipment.includes(eq.id))
      .map((eq) => eq.label)
      .join(', ');

    const prompt = `I need you to create a workout plan with the following specifications and return ONLY a JSON object in the exact format specified below, with no additional text, explanation, or markdown formatting.

Requirements:
- Title: ${values.title || '[Generate an appropriate title]'}
- Description: ${values.description || '[Generate a brief description]'}
- Duration: ${values.duration} minutes
- Fitness Level: ${values.fitnessLevel}
- Target Muscle Areas: ${selectedMuscles || 'Full Body'}
- Available Equipment: ${selectedEquipment || 'No equipment (bodyweight only)'}
${values.specificNeeds ? `- Additional Notes: ${values.specificNeeds}` : ''}

The workout should include exercises that can be completed within the specified time frame and are appropriate for the fitness level indicated. Each exercise should have clear instructions and at least one YouTube video URL demonstration.

RESPONSE FORMAT: Return ONLY the JSON object below with appropriate values filled in. No other text should be included in your response.

{
  "id": "unique-workout-id",
  "title": "Workout Title",
  "description": "Brief description",
  "level": "${values.fitnessLevel}",
  "duration": "${values.duration} min",
  "instructions": {
    "rounds": "Number of rounds (e.g., 2-3 rounds)",
    "reps": "Repetitions per exercise (e.g., 8-12 reps)",
    "rest": "Rest duration between exercises (e.g., 30-45 seconds)"
  },
  "exercises": [
    {
      "name": "Exercise Name",
      "targetMuscles": ["Primary Muscle", "Secondary Muscle"],
      "videoUrls": ["YouTube URL for demonstration"],
      "instructions": [
        "Step 1 of the exercise",
        "Step 2 of the exercise",
        "Step 3 of the exercise"
      ],
      "altering": false
    }
  ]
}

IMPORTANT: Your entire response must contain only the JSON above with no other text, commentary, or explanations. I need only machine-parseable JSON. Return it as a code block.
`;

    setGeneratedPrompt(prompt);
    setShowPrompt(true);
    return prompt;
  };

  function onSubmit(values: FormValues) {
    const prompt = generateChatGPTPrompt(values);
    setGeneratedPrompt(prompt);
    setShowPrompt(true);
    setCurrentStep(2);

    // Scroll to the prompt section
    setTimeout(() => {
      document.getElementById('prompt-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function handleImportWorkout() {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Try to parse the JSON string
      let parsedData: unknown;

      try {
        parsedData = JSON.parse(importedWorkout);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setValidationError('Invalid JSON format. Please paste the complete JSON response from ChatGPT.');
        setIsValidating(false);
        return;
      }

      // Validate against our schema
      const result = workoutPlanSchema.safeParse(parsedData);

      if (!result.success) {
        // Format the error message for better readability
        const formattedError = result.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('\n');

        setValidationError(`Validation failed:\n${formattedError}`);
        toast.error('Workout validation failed', {
          description: "The workout data doesn't match the required format. Check the error message for details.",
        });
        setIsValidating(false);
        return;
      }

      // Success case - we have valid data
      const validatedWorkout = result.data;

      // Save to local storage
      saveWorkoutToLocalStorage(validatedWorkout);

      // Show success message
      toast.success('Workout saved successfully', {
        description: `"${validatedWorkout.title}" has been saved and added to your workouts.`,
      });

      // Set current step to completed
      setCurrentStep(3);
    } catch (error) {
      console.error('Error validating workout:', error);
      setValidationError('An unexpected error occurred while validating the workout.');
      toast.error('Validation error', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  }

  // Function to save workout to local storage
  function saveWorkoutToLocalStorage(workout: WorkoutPlan) {
    try {
      // Get existing custom workouts or initialize empty array
      const existingWorkoutsJSON = localStorage.getItem('customWorkouts');
      const existingWorkouts: WorkoutPlan[] = existingWorkoutsJSON ? JSON.parse(existingWorkoutsJSON) : [];

      // Add new workout
      existingWorkouts.push(workout);

      // Save back to local storage
      localStorage.setItem('customWorkouts', JSON.stringify(existingWorkouts));
    } catch (error) {
      console.error('Error saving to local storage:', error);
      toast.error('Failed to save workout locally');
    }
  }

  const encodedPrompt = encodeURIComponent(generatedPrompt || '');
  const chatGptUrl = `https://chat.openai.com/?model=gpt-4o-mini&q=${encodedPrompt}&temporary-chat=true`;

  return (
    <div className='mx-auto max-w-4xl'>
      {/* Step indicators with improved styling */}
      <div className='relative mb-10'>
        <div className='bg-muted/70 absolute top-4 right-[11%] left-[11%] -z-10 h-0.5'></div>
        <div className='flex justify-between'>
          {[1, 2, 3].map((step) => (
            <div key={step} className='z-10 flex flex-col items-center'>
              <div
                className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  currentStep === step
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : currentStep > step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                } `}
              >
                {step}
              </div>
              <div className='text-muted-foreground text-xs font-medium'>
                {step === 1 ? 'Define workout' : step === 2 ? 'Generate & paste' : 'Complete'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card className='border-primary/10 from-card to-background border bg-gradient-to-br shadow-md'>
        {currentStep === 1 && (
          <>
            <CardHeader className='pb-4'>
              <Badge variant='outline' className='border-primary/20 mb-2 w-fit'>
                <Dumbbell className='text-primary mr-1 h-3.5 w-3.5' />
                STEP 1
              </Badge>
              <CardTitle className='text-2xl'>Workout Details</CardTitle>
              <CardDescription>Fill out the form to create your personalized workout</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  {/* Basic details section - Improved layout */}
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-6'>
                      <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Workout Title <span className='text-muted-foreground'>(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder='E.g., Quick Morning HIIT' {...field} />
                            </FormControl>
                            <FormDescription className='text-xs'>Leave blank for AI suggestion</FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Workout Description <span className='text-muted-foreground'>(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Describe what you want this workout to accomplish'
                                {...field}
                                rows={3}
                                className='resize-none'
                              />
                            </FormControl>
                            <FormDescription className='text-xs'>Leave blank for AI suggestion</FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='space-y-6 md:space-y-12'>
                      <FormField
                        control={form.control}
                        name='duration'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Workout Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select duration' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='5-10'>5-10 minutes (Quick)</SelectItem>
                                <SelectItem value='15-20'>15-20 minutes (Standard)</SelectItem>
                                <SelectItem value='25-30'>25-30 minutes (Extended)</SelectItem>
                                <SelectItem value='40-60'>40-60 minutes (Full Session)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='fitnessLevel'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fitness Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className='flex flex-wrap gap-3'
                              >
                                <FormItem className='flex items-center'>
                                  <FormControl>
                                    <RadioGroupItem value='beginner' id='beginner' className='peer sr-only' />
                                  </FormControl>
                                  <Label
                                    htmlFor='beginner'
                                    className='border-muted bg-background hover:bg-muted/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-normal transition-all'
                                  >
                                    Beginner
                                  </Label>
                                </FormItem>
                                <FormItem className='flex items-center space-y-0'>
                                  <FormControl>
                                    <RadioGroupItem value='intermediate' id='intermediate' className='peer sr-only' />
                                  </FormControl>
                                  <Label
                                    htmlFor='intermediate'
                                    className='border-muted bg-background hover:bg-muted/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-normal transition-all'
                                  >
                                    Intermediate
                                  </Label>
                                </FormItem>
                                <FormItem className='flex items-center space-y-0'>
                                  <FormControl>
                                    <RadioGroupItem value='advanced' id='advanced' className='peer sr-only' />
                                  </FormControl>
                                  <Label
                                    htmlFor='advanced'
                                    className='border-muted bg-background hover:bg-muted/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-normal transition-all'
                                  >
                                    Advanced
                                  </Label>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Equipment and Muscle Groups in a two-column layout */}
                  <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                    {/* Equipment section */}
                    <div>
                      <h3 className='mb-4 flex items-center gap-2 text-sm font-medium'>
                        <span className='bg-primary/10 flex size-6 items-center justify-center rounded-full'>
                          <Dumbbell className='text-primary size-4' />
                        </span>
                        Available Equipment
                      </h3>
                      <div className='bg-muted/20 space-y-2.5 rounded-lg p-4'>
                        <div className='grid grid-cols-1 gap-2.5'>
                          {equipmentOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name='equipment'
                              render={({ field }) => (
                                <FormItem className='flex items-center space-y-0 space-x-2'>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className='cursor-pointer text-sm font-normal'>{option.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Muscle groups section */}
                    <div>
                      <h3 className='mb-4 flex items-center gap-2 text-sm font-medium'>
                        <span className='bg-primary/10 flex size-6 items-center justify-center rounded-full'>
                          <BicepsFlexed className='text-primary size-4' />
                        </span>
                        Target Muscle Groups
                      </h3>
                      <div className='bg-muted/20 rounded-lg p-4'>
                        <div className='grid grid-cols-2 gap-2.5'>
                          {muscleOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name='focusAreas'
                              render={({ field }) => (
                                <FormItem className='flex items-center space-y-0 space-x-2'>
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(field.value?.filter((value) => value !== option.id));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className='cursor-pointer text-sm font-normal'>{option.label}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className='bg-muted/20 rounded-lg p-5'>
                    <FormField
                      control={form.control}
                      name='specificNeeds'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium'>
                            Additional Notes <span className='text-muted-foreground'>(Optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Any limitations, injuries or specific requirements?'
                              {...field}
                              rows={2}
                              className='bg-background/80 mt-2 resize-none'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type='submit' className='mt-4 w-full rounded-full shadow-md'>
                      <WandSparkles className='h-4 w-4' />
                      Create Workout
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {showPrompt && (
          <div id='prompt-section'>
            <CardHeader className='pb-4'>
              <Badge variant='outline' className='border-primary/20 mb-2 w-fit'>
                <Sparkles className='text-primary mr-1 h-3.5 w-3.5' />
                {currentStep === 3 ? 'COMPLETED' : 'STEP 2'}
              </Badge>
              <CardTitle className='text-2xl'>{currentStep === 3 ? 'Workout Created!' : 'Generate with AI'}</CardTitle>
              <CardDescription>
                {currentStep === 3
                  ? 'Your workout has been saved successfully'
                  : 'Use ChatGPT to generate your personalized workout'}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
              {currentStep < 3 && (
                <Alert variant='default' className='bg-primary/5 border-primary/20'>
                  <AlertDescription className='flex items-start gap-3'>
                    <ChevronRight className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                    <div className='space-y-2'>
                      <p>Follow these simple steps:</p>
                      <ol className='ml-5 list-decimal space-y-1 text-sm'>
                        <li>
                          Click <strong>Open in ChatGPT</strong> or copy the prompt
                        </li>
                        <li>Wait for ChatGPT to generate your workout</li>
                        <li>
                          Copy the <strong>entire JSON response</strong> and paste below
                        </li>
                      </ol>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {currentStep === 2 && (
                <>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 rounded-full'
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPrompt);
                        toast.success('Copied to clipboard');
                      }}
                    >
                      <CopyCheck className='h-3.5 w-3.5' />
                      Copy Prompt
                    </Button>
                    <Button
                      size='sm'
                      className='h-8 rounded-full shadow-sm'
                      onClick={() => window.open(chatGptUrl, '_blank')}
                    >
                      <ExternalLink className='h-3.5 w-3.5' />
                      Open in ChatGPT
                    </Button>
                  </div>

                  <div className='bg-muted/20 mt-6 rounded-lg p-5'>
                    <Label htmlFor='importedWorkout' className='mb-2 block text-sm font-medium'>
                      Paste ChatGPT Response
                    </Label>
                    <Textarea
                      id='importedWorkout'
                      placeholder='Paste the full JSON response from ChatGPT here...'
                      value={importedWorkout}
                      onChange={(e) => {
                        setImportedWorkout(e.target.value);
                        setValidationError(null);
                      }}
                      className={`bg-card/50 h-40 resize-none ${validationError ? 'border-red-500' : ''}`}
                    />

                    {validationError && (
                      <Alert variant='destructive' className='mt-3'>
                        <AlertTriangle className='h-4 w-4' />
                        <AlertTitle>Validation Error</AlertTitle>
                        <AlertDescription className='text-sm'>{validationError}</AlertDescription>
                      </Alert>
                    )}

                    <div className='mt-4'>
                      <Button
                        className='w-full rounded-full shadow-md'
                        disabled={!importedWorkout.trim() || isValidating}
                        onClick={handleImportWorkout}
                      >
                        {isValidating ? (
                          <span className='animate-pulse'>Validating...</span>
                        ) : (
                          <>
                            <Dumbbell className='h-4 w-4' />
                            Save Workout
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className='flex flex-col items-center'>
                  <div className='bg-primary/10 mb-6 rounded-full p-5'>
                    <Trophy className='text-primary h-10 w-10' />
                  </div>
                  <p className='mb-4 text-center text-lg'>Your workout has been created and saved successfully!</p>

                  {/* Move the video tips box here */}
                  <Alert variant='default' className='mb-6 max-w-xl border-amber-200 bg-amber-50/50'>
                    <AlertDescription className='flex items-start gap-3'>
                      <Youtube className='mt-0.5 h-5 w-5 shrink-0 text-amber-600' />
                      <div className='space-y-2 text-amber-800'>
                        <p className='font-medium'>About Exercise Videos</p>
                        <p className='text-sm'>
                          You might want to customize the exercise videos later. AI-selected videos vary in quality, but
                          the best workout experience comes from short (20-30s) demonstrations that clearly show proper
                          form.
                        </p>
                        <p className='mt-1 text-xs'>
                          <strong>Recommended channels:</strong>{' '}
                          <a
                            href='https://www.youtube.com/@FunctionalBodybuilding'
                            target='_blank'
                            rel='noreferrer'
                            className='text-amber-700 underline hover:text-amber-800'
                          >
                            Functional Bodybuilding
                          </a>
                          ,{' '}
                          <a
                            href='https://www.youtube.com/@OPEXFitness'
                            target='_blank'
                            rel='noreferrer'
                            className='text-amber-700 underline hover:text-amber-800'
                          >
                            OPEX Fitness
                          </a>
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Button asChild className='rounded-full px-10 py-6 shadow-md'>
                    <Link href='/'>View My Workouts</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {/* Only show the hidden prompt details if needed */}
        {showPrompt && currentStep === 2 && (
          <CardFooter className='flex-col border-t pt-6'>
            <div className='w-full'>
              <details className='text-sm'>
                <summary className='mb-2 cursor-pointer font-medium'>View Generated Prompt</summary>
                <div className='bg-muted/30 max-h-40 overflow-y-auto rounded-md border p-3 text-xs whitespace-pre-wrap'>
                  {generatedPrompt}
                </div>
              </details>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
