/**
 * FRAMER-READY COMPONENT
 *
 * This is a simplified version designed for easy Framer integration.
 * Copy this entire file to your Framer project as a Code Component.
 *
 * SETUP:
 * 1. Install @supabase/supabase-js in Framer
 * 2. Set environment variables in Framer:
 *    - VITE_SUPABASE_URL
 *    - VITE_SUPABASE_ANON_KEY
 * 3. Add this component to your canvas
 */

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Types
interface Lesson {
  id: number
  title: string
  description: string
  metadata?: string
  lessonPlanUrl?: string
  pptxUrl?: string
}

interface Unit {
  name: string
  lessons: Lesson[]
}

// Props for the component
interface FramerComponentProps {
  gradeLevel?: 'Elementary' | 'Middle' | 'High' | 'All'
  showGradeSelector?: boolean
}

export default function FramerComponent({
  gradeLevel = 'All',
  showGradeSelector = true
}: FramerComponentProps) {
  const [selectedGrade, setSelectedGrade] = useState(gradeLevel)
  const [units, setUnits] = useState<Unit[]>([])
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (gradeLevel !== 'All') {
      setSelectedGrade(gradeLevel)
    }
  }, [gradeLevel])

  async function fetchData() {
    try {
      // Fetch curriculum groups
      const { data: groups } = await supabase
        .from('curriculum_groups')
        .select('*')
        .order('id')

      // Fetch lessons
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .order('id')

      // Fetch files
      const { data: files } = await supabase
        .from('lesson_files')
        .select('*')

      // Build units structure
      const unitsData = groups?.map(group => {
        const groupLessons = lessons?.filter(l => l.curriculum_group_id === group.id).map(lesson => {
          const lessonFiles = files?.filter(f => f.lesson_id === lesson.id) || []
          const planFile = lessonFiles.find(f => f.material_type === 'LESSON_PLAN')
          const pptxFile = lessonFiles.find(f => f.material_type === 'LESSON_PPT')

          // Build metadata
          const metadataParts = []
          if (lesson.subject) metadataParts.push(`Subject: ${lesson.subject}`)
          if (lesson.target_audience) metadataParts.push(`Audience: ${lesson.target_audience}`)
          if (lesson.level) metadataParts.push(`Level: ${lesson.level}`)

          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || 'No description available',
            metadata: metadataParts.join(' • '),
            lessonPlanUrl: planFile?.file_url,
            pptxUrl: pptxFile?.file_url
          }
        }) || []

        return {
          name: group.name,
          lessons: groupLessons
        }
      }) || []

      setUnits(unitsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  function toggleLesson(lessonId: number) {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  // Filter by grade
  const filteredUnits = selectedGrade === 'All'
    ? units
    : units.map(unit => ({
        ...unit,
        lessons: unit.lessons.filter(l => l.metadata?.includes(selectedGrade))
      })).filter(unit => unit.lessons.length > 0)

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
      {/* Grade Selector */}
      {showGradeSelector && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            gap: '0.5rem',
            backgroundColor: '#f3f4f6',
            padding: '0.25rem',
            borderRadius: '0.5rem'
          }}>
            {['All', 'Elementary', 'Middle', 'High'].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade as any)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedGrade === grade ? 'white' : 'transparent',
                  color: selectedGrade === grade ? '#111827' : '#6b7280',
                  boxShadow: selectedGrade === grade ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Units */}
      {filteredUnits.map((unit, unitIdx) => (
        <div key={unitIdx} style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          {/* Unit Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              {unit.name}
            </h2>
          </div>

          {/* Lessons */}
          {unit.lessons.map((lesson, idx) => {
            const isExpanded = expandedLessons[lesson.id]

            return (
              <div key={lesson.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                {/* Lesson Header */}
                <div
                  onClick={() => toggleLesson(lesson.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#111827',
                    margin: 0
                  }}>
                    Lesson {idx + 1}: {lesson.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Metadata Tags */}
                    {lesson.metadata && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {lesson.metadata.split(' • ').map((item, i) => {
                          const value = item.includes(':') ? item.split(':')[1].trim() : item
                          return (
                            <span
                              key={i}
                              style={{
                                padding: '0.125rem 0.5rem',
                                backgroundColor: '#e5e7eb',
                                color: '#374151',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              {value}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    {/* Chevron */}
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#6b7280"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{
                    padding: '0.5rem 1.5rem 1rem',
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1.5rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      margin: 0,
                      flex: 1
                    }}>
                      {lesson.description}
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => lesson.lessonPlanUrl && window.open(lesson.lessonPlanUrl, '_blank')}
                        disabled={!lesson.lessonPlanUrl}
                        style={{
                          padding: '0.625rem 1.5rem',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          cursor: lesson.lessonPlanUrl ? 'pointer' : 'not-allowed',
                          opacity: lesson.lessonPlanUrl ? 1 : 0.5
                        }}
                      >
                        Lesson Plan
                      </button>
                      <button
                        onClick={() => lesson.pptxUrl && window.open(lesson.pptxUrl, '_blank')}
                        disabled={!lesson.pptxUrl}
                        style={{
                          padding: '0.625rem 1.5rem',
                          backgroundColor: '#111827',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          cursor: lesson.pptxUrl ? 'pointer' : 'not-allowed',
                          opacity: lesson.pptxUrl ? 1 : 0.5
                        }}
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
      ))}

      {filteredUnits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p>No lessons available for {selectedGrade} level.</p>
        </div>
      )}
    </div>
  )
}

// Add property controls for Framer
FramerComponent.displayName = "Course Lessons"

// @ts-ignore - Framer property controls
FramerComponent.defaultProps = {
  gradeLevel: 'All',
  showGradeSelector: true
}
