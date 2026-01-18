# Framer Setup Guide - Gayatri Pariwar Course System

This guide explains how to set up the complete course system in Framer with home page and grade-specific pages.

## Architecture Overview

You'll create **4 pages** in Framer:
- `/` (Home) - Landing page with grade level selection
- `/elementary` - Elementary school lessons (light blue theme)
- `/middle` - Middle school lessons (light yellow theme)
- `/high` - High school lessons (light green theme)

Each grade page includes:
- **Top navigation bar** - Switches between Home, Elementary, Middle, High
- **Left sidebar** - Shows units filtered by current grade level with search
- **Hero section** - Centered title and description with colored background
- **Lesson cards** - Expandable cards with tags, descriptions, and download buttons

---

## Step 1: Install Dependencies

In your Framer project, go to **File → Settings → Package Manager** and add:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1"
  }
}
```

---

## Step 2: Set Environment Variables

In Framer project settings, add these environment variables:
- `VITE_SUPABASE_URL` = `https://cycfjdvszpctjxoosspf.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `[your-anon-key-here]`

---

## Step 3: Copy Files to Framer Code Panel

Copy these files from your local project to Framer's **Code** tab (create a new file for each):

### Core Files (Required)

1. **`types.ts`** - TypeScript interfaces
   - Copy from: `app/types.ts`

2. **`supabase.ts`** - Supabase client setup
   - Copy from: `app/lib/supabase.ts`

3. **`courseService.ts`** - Data fetching service
   - Copy from: `app/services/courseService.ts`

4. **`LessonIcon.tsx`** - Icon component
   - Copy from: `app/components/LessonIcon.tsx`

5. **`ModularCourse.tsx`** - Main lesson display component
   - Copy from: `app/ModularCourse.tsx`

6. **`FramerLayout.tsx`** - Layout wrapper with navigation
   - Copy from: `app/FramerLayout.tsx`

### Page Components (Required)

7. **`HomePage.tsx`** - Landing page
   - Copy from: `app/pages/HomePage.tsx`

8. **`ElementaryPage.tsx`** - Elementary lessons page
   - Copy from: `app/pages/ElementaryPage.tsx`

9. **`MiddlePage.tsx`** - Middle school lessons page
   - Copy from: `app/pages/MiddlePage.tsx`

10. **`HighPage.tsx`** - High school lessons page
    - Copy from: `app/pages/HighPage.tsx`

---

## Step 4: Create Pages in Framer

### 4.1 Create Home Page (URL: `/`)

1. Create a new page in Framer
2. Set the URL to `/`
3. Add a **Code Component** with this content:

```tsx
import { addPropertyControls, ControlType } from "framer"
import FramerLayout from "./code/FramerLayout"

export default function Home() {
  return (
    <FramerLayout
      currentPath="home"
      onNavigate={(path) => {
        window.location.href = path
      }}
    >
      {/* HomePage is rendered inside FramerLayout when currentPath="home" */}
    </FramerLayout>
  )
}
```

### 4.2 Create Elementary Page (URL: `/elementary`)

1. Create a new page in Framer
2. Set the URL to `/elementary`
3. Add a **Code Component** with this content:

```tsx
import { addPropertyControls, ControlType } from "framer"
import ElementaryPage from "./code/pages/ElementaryPage"
import FramerLayout from "./code/FramerLayout"

export default function Elementary() {
  return (
    <FramerLayout
      currentPath="elementary"
      onNavigate={(path) => {
        window.location.href = path
      }}
    >
      <ElementaryPage />
    </FramerLayout>
  )
}
```

### 4.3 Create Middle Page (URL: `/middle`)

1. Create a new page in Framer
2. Set the URL to `/middle`
3. Add a **Code Component** with this content:

```tsx
import { addPropertyControls, ControlType } from "framer"
import MiddlePage from "./code/pages/MiddlePage"
import FramerLayout from "./code/FramerLayout"

export default function Middle() {
  return (
    <FramerLayout
      currentPath="middle"
      onNavigate={(path) => {
        window.location.href = path
      }}
    >
      <MiddlePage />
    </FramerLayout>
  )
}
```

### 4.4 Create High Page (URL: `/high`)

1. Create a new page in Framer
2. Set the URL to `/high`
3. Add a **Code Component** with this content:

```tsx
import { addPropertyControls, ControlType } from "framer"
import HighPage from "./code/pages/HighPage"
import FramerLayout from "./code/FramerLayout"

export default function High() {
  return (
    <FramerLayout
      currentPath="high"
      onNavigate={(path) => {
        window.location.href = path
      }}
    >
      <HighPage />
    </FramerLayout>
  )
}
```

