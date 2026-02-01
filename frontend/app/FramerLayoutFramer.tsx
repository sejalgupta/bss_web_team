/**
 * FRAMER LAYOUT - Inline Styles Version
 * No Tailwind CSS needed - works directly in Framer!
 */

import { useState, useEffect } from 'react'
import { CourseData, Unit } from './types'
import { fetchCourseData } from './services/courseServiceFramer'
import HomePage from './pages/HomePageFramer'
import logoImage from './assets/gp_logo.png'

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

  // Filter units by current grade
  const gradeFilter = currentPath === 'home' ? null : currentPath
  const filteredUnits = gradeFilter
    ? allUnits
        .map(unit => ({
          ...unit,
          lessons: unit.lessons.filter(lesson =>
            lesson.metadata?.toLowerCase().includes(gradeFilter.toLowerCase())
          )
        }))
        .filter(unit => unit.lessons.length > 0)
    : allUnits

  // Apply search filter
  const searchedUnits = filteredUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // For home page
  if (currentPath === 'home') {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#ffffff' }}>
        {/* Top Navigation Bar */}
        <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
              <img
                src={logoImage}
                alt="Logo"
                style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                onClick={() => onNavigate('/')}
              />
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => onNavigate('/')}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#111827', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('/elementary')}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Elementary
              </button>
              <button
                onClick={() => onNavigate('/middle')}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Middle
              </button>
              <button
                onClick={() => onNavigate('/high')}
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                High
              </button>
            </nav>
          </div>
        </header>

        <HomePage onNavigate={onNavigate} />
      </div>
    )
  }

  // For grade pages with sidebar
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f9fafb', overflow: 'hidden' }}>
      {/* Top Navigation Bar */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <img
              src={logoImage}
              alt="Logo"
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
              onClick={() => onNavigate('/')}
            />
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onNavigate('/')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPath === 'home' ? '#111827' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/elementary')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPath === 'elementary' ? '#111827' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Elementary
            </button>
            <button
              onClick={() => onNavigate('/middle')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPath === 'middle' ? '#111827' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Middle
            </button>
            <button
              onClick={() => onNavigate('/high')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPath === 'high' ? '#111827' : '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              High
            </button>
          </nav>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: '256px', background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0 }}>
          {/* Units List */}
          <div style={{ flex: 1, padding: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Modular
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {searchedUnits.map((unit) => (
                <button
                  key={unit.name}
                  onClick={() => setSelectedUnit(unit.name)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: selectedUnit === unit.name ? '#f3f4f6' : 'transparent',
                    color: selectedUnit === unit.name ? '#111827' : '#4b5563',
                    fontWeight: selectedUnit === unit.name ? 500 : 400,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{unit.name}</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{unit.lessons.length}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ position: 'relative' }}>
              <svg
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }}
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
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', padding: '24px', minHeight: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
