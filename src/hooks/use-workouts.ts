'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkoutPlan, workouts as defaultWorkouts } from '@/data/workouts';
import { toast } from 'sonner';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = () => {
      try {
        // Load default workouts
        let allWorkouts = [...defaultWorkouts];

        // Add custom workouts from localStorage
        if (typeof window !== 'undefined') {
          const customWorkoutsJSON = localStorage.getItem('customWorkouts');
          if (customWorkoutsJSON) {
            const customWorkouts = JSON.parse(customWorkoutsJSON);
            allWorkouts = [...allWorkouts, ...customWorkouts];
          }
        }

        setWorkouts(allWorkouts);
      } catch (error) {
        console.error('Error loading workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  // Memoize the getWorkoutById function with useCallback
  const getWorkoutById = useCallback((id: string): WorkoutPlan | undefined => {
    // First check default workouts
    const defaultWorkout = defaultWorkouts.find((workout) => workout.id === id);
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
  }, []);

  const deleteWorkout = (id: string) => {
    try {
      // Only delete custom workouts (not default ones)
      if (defaultWorkouts.some((workout) => workout.id === id)) {
        toast.error('Cannot delete default workouts');
        return false;
      }

      // Get current custom workouts
      const customWorkoutsJSON = localStorage.getItem('customWorkouts');
      if (customWorkoutsJSON) {
        const customWorkouts: WorkoutPlan[] = JSON.parse(customWorkoutsJSON);

        // Filter out the workout to delete
        const updatedWorkouts = customWorkouts.filter((workout) => workout.id !== id);

        // Save back to localStorage
        localStorage.setItem('customWorkouts', JSON.stringify(updatedWorkouts));

        // Update state
        setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id));

        toast.success('Workout deleted successfully');
        return true;
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
    return false;
  };

  return {
    workouts,
    isLoading,
    deleteWorkout,
    getWorkoutById,
  };
}
