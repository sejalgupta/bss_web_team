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
                      {/* Debug info - remove this later */}
                      {!lesson.fullData && (
                        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '6px', marginBottom: '16px' }}>
                          <p style={{ fontSize: '13px', color: '#92400e' }}>No detailed lesson data available yet. Please ensure all fields are filled in the data entry form.</p>
                        </div>
                      )}

                      {/* Learning Objectives */}
                      {lesson.fullData?.learning_objectives && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            Learning Objectives:
                          </h4>
                          {Array.isArray(lesson.fullData.learning_objectives) ? (
                            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>
                              {lesson.fullData.learning_objectives.map((obj: string, idx: number) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{obj}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                              {lesson.fullData.learning_objectives}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Materials */}
                      {lesson.fullData?.materials && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            Materials (for lesson or associated activities):
                          </h4>
                          {Array.isArray(lesson.fullData.materials) ? (
                            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>
                              {lesson.fullData.materials.map((material: string, idx: number) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{material}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                              {lesson.fullData.materials}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Teaching Activities */}
                      {lesson.fullData?.teaching_activities && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            Recommended Teaching Activities:
                          </h4>
                          {Array.isArray(lesson.fullData.teaching_activities) ? (
                            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>
                              {lesson.fullData.teaching_activities.map((activity: string, idx: number) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{activity}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                              {lesson.fullData.teaching_activities}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Application */}
                      {lesson.fullData?.application && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            Application:
                          </h4>
                          <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
                            {lesson.fullData.application}
                          </p>
                        </div>
                      )}

                      {/* Assessment */}
                      {lesson.fullData?.assessment && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            Assessment:
                          </h4>
                          <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {lesson.fullData.assessment}
                          </p>
                        </div>
                      )}

                      {/* References */}
                      {lesson.fullData?.refs && Array.isArray(lesson.fullData.refs) && lesson.fullData.refs.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                            References:
                          </h4>
                          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#4b5563', lineHeight: '1.8' }}>
                            {lesson.fullData.refs.map((ref: string, idx: number) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{ref}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
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
