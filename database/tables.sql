create table if not exists curriculum_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  curriculum_group_id uuid references curriculum_groups(id) on delete cascade,
  title text not null,
  subject text,
  target_audience text check (target_audience in ('Elementary','Middle','High')),
  level text check (level in ('Foundational','Developing','Applied/Transformational')),
  learning_objectives jsonb,   -- store as array or structured JSON
  materials jsonb,             -- store as array or structured JSON
  teaching_activities jsonb,   -- store as array or structured JSON
  application text,
  assessment text,
  refs text[],            -- simple array of reference strings
  upload_time timestamp with time zone default now(),
  uploaded_by uuid references users(id) on delete set null
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  created_at timestamp with time zone default now()
);


create table if not exists lesson_files (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  file_url text not null,
  file_type text,
  uploaded_at timestamp with time zone default now()
);

create index if not exists idx_lessons_group_id on lessons(curriculum_group_id);
create index if not exists idx_lessons_target_audience on lessons(target_audience);
create index if not exists idx_lessons_level on lessons(level);
create index if not exists idx_lesson_files_lesson_id on lesson_files(lesson_id);