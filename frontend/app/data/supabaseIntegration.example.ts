// Example: How to integrate with Supabase in Framer
// This file shows how to fetch data from Supabase and use it with the ModularCourse component

import { createClient } from '@supabase/supabase-js'
import { CourseData } from '../types'

// Initialize Supabase client (in your Framer component)
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

/**
 * Example function to fetch course data from Supabase
 * Adjust this based on your actual Supabase schema
 */
export async function fetchCourseData(): Promise<CourseData> {
  // Example: Fetch units
  const { data: units, error: unitsError } = await supabase
    .from('units')
    .select('*')
    .order('id')

  if (unitsError) {
    console.error('Error fetching units:', unitsError)
    throw unitsError
  }

  // Example: Fetch lessons for each unit
  const unitsWithLessons = await Promise.all(
    units.map(async (unit) => {
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('unit_id', unit.id)
        .order('id')

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError)
        throw lessonsError
      }

      return {
        name: unit.name,
        lessons: lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          lessonPlanUrl: lesson.lesson_plan_url,
          pptxUrl: lesson.pptx_url
        }))
      }
    })
  )

  return {
    units: unitsWithLessons
  }
}

/**
 * Example usage in a Framer component:
 *
 * import { useEffect, useState } from 'react'
 * import ModularCourse from './ModularCourse'
 * import { fetchCourseData } from './data/supabaseIntegration'
 *
 * export default function FramerCourseComponent() {
 *   const [courseData, setCourseData] = useState(null)
 *   const [loading, setLoading] = useState(true)
 *
 *   useEffect(() => {
 *     fetchCourseData()
 *       .then(data => {
 *         setCourseData(data)
 *         setLoading(false)
 *       })
 *       .catch(error => {
 *         console.error('Error loading course data:', error)
 *         setLoading(false)
 *       })
 *   }, [])
 *
 *   if (loading) return <div>Loading...</div>
 *
 *   return <ModularCourse data={courseData} />
 * }
 */
