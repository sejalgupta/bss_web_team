/**
 * FRAMER LAYOUT COMPONENT
 *
 * This component provides the navigation layout for Framer.
 * Create 3 separate pages in Framer for each grade level:
 * - /elementary -> Use ElementaryPage component
 * - /middle -> Use MiddlePage component
 * - /high -> Use HighPage component
 *
 * Add this layout component to each page for consistent navigation.
 */

import { useState, useEffect } from 'react'
import { CourseData, Unit } from './types'
import { fetchCourseData } from './services/courseService'
import HomePage from './pages/HomePage'

interface FramerLayoutProps {
  currentPath: 'home' | 'elementary' | 'middle' | 'high'
  onNavigate: (path: string) => void
  children?: React.ReactNode
}

export default function FramerLayout({
  currentPath,
  onNavigate,
  children
}: FramerLayoutProps) {
  const [allUnits, setAllUnits] = useState<Unit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadUnits() {
      const result = await fetchCourseData()
      if (result) {
        setAllUnits(result.units)
      }
    }
    loadUnits()
  }, [])

  // Filter units by current grade - only show units for current page
  const gradeFilter = currentPath === 'home' ? null : currentPath
  const filteredUnits = gradeFilter
    ? allUnits
        .map(unit => ({
          ...unit,
          lessons: unit.lessons.filter(lesson =>
            lesson.metadata?.toLowerCase().includes(gradeFilter.toLowerCase())
          )
        }))
        .filter(unit => unit.lessons.length > 0) // Only show units with lessons for this grade
    : allUnits

  // Apply search filter
  const searchedUnits = filteredUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // For home page, show a different layout without sidebar
  if (currentPath === 'home') {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-8">
            {/* Grade Navigation */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onNavigate('/')}
                className="px-4 py-2 text-sm font-medium transition-colors text-gray-900"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('/elementary')}
                className="px-4 py-2 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900"
              >
                Elementary
              </button>
              <button
                onClick={() => onNavigate('/middle')}
                className="px-4 py-2 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900"
              >
                Middle
              </button>
              <button
                onClick={() => onNavigate('/high')}
                className="px-4 py-2 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900"
              >
                High
              </button>
            </nav>
          </div>
        </header>

        {/* Home Page Content */}
        <HomePage onNavigate={onNavigate} />
      </div>
    )
  }

  // For grade pages, show layout with sidebar
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          {/* Grade Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onNavigate('/')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPath === 'home'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/elementary')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPath === 'elementary'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Elementary
            </button>
            <button
              onClick={() => onNavigate('/middle')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPath === 'middle'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Middle
            </button>
            <button
              onClick={() => onNavigate('/high')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentPath === 'high'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              High
            </button>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">

          {/* Units List */}
          <div className="flex-1 p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Modular
            </h2>
            <div className="space-y-1">
              {searchedUnits.map((unit) => (
                <button
                  key={unit.name}
                  onClick={() => {
                    // In Framer, you'd navigate to the unit-specific URL
                    // For now, we'll just select it
                    setSelectedUnit(unit.name)
                    // You can add: onNavigate(`/${currentPath}/${unit.id}`)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedUnit === unit.name
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex-1 line-clamp-2">{unit.name}</span>
                    <span className="text-xs text-gray-400">{unit.lessons.length}</span>
                  </div>
                </button>
              ))}
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
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
