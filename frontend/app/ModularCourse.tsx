import { useState, useEffect } from 'react'
import { CourseData } from './types'
import { sampleCourseData } from './data/sampleData'
import { fetchCourseData } from './services/courseService'
import LessonIcon from './components/LessonIcon'

interface ModularCourseProps {
  data?: CourseData
  useSupabase?: boolean
}

export default function ModularCourse({
  data,
  useSupabase = true
}: ModularCourseProps) {
  const [courseData, setCourseData] = useState<CourseData | null>(data || null)
  const [loading, setLoading] = useState(useSupabase && !data)
  const [error, setError] = useState<string | null>(null)
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (data) {
      setCourseData(data)
      setLoading(false)
      return
    }

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
  }, [data, useSupabase])

  const units = courseData?.units || []

  function toggleLesson(lessonId: number) {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  function handleStartLesson(lesson: any) {
    console.log('Starting lesson:', lesson.title)
    if (lesson.lessonPlanUrl) {
      window.open(lesson.lessonPlanUrl, '_blank')
    } else if (lesson.pptxUrl) {
      window.open(lesson.pptxUrl, '_blank')
    } else {
      alert('No resources available for this lesson')
    }
  }

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
    <div className="space-y-8">
      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {units.map((unit, unitIdx) => (
        <div key={unitIdx} className="space-y-4">
          {/* Unit Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{unit.name}</h2>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {unit.lessons.length} LESSON{unit.lessons.length !== 1 ? 'S' : ''}
              </span>
            </div>
            {unit.description && (
              <p className="text-gray-600 text-sm">{unit.description}</p>
            )}
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 gap-4">
            {unit.lessons.map((lesson, idx) => {
              const isExpanded = expandedLessons[lesson.id]

              return (
                <div
                  key={lesson.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  {/* Lesson Header - Always Visible */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleLesson(lesson.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Title */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.title}
                        </h3>
                      </div>

                      {/* Right: Tags + Chevron */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Metadata Tags */}
                        {lesson.metadata && (
                          <div className="flex flex-wrap items-center gap-2">
                            {lesson.metadata.split(' • ').map((item, tagIdx) => {
                              const value = item.includes(':') ? item.split(':')[1].trim() : item.trim()
                              return (
                                <span
                                  key={tagIdx}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                >
                                  {value}
                                </span>
                              )
                            })}
                          </div>
                        )}

                        {/* Chevron */}
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {lesson.description}
                      </p>

                      {/* Progress Bar */}
                      {lesson.progress !== undefined && lesson.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium text-gray-700">{lesson.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                              style={{ width: `${lesson.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (lesson.lessonPlanUrl) {
                              window.open(lesson.lessonPlanUrl, '_blank')
                            }
                          }}
                          disabled={!lesson.lessonPlanUrl}
                          className={`px-6 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                            lesson.lessonPlanUrl
                              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Lesson Plan
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (lesson.pptxUrl) {
                              window.open(lesson.pptxUrl, '_blank')
                            }
                          }}
                          disabled={!lesson.pptxUrl}
                          className={`px-6 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                            lesson.pptxUrl
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Lesson PPTX
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
