# Framer Integration Guide

This guide explains how to use the modular course components in Framer.

## Files to Copy to Framer

Copy these files to your Framer project:

### Required Files
1. **app/types.ts** - TypeScript interfaces
2. **app/components/LessonIcon.tsx** - Icon component
3. **app/ModularCourse.tsx** - Main course display component
4. **app/CoursesByGrade.tsx** - Grade-filtered wrapper component
5. **app/lib/supabase.ts** - Supabase client (update with your credentials)
6. **app/services/courseService.ts** - Data fetching logic

### Optional (for local testing)
- **app/data/sampleData.ts** - Sample data for testing without Supabase

## Step-by-Step Integration

### 1. Install Dependencies in Framer

In your Framer project, add these dependencies via the package manager:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1"
  }
}
```

### 2. Set Up Environment Variables

In Framer, add your Supabase credentials as environment variables:
- Go to your Framer project settings
- Add environment variables:
  - `VITE_SUPABASE_URL` = `https://cycfjdvszpctjxoosspf.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`

### 3. Create the Component in Framer

#### Option A: Use CourseNavigation (Recommended - Full UI with Sidebar)

Create a new Code Component in Framer:

```tsx
import CourseNavigation from "./CourseNavigation"

export default function FramerCourses() {
  return <CourseNavigation useSupabase={true} />
}
```

This includes:
- Sidebar navigation with all units
- Grade level filtering
- Search functionality
- Breadcrumb navigation
- Full-screen layout

#### Option B: Use CoursesByGrade (Simpler - Just Tabs)

```tsx
import CoursesByGrade from "./CoursesByGrade"

export default function FramerCourses() {
  return <CoursesByGrade useSupabase={true} />
}
```

#### Option C: Use ModularCourse Directly

If you want to pass custom data or filter differently:

```tsx
import { useState, useEffect } from "react"
import ModularCourse from "./ModularCourse"
import { fetchCourseData } from "./services/courseService"

export default function FramerCourses() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseData().then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>

  return <ModularCourse data={data} useSupabase={false} />
}
```

## Styling in Framer

The components use Tailwind CSS classes. Framer has built-in Tailwind support, so styles should work automatically. If needed, you can customize:

### Custom Styles
Add a style override prop to the components or modify the Tailwind classes directly in the component files.

### Color Customization
Update these classes in the component files:
- **Primary button**: `bg-gray-900 text-white` → Change to your brand color
- **Tags**: `bg-gray-200 text-gray-700` → Customize tag colors
- **Borders**: `border-gray-300` → Match your design system

## Component Props

### CoursesByGrade Props
```tsx
interface CoursesByGradeProps {
  useSupabase?: boolean  // Default: true. Set to false to use sample data
}
```

### ModularCourse Props
```tsx
interface ModularCourseProps {
  data?: CourseData      // Optional: Pass custom data
  useSupabase?: boolean  // Default: true. Fetch from Supabase if no data provided
}
```

## Data Structure

Your Supabase data should match this structure:

### From Supabase
The service automatically fetches from:
- `curriculum_groups` table
- `lessons` table
- `lesson_files` table

### Expected Format
```typescript
{
  units: [
    {
      name: "Unit 1: Introduction",
      lessons: [
        {
          id: 1,
          title: "Lesson 1",
          description: "Lesson description",
          metadata: "Subject: Math • Audience: Middle • Level: Developing",
          lessonPlanUrl: "https://...",
          pptxUrl: "https://..."
        }
      ]
    }
  ]
}
```

## Testing in Framer

1. **Preview Mode**: Test the component in Framer's preview mode
2. **Console Logs**: Open browser console to see debug logs for file URLs
3. **Sample Data**: Set `useSupabase={false}` to test with sample data first

## Common Issues

### Issue: React/TypeScript Errors
**Solution**: Make sure all dependencies are installed in Framer's package manager.

### Issue: Supabase Connection Fails
**Solution**:
1. Check environment variables are set correctly
2. Verify Supabase credentials
3. Check browser console for error messages
4. Set `useSupabase={false}` to test with sample data

### Issue: Files Won't Open
**Solution**:
1. Check `lesson_files` table has correct URLs
2. Ensure Supabase Storage buckets are public (if using Supabase Storage)
3. Check browser console logs to see what URLs are being opened

### Issue: Lessons Not Filtering by Grade
**Solution**:
1. Ensure lesson metadata includes audience level (Elementary/Middle/High)
2. Check the `target_audience` field in your lessons table

## Deployment Checklist

- [ ] All component files copied to Framer
- [ ] Dependencies installed (@supabase/supabase-js)
- [ ] Environment variables configured
- [ ] Supabase tables populated with data
- [ ] File URLs in `lesson_files` table are accessible
- [ ] Tested in Framer preview mode
- [ ] Verified grade filtering works
- [ ] Tested lesson expand/collapse
- [ ] Tested file downloads (Lesson Plan & PPTX)

## Advanced Customization

### Custom Grade Levels
Edit `CoursesByGrade.tsx` line 13 to add more grade levels:
```typescript
type GradeLevel = 'Elementary' | 'Middle' | 'High' | 'College'
```

### Custom Filtering
Modify the filter logic in `CoursesByGrade.tsx` lines 51-58 to filter by different criteria.

### Custom Icons
Update `app/components/LessonIcon.tsx` to add more icon types or use a different icon library.

## Need Help?

- Check browser console for error messages
- Verify Supabase table structure matches expected format
- Test with sample data first (`useSupabase={false}`)
- Check the README.md for database schema details
