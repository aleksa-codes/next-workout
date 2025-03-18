import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import {
  BicepsFlexed,
  Rocket,
  Clock,
  Dumbbell,
  Target,
  Brain,
  RefreshCw,
  Activity,
  Star,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Learn | Next Workout',
  description: 'Discover how Next Workout can help you achieve your fitness goals with personalized workouts',
};

export default function LearnMore() {
  return (
    <main className='bg-background min-h-screen'>
      {/* Hero section */}
      <section className='from-primary/10 to-background relative bg-gradient-to-b py-4'>
        <div className='container'>
          <Button variant='outline' size='sm' asChild className='mb-4'>
            <Link href='/#workouts' className='flex items-center gap-1'>
              <ChevronLeft className='h-4 w-4' />
              Back to Workouts
            </Link>
          </Button>
          <div className='mx-auto max-w-3xl text-center'>
            <Badge variant='outline' className='border-primary/20 mb-4 rounded-full px-4 py-1'>
              <BicepsFlexed className='text-primary mr-1 h-4 w-4' />
              <span className='font-medium tracking-wide'>ABOUT NEXT WORKOUT</span>
            </Badge>

            <h1 className='mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl'>
              Your Personal <span className='text-primary'>Fitness Partner</span>
            </h1>

            <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-lg'>
              Next Workout helps you achieve your fitness goals with customizable workouts, progress tracking, and
              AI-powered workout generation - all in a simple, easy-to-use application.
            </p>
          </div>
        </div>
      </section>

      {/* Core features section */}
      <section id='features'>
        <div className='container'>
          <div className='mb-12 text-center'>
            <Badge className='mb-2 rounded-full'>
              <Rocket className='mr-1 h-3.5 w-3.5' />
              FEATURES
            </Badge>
            <h2 className='mb-3 text-3xl font-bold tracking-tight'>Why Choose Next Workout</h2>
            <p className='text-muted-foreground mx-auto max-w-2xl'>
              Our app combines the best practices in fitness training with modern technology to deliver an exceptional
              workout experience.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {/* Feature 1 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Clock className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Quick Workouts</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Get effective workouts that fit into your busy schedule, ranging from 5 minutes to hour-long sessions.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Time-efficient:</span> Multiple duration options to match your
                  availability
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Target className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Targeted Training</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Focus on specific muscle groups or training goals with customized workout plans designed for results.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Personalized:</span> Choose from various muscle groups and fitness
                  levels
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Brain className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>AI Workout Creation</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Generate custom workouts with AI assistance tailored to your specific needs, equipment, and goals.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Innovative:</span> Powered by ChatGPT for personalized workout plans
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Dumbbell className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Equipment Flexibility</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Work out with whatever equipment you have available, from bodyweight exercises to full gym setups.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Adaptable:</span> Options for home, gym, or travel workouts
                </div>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <RefreshCw className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Circuit Training</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Choose between straight sets or circuit training to match your preferred workout style and goals.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Versatile:</span> Multiple workout modes for different training
                  approaches
                </div>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className='border-primary/10 hover:border-primary/30 flex flex-col overflow-hidden border transition-all hover:shadow-md'>
              <CardContent className='flex flex-1 flex-col p-6'>
                <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                  <Activity className='text-primary h-6 w-6' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Visual Guidance</h3>
                <p className='text-muted-foreground mb-4 flex-1'>
                  Follow along with video demonstrations of each exercise to ensure proper form and technique.
                </p>
                <div className='bg-muted/30 rounded-lg px-4 py-2 text-sm'>
                  <span className='font-medium'>Educational:</span> Learn correct exercise form as you work out
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className='bg-muted/20 py-16'>
        <div className='container'>
          <div className='mx-auto max-w-3xl'>
            <div className='mb-12 text-center'>
              <Badge variant='outline' className='border-primary/20 mb-2 rounded-full'>
                <Star className='mr-1 h-3.5 w-3.5' />
                HOW IT WORKS
              </Badge>
              <h2 className='mb-3 text-3xl font-bold tracking-tight'>Simple Steps to Better Fitness</h2>
              <p className='text-muted-foreground mx-auto max-w-2xl'>
                Getting started with Next Workout is easy. Follow these simple steps to begin your fitness journey.
              </p>
            </div>

            <ol className='border-muted-foreground/20 relative space-y-8 border-l pl-8'>
              <li className='relative'>
                <div className='bg-primary text-primary-foreground absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full'>
                  1
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Choose a Workout</h3>
                <p className='text-muted-foreground mb-2'>
                  Browse our collection of pre-designed workouts or create your own custom workout with AI assistance.
                </p>
                <div className='rounded-lg border p-3'>
                  <span className='text-primary'>Pro tip:</span> Filter workouts by duration, muscle group, or
                  difficulty level to find the perfect match.
                </div>
              </li>
              <li className='relative'>
                <div className='bg-primary text-primary-foreground absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full'>
                  2
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Customize Your Session</h3>
                <p className='text-muted-foreground mb-2'>
                  Adjust parameters like rounds, reps, and rest periods to tailor the workout to your fitness level.
                </p>
                <div className='rounded-lg border p-3'>
                  <span className='text-primary'>Pro tip:</span> Start with fewer rounds if you&apos;re a beginner and
                  gradually increase as you build strength.
                </div>
              </li>
              <li className='relative'>
                <div className='bg-primary text-primary-foreground absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full'>
                  3
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Follow Along</h3>
                <p className='text-muted-foreground mb-2'>
                  Use the workout interface with timers, video demonstrations, and audio cues to complete your workout.
                </p>
                <div className='rounded-lg border p-3'>
                  <span className='text-primary'>Pro tip:</span> Keep your device in view to follow the video
                  demonstrations for proper form.
                </div>
              </li>
              <li className='relative'>
                <div className='bg-primary text-primary-foreground absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full'>
                  4
                </div>
                <h3 className='mb-2 text-xl font-semibold'>Track Your Progress</h3>
                <p className='text-muted-foreground mb-2'>
                  Complete workouts to build consistency and see improvements in your fitness over time.
                </p>
                <div className='rounded-lg border p-3'>
                  <span className='text-primary'>Pro tip:</span> Aim to work out consistently rather than intensely for
                  the best long-term results.
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className='py-16'>
        <div className='container'>
          <div className='from-primary/5 to-background/0 mx-auto max-w-3xl rounded-2xl bg-gradient-to-b p-8 text-center sm:p-12'>
            <div className='bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
              <Sparkles className='text-primary h-8 w-8' />
            </div>
            <h2 className='mb-4 text-3xl font-bold tracking-tight'>Ready to Get Started?</h2>
            <p className='text-muted-foreground mx-auto mb-8 max-w-xl text-lg'>
              Begin your fitness journey today with Next Workout. No expensive equipment or gym memberships required.
            </p>
            <div className='flex flex-wrap items-center justify-center gap-4'>
              <Button size='lg' asChild className='rounded-full px-8 shadow-md'>
                <Link href='/#workouts'>Browse Workouts</Link>
              </Button>
              <Button size='lg' variant='outline' asChild className='rounded-full px-8'>
                <Link href='/create'>Create Workout</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
