# Supabase Database Setup

## Create the lessons table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  curriculum_group_id UUID,
  subject TEXT,
  target_audience TEXT,
  level TEXT,
  learning_objectives JSONB,
  materials JSONB,
  teaching_activities JSONB,
  application TEXT,
  assessment TEXT,
  refs TEXT,
  upload_time TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all users to insert (adjust as needed)
CREATE POLICY "Enable insert for all users" ON lessons
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow all users to select (adjust as needed)
CREATE POLICY "Enable read access for all users" ON lessons
  FOR SELECT USING (true);
```

## Optional: Create curriculum_groups table if referenced

```sql
CREATE TABLE curriculum_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Optional: Sample data for testing

```sql
-- Insert a sample curriculum group
INSERT INTO curriculum_groups (id, name, description)
VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'Math curriculum for all levels');

-- Insert a sample lesson
INSERT INTO lessons (
  id,
  title,
  curriculum_group_id,
  subject,
  target_audience,
  level,
  learning_objectives,
  materials,
  teaching_activities
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Introduction to Algebra',
  '550e8400-e29b-41d4-a716-446655440000',
  'Mathematics',
  'High School Students',
  'Beginner',
  '["Understand variables", "Solve basic equations", "Apply algebra to real problems"]'::jsonb,
  '{"required": ["Textbook", "Calculator"], "optional": ["Computer"]}'::jsonb,
  '[{"activity": "Introduction", "duration": "10 minutes"}, {"activity": "Examples", "duration": "20 minutes"}]'::jsonb
);
```

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy (Vercel will automatically detect the configuration from vercel.json)
4. The app will be live at your Vercel URL

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build
```

## Important Notes

- The Supabase credentials are currently hardcoded in App.tsx for simplicity
- For production, consider using environment variables on Vercel
- Make sure Row Level Security policies match your requirements
- The `uploaded_by` field references the auth.users table - adjust if using different auth setup