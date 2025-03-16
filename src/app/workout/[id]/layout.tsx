import type { Metadata } from 'next';
import { getWorkoutById } from '@/data/workouts';

interface WorkoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WorkoutLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const workout = getWorkoutById(id);

  if (!workout) {
    return {
      title: 'Workout Not Found',
    };
  }

  return {
    title: `${workout.title} | Next Workout`,
    description: workout.description,
  };
}

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
