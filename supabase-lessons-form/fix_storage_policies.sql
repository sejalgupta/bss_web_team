-- Fix Storage Policies for lesson-files bucket
-- Run this in your Supabase SQL Editor to fix file upload issues

-- Step 1: Check current RLS status on storage.objects table
SELECT
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- Step 2: Delete ALL existing policies for the lesson-files bucket
DELETE FROM storage.policies WHERE bucket_id = 'lesson-files';

-- Step 3: Create new permissive policies for anonymous uploads
-- Since you're using the anon key, we need to allow anonymous access

-- Allow anyone to insert (upload) files
CREATE POLICY "Allow anonymous uploads to lesson-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-files');

-- Allow anyone to select (view/download) files
CREATE POLICY "Allow anonymous downloads from lesson-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-files');

-- Allow anyone to update files
CREATE POLICY "Allow anonymous updates to lesson-files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lesson-files');

-- Allow anyone to delete files
CREATE POLICY "Allow anonymous deletes from lesson-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'lesson-files');

-- Step 4: Verify the policies were created
SELECT
    id,
    name,
    action,
    bucket_id
FROM storage.policies
WHERE bucket_id = 'lesson-files';

-- You should see 4 policies listed

-- Step 5: Test if RLS is blocking (Optional - only if still having issues)
-- If the above doesn't work, you might need to check if RLS is enabled
-- DO NOT disable RLS in production without understanding security implications
-- To check: SELECT current_setting('row_security');

-- Step 6: Alternative - Create a more specific policy using RLS context
-- If you want to be more specific, you can use this instead:
/*
-- First delete the permissive policies
DELETE FROM storage.policies WHERE bucket_id = 'lesson-files';

-- Then create context-aware policies
CREATE POLICY "Anyone can upload to lesson-files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'lesson-files'
    AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Anyone can view lesson-files"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'lesson-files'
);

CREATE POLICY "Anyone can update their lesson-files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'lesson-files'
    AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Anyone can delete their lesson-files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'lesson-files'
    AND (auth.role() = 'anon' OR auth.role() = 'authenticated')
);
*/

-- Final check: Make sure the bucket is truly public
UPDATE storage.buckets
SET public = true
WHERE id = 'lesson-files';

-- Verify bucket settings
SELECT
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'lesson-files';

-- Expected: public should be 'true'