export interface Lesson {
  id: string;
  title: string;
  curriculum_group_id?: string;
  subject?: string;
  target_audience?: string;
  level?: string;
  learning_objectives?: any;
  materials?: any;
  teaching_activities?: any;
  application?: string;
  assessment?: string;
  refs?: string;
  upload_time?: string;
  uploaded_by?: string;
}

export interface FormData {
  id: string;
  title: string;
  curriculum_group_id: string;
  subject: string;
  target_audience: string;
  level: string;
  learning_objectives: string;
  materials: string;
  teaching_activities: string;
  application: string;
  assessment: string;
  refs: string;
  uploaded_by: string;
}

export interface JsonValidation {
  learning_objectives: boolean;
  materials: boolean;
  teaching_activities: boolean;
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