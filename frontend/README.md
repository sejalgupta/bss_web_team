# BSS Frontend - Modular Course Component

This is a modular React + TypeScript frontend for displaying course units and lessons with Supabase integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase (optional):
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   - If you don't configure Supabase, the app will use sample data

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## Project Structure

```
frontend/
├── app/
│   ├── ModularCourse.tsx    # Main component
│   ├── types.ts              # TypeScript interfaces
│   └── data/
│       └── sampleData.ts     # Sample data for local testing
├── src/
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles with Tailwind
├── index.html                # HTML template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── tailwind.config.js        # Tailwind config
```

## How It Works

The application includes multiple views:

### `CourseNavigation` Component (Current - Main View)
**Full navigation experience with sidebar:**
- **Sidebar** with all units listed
- **Grade level filters** (All, Elementary, Middle, High)
- **Search bar** to find specific units
- Click any unit to view only that unit's lessons
- Breadcrumb navigation to go back to all units
- Shows lesson count for each unit

### `CoursesByGrade` Component (Alternative)
**Simpler tab-based view:**
- Displays grade selector tabs (Elementary, Middle, High) at the top
- Automatically filters lessons based on selected grade
- Shows all units for the selected grade

### `ModularCourse` Component (Base)
**Core lesson display:**
- Displays units and lessons with expand/collapse functionality
- Click on a lesson to expand and see its description
- When expanded, two buttons appear: "Lesson Plan" and "Lesson PPTX"
- Lesson metadata (Subject, Audience, Level) shown as small tags
- The component accepts a `data` prop of type `CourseData`
- If no data is provided, it uses sample data from `app/data/sampleData.ts`

## Supabase Database Schema

The app connects to your existing Supabase database with the following structure:

### `curriculum_groups` table
- `id` (uuid, primary key)
- `name` (text) - e.g., "Unit 1: Introduction to Physics"
- `description` (text) - group description

### `lessons` table
- `id` (uuid, primary key)
- `curriculum_group_id` (uuid, foreign key to curriculum_groups.id)
- `title` (text) - e.g., "Newton's Laws of Motion"
- `subject` (text) - lesson subject
- `target_audience` (text) - intended audience
- `level` (text) - difficulty level
- `learning_objectives` (jsonb) - learning objectives
- `materials` (jsonb) - required materials
- `teaching_activities` (jsonb) - teaching activities
- And other fields...

### `lesson_files` table
- `id` (uuid, primary key)
- `lesson_id` (uuid, foreign key to lessons.id)
- `file_url` (text) - URL to the file
- `file_type` (text) - type of file (e.g., "lesson_plan", "pptx", "pdf")

## How the Supabase Integration Works

The `ModularCourse` component automatically:
1. Fetches data from Supabase on mount (if credentials are configured)
2. Falls back to sample data if Supabase is not configured or fails
3. Shows a loading spinner while fetching
4. Displays an error message if data fetch fails (but still shows sample data)

You can control this behavior with props:
```tsx
// Use Supabase (default)
<ModularCourse />

// Use only sample data (bypass Supabase)
<ModularCourse useSupabase={false} />

// Use custom data
<ModularCourse data={customData} />
```

## Integrating with Framer

To use this with Framer:

1. Copy the component files to your Framer project
2. Either:
   - Set up environment variables in Framer with your Supabase credentials
   - Pass data directly as a prop:

```tsx
import ModularCourse from './ModularCourse'

// Option 1: Let the component fetch from Supabase automatically
export default function FramerComponent() {
  return <ModularCourse />
}

// Option 2: Fetch data yourself and pass it as a prop
export default function FramerComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // Your custom fetch logic
    fetchYourData().then(setData)
  }, [])

  return <ModularCourse data={data} />
}
```

## Modular Design

The component is fully modular:
- **Types** are defined in `app/types.ts`
- **Sample data** is in `app/data/sampleData.ts`
- **Component** is in `app/ModularCourse.tsx`
- You can easily swap out the sample data with Supabase data by passing it as a prop
