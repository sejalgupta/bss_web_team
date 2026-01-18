import { useState } from 'react'
import { CourseData } from './types'

interface ModularCourseProps {
  data?: CourseData
  useSupabase?: boolean
}

export default function ModularCourse({ data }: ModularCourseProps) {
  const [expandedLessons, setExpandedLessons] = useState<Record<number, boolean>>({})

  const units = data?.units || []

  function toggleLesson(lessonId: number) {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {units.map((unit, unitIdx) => (
        <div key={unitIdx} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Unit Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{unit.name}</h2>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {unit.lessons.length} LESSON{unit.lessons.length !== 1 ? 'S' : ''}
              </span>
            </div>
            {unit.description && (
              <p style={{ fontSize: '14px', color: '#4b5563' }}>{unit.description}</p>
            )}
          </div>

          {/* Lessons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {unit.lessons.map((lesson) => {
              const isExpanded = expandedLessons[lesson.id]

              return (
                <div
                  key={lesson.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Lesson Header */}
                  <div
                    onClick={() => toggleLesson(lesson.id)}
                    style={{
                      padding: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px' }}>
                      {/* Left: Title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                          {lesson.title}
                        </h3>
                      </div>

                      {/* Right: Tags + Chevron */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        {/* Metadata Tags */}
                        {lesson.metadata && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {lesson.metadata.split(' • ').map((item, tagIdx) => {
                              const value = item.includes(':') ? item.split(':')[1].trim() : item.trim()
                              return (
                                <span
                                  key={tagIdx}
                                  style={{
                                    padding: '4px 10px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    borderRadius: '4px',
                                    fontSize: '12px',
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
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#9ca3af',
                            transition: 'transform 0.2s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            flexShrink: 0
                          }}
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
                    <div style={{ padding: '0 24px 24px 24px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                      {/* Description */}
                      <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', marginBottom: '16px' }}>
                        {lesson.description}
                      </p>

                      {/* Progress Bar */}
                      {lesson.progress !== undefined && lesson.progress > 0 && (
                        <div style={{ paddingTop: '8px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{lesson.progress}%</span>
                          </div>
                          <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                background: 'linear-gradient(to right, #ec4899, #a855f7)',
                                transition: 'all 0.3s',
                                width: `${lesson.progress}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (lesson.lessonPlanUrl) {
                              window.open(lesson.lessonPlanUrl, '_blank')
                            }
                          }}
                          disabled={!lesson.lessonPlanUrl}
                          style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            fontWeight: 500,
                            fontSize: '14px',
                            background: lesson.lessonPlanUrl ? '#ffffff' : '#f3f4f6',
                            border: lesson.lessonPlanUrl ? '1px solid #d1d5db' : 'none',
                            color: lesson.lessonPlanUrl ? '#374151' : '#9ca3af',
                            cursor: lesson.lessonPlanUrl ? 'pointer' : 'not-allowed',
                            opacity: lesson.lessonPlanUrl ? 1 : 0.5
                          }}
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
                          style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            fontWeight: 500,
                            fontSize: '14px',
                            background: lesson.pptxUrl ? '#111827' : '#d1d5db',
                            border: 'none',
                            color: lesson.pptxUrl ? '#ffffff' : '#6b7280',
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
        </div>
      ))}
    </div>
  )
}
