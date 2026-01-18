interface HomePageProps {
  onNavigate?: (path: string) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const grades = [
    {
      title: 'Elementary School',
      subtitle: 'Kindergarten - 5th Grade',
      path: '/elementary',
      icon: (
        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
        </svg>
      )
    },
    {
      title: 'Middle School',
      subtitle: '6th - 8th Grade',
      path: '/middle',
      icon: (
        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        </svg>
      )
    },
    {
      title: 'High School',
      subtitle: '9th - 12th grade',
      path: '/high',
      icon: (
        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12l10 5 10-5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Gayatri Pariwar
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
          Explore structured lessons for Elementary, Middle, and High School
        </p>
      </div>

      {/* Grade Level Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <button
              key={grade.path}
              onClick={() => {
                if (onNavigate) {
                  onNavigate(grade.path)
                } else {
                  window.location.href = grade.path
                }
              }}
              className="bg-white rounded-2xl p-10 hover:shadow-xl transition-all duration-200 group border border-gray-200 hover:border-gray-300"
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                {grade.icon}
              </div>

              {/* Text */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {grade.subtitle}
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  {grade.title}
                </h2>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
