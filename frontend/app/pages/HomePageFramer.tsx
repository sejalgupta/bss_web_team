/**
 * Framer-specific wrapper for HomePage
 * Use this component directly in Framer without any props
 */

export default function HomePageFramer() {
  console.log('HomePageFramer component loaded')

  const grades = [
    {
      title: 'Elementary School',
      subtitle: 'Kindergarten - 5th Grade',
      path: '/elementary',
      color: '#dbeafe'
    },
    {
      title: 'Middle School',
      subtitle: '6th - 8th Grade',
      path: '/middle',
      color: '#fef3c7'
    },
    {
      title: 'High School',
      subtitle: '9th - 12th grade',
      path: '/high',
      color: '#d1fae5'
    }
  ]

  const handleCardClick = (path: string) => {
    console.log('Card clicked, navigating to:', path)
    // In Framer, direct navigation
    window.location.href = path
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1152px',
        width: '100%',
        margin: '0 auto',
        padding: '128px 24px 80px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '24px',
          letterSpacing: '-0.025em',
          margin: '0 0 24px 0'
        }}>
          Gayatri Pariwar
        </h1>
        <p style={{
          fontSize: '24px',
          color: '#4b5563',
          maxWidth: '768px',
          margin: '0 auto'
        }}>
          Explore structured lessons for Elementary, Middle, and High School
        </p>
      </div>

      {/* Grade Level Cards */}
      <div style={{
        maxWidth: '1152px',
        width: '100%',
        margin: '0 auto',
        padding: '0 24px 128px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {grades.map((grade, index) => (
            <button
              key={grade.path}
              onClick={() => handleCardClick(grade.path)}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '40px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '280px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Icon Placeholder with grade-specific color */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: grade.color,
                  borderRadius: '50%'
                }}></div>
              </div>

              {/* Text */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: 0
                }}>
                  {grade.subtitle}
                </p>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0
                }}>
                  {grade.title}
                </h2>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Debug info - remove after testing */}
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        Component Loaded ✓
      </div>
    </div>
  )
}
