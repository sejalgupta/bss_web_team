import { useState, useEffect } from 'react'
import { CourseData } from '../types'
import { fetchCourseData } from '../services/courseServiceFramer'
import ModularCourse from '../ModularCourseInline'

export default function MiddlePage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const result = await fetchCourseData()
      if (result) {
        // Filter for Middle lessons only
        const filtered: CourseData = {
          units: result.units.map(unit => ({
            ...unit,
            lessons: unit.lessons.filter(lesson =>
              lesson.metadata?.includes('Middle') ||
              lesson.metadata?.includes('Audience: Middle')
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
      <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Middle School</h1>
        <p style={{ fontSize: '18px', color: '#4b5563', maxWidth: '768px', margin: '0 auto' }}>
          Comprehensive lessons designed for middle school students. Develop critical thinking and problem-solving skills through structured learning modules.
        </p>
      </div>

      {/* Course Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid #e5e7eb',
              borderTopColor: '#111827',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#4b5563' }}>Loading Middle School courses...</p>
          </div>
        </div>
      ) : courseData && courseData.units.length > 0 ? (
        <ModularCourse data={courseData} useSupabase={false} />
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No middle school lessons available.</p>
        </div>
      )}
    </div>
  )
}
