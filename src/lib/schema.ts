import * as z from 'zod';

export const workoutModes = ['straight-sets', 'circuit'] as const;

export const workoutConfigSchema = z.object({
  selectedExercises: z.array(z.string()).min(1, {
    message: 'Please select at least one exercise',
  }),
  rounds: z.number().min(1).max(10),
  repsPerExercise: z.number().min(1).max(30),
  restPeriod: z.number().min(5).max(120),
  timePerRep: z.number().min(1).max(60),
  workoutMode: z.enum(['straight-sets', 'circuit']),
  zyzzMode: z.boolean().default(false), // Add Zyzz mode setting
});

export type WorkoutConfig = z.infer<typeof workoutConfigSchema>;
