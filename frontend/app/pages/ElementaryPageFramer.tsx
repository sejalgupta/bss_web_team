import { useState, useEffect } from 'react'
import { CourseData } from '../types'
import { fetchCourseData } from '../services/courseServiceFramer'
import ModularCourse from '../ModularCourse'

export default function ElementaryPage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const result = await fetchCourseData()
      if (result) {
        // Filter for Elementary lessons only
        const filtered: CourseData = {
          units: result.units.map(unit => ({
            ...unit,
            lessons: unit.lessons.filter(lesson =>
              lesson.metadata?.includes('Elementary')
            )
          })).filter(unit => unit.lessons.length > 0)
        }
        setCourseData(filtered)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div>
      {/* Hero Section - Always Visible */}
      <div className="bg-blue-50 rounded-xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Elementary School</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Engaging lessons designed for elementary students. Build foundational skills through interactive activities and hands-on learning experiences.
        </p>
      </div>

      {/* Course Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Elementary courses...</p>
          </div>
        </div>
      ) : courseData && courseData.units.length > 0 ? (
        <ModularCourse data={courseData} useSupabase={false} />
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No elementary lessons available.</p>
        </div>
      )}
    </div>
  )
}
