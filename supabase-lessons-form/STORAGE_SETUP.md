# Supabase Storage Setup for File Uploads

## Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cycfjdvszpctjxoosspf/storage/buckets

2. Click "New bucket" and create a bucket with these settings:
   - **Name**: `lesson-files`
   - **Public bucket**: ✅ Yes (check this box - IMPORTANT!)
   - **Allowed MIME types**: Leave empty to allow all file types
   - **File size limit**: Set as needed (e.g., 50MB)

## Important Notes on Filenames

The system automatically sanitizes filenames to be compatible with Supabase Storage:
- Spaces are replaced with underscores
- Special characters are replaced with underscores
- Original filenames are preserved in the database for reference

## Alternative: Create via SQL

Run this in the SQL Editor:

```sql
-- Create a public storage bucket for lesson files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-files', 'lesson-files', true);
```

## Set Storage Policies

For public access (if needed):

```sql
-- Allow public to view files
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'lesson-files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lesson-files'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'lesson-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## For Anonymous Uploads (Current Setup)

Since you're using the anon key, you'll need more permissive policies:

```sql
-- Allow anyone to upload (be careful with this in production!)
CREATE POLICY "Anyone can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'lesson-files');

-- Allow anyone to view files
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'lesson-files');

-- Allow anyone to delete files (optional, might want to restrict this)
CREATE POLICY "Anyone can delete files" ON storage.objects
  FOR DELETE USING (bucket_id = 'lesson-files');
```

## File Organization

Files are organized in the bucket as:
```
lesson-files/
  ├── {lesson-id}/
  │   ├── {timestamp}_{filename1}
  │   ├── {timestamp}_{filename2}
  │   └── ...
  └── {another-lesson-id}/
      └── ...
```

## Testing

1. Try uploading a file through the form
2. Check the Storage section in your Supabase dashboard to see uploaded files
3. Verify the file URLs are stored in the `lesson_files` table

## Important Notes

- Files are uploaded to Supabase Storage (not as base64 in the database)
- File URLs are stored in the `lesson_files` table for reference
- Each lesson's files are organized in their own folder using the lesson ID
- Make sure the bucket is set to PUBLIC for the URLs to work
- Consider implementing file size limits and type restrictions for production