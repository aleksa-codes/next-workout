import * as z from 'zod';

// Define schema for Exercise
export const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  targetMuscles: z.array(z.string()).min(1, 'At least one target muscle is required'),
  videoUrls: z.array(z.string().url('Must be a valid URL')).min(1, 'At least one video URL is required'),
  instructions: z.array(z.string()).min(1, 'At least one instruction is required'),
  altering: z.boolean().default(false).optional(),
});

// Define schema for WorkoutPlan
export const workoutPlanSchema = z.object({
  id: z.string().min(1, 'Workout ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], 'Level must be beginner, intermediate, or advanced'),
  duration: z.string().min(1, 'Duration is required'),
  instructions: z.object({
    rounds: z.string().min(1, 'Rounds information is required'),
    reps: z.string().min(1, 'Reps information is required'),
    rest: z.string().min(1, 'Rest information is required'),
  }),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

// Derive types from schemas
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutPlan = z.infer<typeof workoutPlanSchema>;

// Convert to an array of workouts
export const workouts: WorkoutPlan[] = [
  {
    id: 'full-body-beginner',
    title: 'Full-Body Beginner Dumbbell Workout',
    description: 'Perfect for beginners looking for an effective, low-noise workout',
    level: 'beginner',
    duration: '15-20 min',
    instructions: {
      rounds: '2–3 rounds',
      reps: '8–12 per exercise (per side for alternating moves)',
      rest: '20–30 seconds between exercises',
    },
    exercises: [
      {
        name: 'Alternating Bicep Curls',
        targetMuscles: ['Arms'],
        videoUrls: ['https://www.youtube.com/watch?v=WYezBGuUsdw', 'https://www.youtube.com/watch?v=o2Tma5Cek48'],
        instructions: [
          'Hold a dumbbell in each hand, palms facing forward',
          'Curl one arm up, lower it, then curl the other arm up',
          "Keep movement controlled, don't swing your arms",
        ],
        altering: true,
      },
      {
        name: 'Goblet Squat',
        targetMuscles: ['Legs', 'Glutes'],
        videoUrls: ['https://www.youtube.com/watch?v=pEGfGwp6IEA', 'https://www.youtube.com/watch?v=a-dqF4NL2K4'],
        instructions: [
          'Hold one dumbbell close to your chest',
          'Lower yourself into a squat, keeping your back straight',
          'Push back up through your heels',
        ],
      },
      {
        name: 'Dumbbell Shoulder Press',
        targetMuscles: ['Shoulders'],
        videoUrls: ['https://www.youtube.com/watch?v=OM23fjJB3-0', 'https://www.youtube.com/watch?v=Did01dFR3Lk'],
        instructions: ['Hold both dumbbells at shoulder height', 'Press them up slowly', 'Lower them back down'],
      },
      {
        name: 'Bent-over Rows',
        targetMuscles: ['Back', 'Arms'],
        videoUrls: ['https://www.youtube.com/watch?v=VP_f9V854og', 'https://www.youtube.com/watch?v=aVH_cG4UISc'],
        instructions: [
          'Slightly bend forward, keeping your back straight',
          'Pull the dumbbells up toward your ribs',
          'Squeeze your shoulder blades, then lower',
        ],
      },
      {
        name: 'Dumbbell Deadlifts',
        targetMuscles: ['Legs', 'Glutes'],
        videoUrls: ['https://www.youtube.com/watch?v=zfuc5ynsTlc', 'https://www.youtube.com/watch?v=plb5jEO4Unw'],
        instructions: [
          'Hold dumbbells in front of you',
          'Lower them toward your shins while keeping your back straight',
          'Stand back up using your legs, not your lower back',
        ],
      },
      {
        name: 'Standing Calf Raises',
        targetMuscles: ['Legs'],
        videoUrls: ['https://www.youtube.com/watch?v=ADIDoYt_ko4', 'https://www.youtube.com/watch?v=_iYwv4QVFjM'],
        instructions: [
          'Hold dumbbells by your sides',
          'Lift your heels off the floor',
          'Hold for a second, then lower back down',
        ],
      },
      {
        name: 'Dumbbell Floor Press',
        targetMuscles: ['Chest', 'Triceps'],
        videoUrls: ['https://www.youtube.com/watch?v=tXv-rEa5xn8', 'https://www.youtube.com/watch?v=jjlekYs1cfQ'],
        instructions: [
          'Lie on your back on the floor, holding dumbbells above your chest',
          'Lower them slowly until your elbows touch the floor',
          'Press back up',
        ],
      },
      {
        name: 'Russian Twists',
        targetMuscles: ['Core'],
        videoUrls: [
          'https://www.youtube.com/watch?v=Tau0hsW8iR0',
          'https://www.youtube.com/watch?v=Hvtxbidjins',
          'https://www.youtube.com/watch?v=pzMWYoeSCzw',
        ],
        instructions: [
          'Sit down with a dumbbell in both hands',
          'Lean back slightly and twist your torso to one side, then the other',
          'Keep movements slow and controlled',
        ],
      },
    ],
  },
];

export function getWorkoutById(id: string): WorkoutPlan | undefined {
  // First check built-in workouts
  const defaultWorkout = workouts.find((workout) => workout.id === id);
  if (defaultWorkout) return defaultWorkout;

  // If not found, check local storage for custom workouts
  if (typeof window !== 'undefined') {
    try {
      const customWorkoutsJSON = localStorage.getItem('customWorkouts');
      if (customWorkoutsJSON) {
        const customWorkouts: WorkoutPlan[] = JSON.parse(customWorkoutsJSON);
        return customWorkouts.find((workout) => workout.id === id);
      }
    } catch (error) {
      console.error('Error retrieving custom workouts:', error);
    }
  }

  return undefined;
}
