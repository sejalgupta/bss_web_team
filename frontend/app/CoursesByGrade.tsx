import { useState, useEffect } from 'react'
import { CourseData } from './types'
import { sampleCourseData } from './data/sampleData'
import { fetchCourseData } from './services/courseService'
import ModularCourse from './ModularCourse'

type GradeLevel = 'Elementary' | 'Middle' | 'High'

interface CoursesByGradeProps {
  useSupabase?: boolean
}

export default function CoursesByGrade({ useSupabase = true }: CoursesByGradeProps) {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Elementary')
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(useSupabase)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!useSupabase) {
      setCourseData(sampleCourseData)
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        setLoading(true)
        const result = await fetchCourseData()

        if (result) {
          setCourseData(result)
          setError(null)
        } else {
          console.log('Using sample data as fallback')
          setCourseData(sampleCourseData)
          setError('Could not load data from Supabase. Using sample data.')
        }
      } catch (err) {
        console.error('Error loading course data:', err)
        setCourseData(sampleCourseData)
        setError('Error loading data. Using sample data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [useSupabase])

  // Filter lessons by selected grade
  const filteredData: CourseData | null = courseData ? {
    units: courseData.units.map(unit => ({
      ...unit,
      lessons: unit.lessons.filter(lesson => {
        // Check if lesson metadata includes the selected grade
        return lesson.metadata?.includes(selectedGrade)
      })
    })).filter(unit => unit.lessons.length > 0) // Remove units with no lessons
  } : null

  const grades: GradeLevel[] = ['Elementary', 'Middle', 'High']

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading course data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Grade Level Navigation */}
      <div className="mb-8">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg inline-flex">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedGrade === grade
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Course Content */}
      {filteredData && filteredData.units.length > 0 ? (
        <ModularCourse data={filteredData} useSupabase={false} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No lessons available for {selectedGrade} level.</p>
        </div>
      )}
    </div>
  )
}
