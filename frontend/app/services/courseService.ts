import { supabase } from '../lib/supabase'
import { CourseData, Unit, Lesson } from '../types'

/**
 * Fetches course data from Supabase
 *
 * Database schema:
 * - curriculum_groups table: { id, name, description }
 * - lessons table: { id, curriculum_group_id, title, subject, target_audience, level, ... }
 * - lesson_files table: { id, lesson_id, file_url, file_type, material_type }
 */
export async function fetchCourseData(): Promise<CourseData | null> {
  try {
    // Fetch curriculum groups (these are like "units")
    const { data: groupsData, error: groupsError } = await supabase
      .from('curriculum_groups')
      .select('*')
      .order('id', { ascending: true })

    if (groupsError) {
      console.error('Error fetching curriculum groups:', groupsError)
      return null
    }

    if (!groupsData || groupsData.length === 0) {
      console.log('No curriculum groups found in database')
      return null
    }

    // Fetch all lessons
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('id', { ascending: true })

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
      return null
    }

    // Fetch all lesson files
    const { data: filesData, error: filesError } = await supabase
      .from('lesson_files')
      .select('*')

    if (filesError) {
      console.error('Error fetching lesson files:', filesError)
      // Continue without files rather than failing completely
    }

    // Group lessons by curriculum group
    const units: Unit[] = groupsData.map(group => {
      const groupLessons = lessonsData
        ?.filter(lesson => lesson.curriculum_group_id === group.id)
        .map((lesson) => {
          // Find associated files for this lesson
          const lessonFiles = filesData?.filter(file => file.lesson_id === lesson.id) || []

          // Get lesson plan and pptx URLs using material_type
          const lessonPlanFile = lessonFiles.find(f => f.material_type === 'LESSON_PLAN')
          const pptxFile = lessonFiles.find(f => f.material_type === 'LESSON_PPT')

          // Helper function to get public URL from Supabase Storage if needed
          const getPublicUrl = (fileUrl: string | null | undefined) => {
            if (!fileUrl) return undefined

            // If it's already a full URL, return it
            if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
              return fileUrl
            }

            // If it's a storage path, construct the public URL
            // Format: bucket/path or just path
            return fileUrl
          }

          // Build metadata string for collapsed view
          const metadataParts = []
          if (lesson.subject) metadataParts.push(`Subject: ${lesson.subject}`)
          if (lesson.target_audience) metadataParts.push(`Audience: ${lesson.target_audience}`)
          if (lesson.level) metadataParts.push(`Level: ${lesson.level}`)
          const metadata = metadataParts.join(' • ')

          // Get actual description for expanded view
          let description = ''
          if (lesson.description) {
            description = lesson.description
          } else if (lesson.learning_objectives && Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length > 0) {
            description = lesson.learning_objectives.join(', ')
          } else if (lesson.learning_objectives && typeof lesson.learning_objectives === 'string') {
            description = lesson.learning_objectives
          } else {
            description = 'No description available'
          }

          console.log(`Lesson "${lesson.title}":`, {
            lessonPlanFile: lessonPlanFile?.file_url,
            pptxFile: pptxFile?.file_url
          })

          return {
            id: lesson.id,
            title: lesson.title,
            description: description,
            metadata: metadata,
            lessonPlanUrl: getPublicUrl(lessonPlanFile?.file_url),
            pptxUrl: getPublicUrl(pptxFile?.file_url)
          }
        }) || []

      return {
        name: group.name,
        description: group.description,
        lessons: groupLessons
      }
    })

    return { units }
  } catch (error) {
    console.error('Unexpected error fetching course data:', error)
    return null
  }
}

