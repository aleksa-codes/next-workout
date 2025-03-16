# Next Workout

A modern fitness application built with Next.js that helps you achieve your fitness goals with customizable workouts, AI-generated workout plans, and visual exercise guidance.

## Features

- 🏋️‍♀️ **Workout Library**: Access a collection of pre-designed workouts for various fitness levels
- 🤖 **AI Workout Generation**: Create custom workouts tailored to your specific needs using AI
- ⏱️ **Flexible Timing**: Choose from quick 5-minute sessions to complete hour-long workouts
- 🔄 **Circuit Training**: Switch between straight sets and circuit training modes
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- 🎬 **Video Demonstrations**: Follow along with embedded video guides for each exercise
- 🎯 **Target Specific Muscles**: Filter workouts by muscle groups and training goals
- ⚙️ **Customizable Parameters**: Adjust rounds, reps, and rest periods to match your fitness level

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Bun (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/next-workout.git
   cd next-workout
   ```

2. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

3. Run the development server:

   ```bash
   bun dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Browsing Workouts

The homepage displays a collection of available workouts. You can:

- View workout details including target muscles, duration, and difficulty
- Click on a workout to see the full routine and begin exercising

### Creating Custom Workouts

1. Click "Create Workout" on the homepage
2. Fill out the form with your preferences:
   - Duration
   - Fitness level
   - Target muscle groups
   - Available equipment
   - Additional notes
3. Generate a workout using AI assistance
4. Save your custom workout to your library

### Starting a Workout Session

1. Select a workout from the library
2. Configure workout parameters:
   - Number of rounds
   - Rep count
   - Rest periods
   - Workout mode (circuit or straight sets)
3. Follow the guided workout with timers and video demonstrations

## Local Storage

The application stores custom workouts in your browser's local storage. No account is required to create and save workouts.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Exercise demonstration videos sourced from YouTube
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
