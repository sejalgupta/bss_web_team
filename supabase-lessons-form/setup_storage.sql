-- Supabase Storage Setup for Lesson Files
-- Run this entire script in your Supabase SQL Editor

-- Step 1: Create the storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('lesson-files', 'lesson-files', true, 52428800, null)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Step 2: Remove all existing policies for this bucket to start fresh
DELETE FROM storage.policies WHERE bucket_id = 'lesson-files';

-- Step 3: Create permissive policies for anonymous access (using anon key)
-- This allows uploads without authentication

-- Policy 1: Allow anyone to upload files
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'lesson-files');

-- Policy 2: Allow anyone to view/download files
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT
USING (bucket_id = 'lesson-files');

-- Policy 3: Allow anyone to update files (optional, remove if not needed)
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE
USING (bucket_id = 'lesson-files');

-- Policy 4: Allow anyone to delete files (optional, remove if not needed)
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE
USING (bucket_id = 'lesson-files');

-- Step 4: Verify the setup
SELECT
    b.id as bucket_id,
    b.name as bucket_name,
    b.public as is_public,
    b.file_size_limit,
    COUNT(p.id) as policy_count
FROM storage.buckets b
LEFT JOIN storage.policies p ON p.bucket_id = b.id
WHERE b.id = 'lesson-files'
GROUP BY b.id, b.name, b.public, b.file_size_limit;

-- Expected result: bucket should exist with public = true and policy_count = 4

-- If you still get errors, run this to check RLS status:
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- If rowsecurity is enabled and causing issues, you might need to temporarily disable it:
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
-- Note: Only do this if you understand the security implications!