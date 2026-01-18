import { useState, useEffect } from 'react'
import { CourseData, Unit } from './types'
import { sampleCourseData } from './data/sampleData'
import { fetchCourseData } from './services/courseService'
import ModularCourse from './ModularCourse'

type GradeLevel = 'Elementary' | 'Middle' | 'High' | 'All'

interface CourseNavigationProps {
  useSupabase?: boolean
}

export default function CourseNavigation({ useSupabase = true }: CourseNavigationProps) {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('All')
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(useSupabase)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

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
  const filteredByGrade: CourseData | null = courseData ? {
    units: courseData.units.map(unit => ({
      ...unit,
      lessons: unit.lessons.filter(lesson => {
        if (selectedGrade === 'All') return true
        return lesson.metadata?.includes(selectedGrade)
      })
    })).filter(unit => unit.lessons.length > 0)
  } : null

  // Further filter by selected unit
  const displayData: CourseData | null = filteredByGrade ? {
    units: selectedUnit
      ? filteredByGrade.units.filter(unit => unit.name === selectedUnit)
      : filteredByGrade.units
  } : null

  // Get all units for navigation (before grade filtering)
  const allUnits = courseData?.units || []

  // Filter units by search
  const searchedUnits = allUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const grades: GradeLevel[] = ['All', 'Elementary', 'Middle', 'High']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* Grade Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedGrade('All')
                setSelectedUnit(null)
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedGrade === 'All'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            {['Elementary', 'Middle', 'High'].map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  setSelectedGrade(grade as GradeLevel)
                  setSelectedUnit(null)
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGrade === grade
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {grade}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Units List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Modular
            </h2>
          <div className="space-y-1">
            {searchedUnits.map((unit) => {
              const lessonCount = unit.lessons.filter(lesson => {
                if (selectedGrade === 'All') return true
                return lesson.metadata?.includes(selectedGrade)
              }).length

              if (selectedGrade !== 'All' && lessonCount === 0) return null

              return (
                <button
                  key={unit.name}
                  onClick={() => setSelectedUnit(unit.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedUnit === unit.name
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex-1 line-clamp-2">{unit.name}</span>
                    <span className="text-xs text-gray-400">{lessonCount}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-t border-gray-200">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => setSelectedUnit(null)}
              className="hover:text-gray-900 transition-colors"
            >
              All Units
            </button>
            {selectedUnit && (
              <>
                <span>/</span>
                <span className="text-gray-900">{selectedUnit}</span>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
          )}

          {/* Course Content */}
          {displayData && displayData.units.length > 0 ? (
            <ModularCourse data={displayData} useSupabase={false} />
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">
                {selectedUnit
                  ? `No lessons available in this unit for ${selectedGrade} level.`
                  : `No lessons available for ${selectedGrade} level.`}
              </p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  )
}
