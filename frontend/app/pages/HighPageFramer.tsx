import { useState, useEffect } from 'react'
import { CourseData } from '../types'
import { fetchCourseData } from '../services/courseServiceFramer'
import ModularCourse from '../ModularCourseInline'

export default function HighPage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const result = await fetchCourseData()
      if (result) {
        // Filter for High lessons only
        const filtered: CourseData = {
          units: result.units.map(unit => ({
            ...unit,
            lessons: unit.lessons.filter(lesson =>
              lesson.metadata?.includes('High') ||
              lesson.metadata?.includes('Audience: High')
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
      <div style={{ background: '#d1fae5', borderRadius: '12px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>High School</h1>
        <p style={{ fontSize: '18px', color: '#4b5563', maxWidth: '768px', margin: '0 auto' }}>
          Advanced lessons designed for high school students. Master complex concepts and prepare for college-level coursework through rigorous academic content.
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
            <p style={{ color: '#4b5563' }}>Loading High School courses...</p>
          </div>
        </div>
      ) : courseData && courseData.units.length > 0 ? (
        <ModularCourse data={courseData} useSupabase={false} />
      ) : (
        <div style={{ textAlign: 'center', padding: '48px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280' }}>No high school lessons available.</p>
        </div>
      )}
    </div>
  )
}
