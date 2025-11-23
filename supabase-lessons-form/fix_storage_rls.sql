-- Fix Storage RLS Policies for lesson-files bucket
-- Run this in your Supabase SQL Editor

-- Step 1: Check if RLS is enabled on storage.objects
SELECT
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- Step 2: View existing RLS policies on storage.objects
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- Step 3: Drop existing policies for lesson-files bucket
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND (policyname LIKE '%lesson%' OR policyname LIKE '%anon%')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Step 4: Create new RLS policies that allow anonymous access
-- These policies allow the anon role to work with files

-- Allow authenticated and anon users to upload files
CREATE POLICY "Allow anon uploads to lesson-files bucket" ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'lesson-files');

-- Allow anyone to view files in the lesson-files bucket
CREATE POLICY "Allow public to view lesson-files" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'lesson-files');

-- Allow anon and authenticated to update their files
CREATE POLICY "Allow anon to update lesson-files" ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'lesson-files');

-- Allow anon and authenticated to delete files
CREATE POLICY "Allow anon to delete lesson-files" ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'lesson-files');

-- Step 5: Verify the policies were created
SELECT
    policyname,
    cmd as action,
    roles
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%lesson-files%';

-- Step 6: Make sure the bucket is public
UPDATE storage.buckets
SET public = true
WHERE id = 'lesson-files';

-- Step 7: Verify bucket settings
SELECT
    id,
    name,
    public,
    file_size_limit
FROM storage.buckets
WHERE id = 'lesson-files';

-- Step 8: If still having issues, you can try this more permissive approach
-- WARNING: Only use this for testing, not in production!
/*
-- Drop all policies related to lesson-files
DROP POLICY IF EXISTS "Allow anon uploads to lesson-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view lesson-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon to update lesson-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon to delete lesson-files" ON storage.objects;

-- Create a single very permissive policy
CREATE POLICY "Allow all operations on lesson-files" ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'lesson-files')
WITH CHECK (bucket_id = 'lesson-files');
*/

-- Step 9: Test the setup by checking what role you're using
SELECT current_user, current_role;