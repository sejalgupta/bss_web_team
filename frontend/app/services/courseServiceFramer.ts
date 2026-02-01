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
    const groupsUrl = `${url}/rest/v1/curriculum_groups?order=unit.asc`
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

    // Fetch topics with curriculum group info
    const topicsUrl = `${url}/rest/v1/topics?select=*&order=topic_number.asc`
    const topicsRes = await fetch(topicsUrl, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    })

    let topicsData = []
    if (topicsRes.ok) {
      topicsData = await topicsRes.json()
    }

    // Fetch all lessons
    const lessonsUrl = `${url}/rest/v1/lessons?order=lesson_number.asc`
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
        .filter((lesson: any) => {
          // Find the topic for this lesson
          const topic = topicsData.find((t: any) => t.id === lesson.topic)
          // Check if topic's relevant_unit matches this curriculum group
          return topic && topic.relevant_unit === group.id
        })
        .map((lesson: any) => {
          // Find the topic for lesson number calculation
          const topic = topicsData.find((t: any) => t.id === lesson.topic)

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

          // Calculate composite lesson number: unit.topic.lesson.grade
          const targetAudienceMap: Record<string, string> = {
            'Elementary': '1',
            'Middle': '2',
            'High': '3'
          }
          const audienceNumber = targetAudienceMap[lesson.target_audience] || ''
          const topicNumber = topic?.topic_number || ''
          const compositeNumber = (group.unit && topicNumber && lesson.lesson_number && audienceNumber)
            ? `${group.unit}.${topicNumber}.${lesson.lesson_number}.${audienceNumber}`
            : ''

          // Build metadata string
          const metadataParts = []
          if (compositeNumber) metadataParts.push(`#${compositeNumber}`)
          if (lesson.subject) metadataParts.push(`Subject: ${lesson.subject}`)
          if (lesson.target_audience) metadataParts.push(lesson.target_audience)
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

          // Clean up title - remove any existing composite number prefix (handles both 3-part and 4-part)
          const cleanTitle = lesson.title.replace(/^\d+\.\d+\.\d+(\.\d+)?\s*-?\s*/, '')

          return {
            id: lesson.id,
            title: cleanTitle,
            description: description,
            metadata: metadata,
            lessonPlanUrl: lessonPlanFile?.file_url,
            pptxUrl: pptxFile?.file_url,
            // Include full lesson data for expanded view
            fullData: lesson
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
