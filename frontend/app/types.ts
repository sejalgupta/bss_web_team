export interface Lesson {
  id: number
  title: string
  description: string
  metadata?: string
  duration?: string
  icon?: string
  progress?: number
  completed?: boolean
  lessonPlanUrl?: string
  pptxUrl?: string
  fullData?: any
}

export interface Unit {
  name: string
  description?: string
  lessons: Lesson[]
}

export interface CourseData {
  units: Unit[]
}
