import { useState, useEffect } from 'react';
import { WorkoutPlan } from '@/data/workouts';
import { WorkoutConfig } from '@/lib/schema';
import { cn } from '@/lib/utils';
import WorkoutConfigForm from './workout-config-form';
import WorkoutSession from './workout-session';

export default function WorkoutClient({ workout }: { workout: WorkoutPlan }) {
  const [config, setConfig] = useState<WorkoutConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleConfigSubmit(data: WorkoutConfig) {
    setConfig(data);
  }

  function handleRestartWorkout() {
    setConfig(null);
  }

  return (
    <div
      className={cn(
        'container flex flex-1 flex-col justify-center pb-8 transition-all duration-300',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      {!config ? (
        <WorkoutConfigForm workout={workout} onSubmit={handleConfigSubmit} />
      ) : (
        <WorkoutSession workout={workout} config={config} onRestart={handleRestartWorkout} />
      )}
    </div>
  );
}
