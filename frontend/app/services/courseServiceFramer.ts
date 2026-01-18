import { CourseData, Unit, Lesson } from '../types'
import { supabaseConfig } from '../config'

/**
 * Framer-compatible course service using REST API
 * Uses fetch instead of Supabase JS client
 */
export async function fetchCourseData(): Promise<CourseData | null> {
  const { url, anonKey } = supabaseConfig

  if (!url || !anonKey) {
    console.error('Missing Supabase configuration')
    return null
  }

  try {
    // Fetch curriculum groups
    const groupsUrl = `${url}/rest/v1/curriculum_groups?order=id.asc`
    const groupsRes = await fetch(groupsUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!groupsRes.ok) {
      console.error('Failed to fetch curriculum groups')
      return null
    }

    const groupsData = await groupsRes.json()

    // Fetch all lessons
    const lessonsUrl = `${url}/rest/v1/lessons?order=id.asc`
    const lessonsRes = await fetch(lessonsUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!lessonsRes.ok) {
      console.error('Failed to fetch lessons')
      return null
    }

    const lessonsData = await lessonsRes.json()

    // Fetch all lesson files
    const filesUrl = `${url}/rest/v1/lesson_files`
    const filesRes = await fetch(filesUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    })

    let filesData = []
    if (filesRes.ok) {
      filesData = await filesRes.json()
    }

    // Group lessons by curriculum group
    const units: Unit[] = groupsData.map((group: any) => {
      const groupLessons = lessonsData
        .filter((lesson: any) => lesson.curriculum_group_id === group.id)
        .map((lesson: any) => {
          // Find associated files
          const lessonFiles = filesData.filter((file: any) => file.lesson_id === lesson.id)

          // Get lesson plan and pptx URLs
          const lessonPlanFile = lessonFiles.find((f: any) =>
            f.file_type?.toLowerCase().includes('plan') ||
            f.file_type?.toLowerCase() === 'pdf' ||
            f.file_type?.toLowerCase() === 'doc' ||
            f.file_type?.toLowerCase() === 'docx'
          )

          const pptxFile = lessonFiles.find((f: any) =>
            f.file_type?.toLowerCase().includes('pptx') ||
            f.file_type?.toLowerCase().includes('ppt') ||
            f.file_type?.toLowerCase().includes('presentation')
          )

          // Build metadata string
          const metadataParts = []
          if (lesson.subject) metadataParts.push(`Subject: ${lesson.subject}`)
          if (lesson.target_audience) metadataParts.push(`Audience: ${lesson.target_audience}`)
          if (lesson.level) metadataParts.push(`Level: ${lesson.level}`)
          const metadata = metadataParts.join(' • ')

          // Get description
          let description = ''
          if (lesson.description) {
            description = lesson.description
          } else if (lesson.learning_objectives) {
            if (Array.isArray(lesson.learning_objectives)) {
              description = lesson.learning_objectives.join(', ')
            } else if (typeof lesson.learning_objectives === 'string') {
              description = lesson.learning_objectives
            }
          } else {
            description = 'No description available'
          }

          return {
            id: lesson.id,
            title: lesson.title,
            description: description,
            metadata: metadata,
            lessonPlanUrl: lessonPlanFile?.file_url,
            pptxUrl: pptxFile?.file_url,
          }
        })

      return {
        name: group.name,
        description: group.description,
        lessons: groupLessons,
      }
    })

    return { units }
  } catch (error) {
    console.error('Error fetching course data:', error)
    return null
  }
}