---

## Step 5: File Organization in Framer

In Framer's Code panel, organize files like this:

```
code/
├── types.ts
├── lib/
│   └── supabase.ts
├── services/
│   └── courseService.ts
├── components/
│   └── LessonIcon.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ElementaryPage.tsx
│   ├── MiddlePage.tsx
│   └── HighPage.tsx
├── FramerLayout.tsx
└── ModularCourse.tsx
```

**Note**: Adjust import paths in Framer based on where you place files. If you put everything in `code/`, use `./code/FileName` in imports.

---

## How It Works

### Navigation Flow

1. **Home Page** (`/`)
   - Shows "Gayatri Pariwar" title
   - Three cards for Elementary, Middle, High School
   - Click card → Navigate to grade page

2. **Grade Pages** (`/elementary`, `/middle`, `/high`)
   - Top navigation: Home | Elementary | Middle | High
   - Left sidebar: Shows units filtered by grade + search
   - Main content: Hero section + expandable lesson cards

### Data Flow

1. On page load → `fetchCourseData()` pulls from Supabase
2. Filters lessons by grade level (Elementary, Middle, High)
3. Displays units in sidebar (only units with lessons for that grade)
4. Shows lessons as expandable cards with:
   - Title on left
   - Tags (Subject, Audience, Level) on right
   - Chevron to expand/collapse
   - When expanded: Description + Lesson Plan/PPTX buttons

### Color Scheme

- **Elementary**: Light blue background (`bg-blue-50`)
- **Middle School**: Light yellow background (`bg-yellow-50`)
- **High School**: Light green background (`bg-green-50`)
- **Home Page**: Gradient gray background

---

## Tailwind CSS Setup

Make sure Tailwind CSS is enabled in your Framer project:

1. Go to **File → Settings → CSS**
2. Enable Tailwind CSS
3. All components use Tailwind utility classes

---

## Testing Checklist

Before publishing, verify:

- [ ] All 4 pages created in Framer (`/`, `/elementary`, `/middle`, `/high`)
- [ ] Environment variables configured (Supabase URL + Key)
- [ ] All 10 code files copied to Framer Code panel
- [ ] Import paths correct (adjust based on folder structure)
- [ ] Tailwind CSS enabled
- [ ] Home page shows 3 grade cards
- [ ] Clicking grade card navigates to correct page
- [ ] Top navigation works (switches between pages)
- [ ] Sidebar shows units filtered by grade
- [ ] Search in sidebar works
- [ ] Lessons expand/collapse with chevron
- [ ] Tags show on right side of lessons
- [ ] Lesson Plan & PPTX buttons work (open files)
- [ ] Loading spinner shows only in content area (hero always visible)
- [ ] Colored backgrounds show correctly

---

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Adjust import paths based on where you placed files in Framer's Code panel.

Example: If `FramerLayout.tsx` is in `code/`, import it as:
```tsx
import FramerLayout from "./code/FramerLayout"
```

### Issue: Navigation doesn't work

**Solution**:
- Verify URLs are set correctly in Framer page settings
- Check that all pages use the same `onNavigate` function

### Issue: Sidebar doesn't show units

**Solution**:
- Check Supabase connection (verify env variables)
- Open browser console and check for errors
- Verify lessons have metadata field with "Elementary", "Middle", or "High"

### Issue: Data not loading

**Solution**:
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check Supabase table structure matches expected format
- Look at browser console for error messages

### Issue: Styling looks broken

**Solution**:
- Enable Tailwind CSS in Framer settings
- Make sure all utility classes are spelled correctly
- Check that parent containers allow content to expand

---

## Advanced: Custom Styling

You can customize colors and styles by editing the components:

### Change Brand Colors

In `FramerLayout.tsx` and page components, replace:
- `bg-gray-900` → Your brand color for navigation
- `bg-blue-50` → Different color for Elementary
- `bg-yellow-50` → Different color for Middle
- `bg-green-50` → Different color for High

### Adjust Spacing

- Hero padding: Change `p-8` to `p-12` for more space
- Card gaps: Change `gap-4` to `gap-6` for wider spacing
- Section spacing: Adjust `mb-8`, `space-y-8` values

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are copied correctly
3. Test in Framer Preview mode first
4. Make sure Supabase tables have data

---

## Summary

You now have:
- ✅ Home page with grade selection
- ✅ 3 grade-specific pages with filtered content
- ✅ Navigation between pages
- ✅ Sidebar with unit search
- ✅ Expandable lesson cards
- ✅ Download buttons for lesson materials
- ✅ Color-coded by grade level
