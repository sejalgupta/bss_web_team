export interface Lesson {
  id: string;
  title: string;
  topic?: string;
  subject?: string;
  target_audience?: string;
  level?: string;
  learning_objectives?: any;
  refs?: string[];
  upload_time?: string;
  uploaded_by?: string;
  lesson_number?: number;
}

export interface FormData {
  id: string;
  title: string;
  topic: string;
  curriculum_group_id: string;
  subject: string;
  target_audience: string;
  level: string;
  learning_objectives: string;
  refs: string;
  uploaded_by: string;
  user_name: string;
  user_email: string;
  lesson_number: string;
  new_topic_name: string;
}

export type MaterialType = 'LESSON_PLAN' | 'LESSON_PPT';

export interface JsonValidation {
  learning_objectives: boolean;
}

export interface Status {
  type: 'success' | 'error' | '';
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface CurriculumGroup {
  id: string;
  name: string;
  unit: number;
  description?: string;
  created_at?: string;
}

export interface Topic {
  id: string;
  name?: string;
  relevant_unit: string;
  topic_number?: number;
  created_at?: string;
}

export interface LessonFile {
  id?: string;
  lesson_id?: string;
  file_url: string;
  file_type: string;
  material_type?: MaterialType;
  uploaded_at?: string;
}