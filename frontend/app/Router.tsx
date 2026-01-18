import { useState, useEffect } from 'react'
import FramerLayout from './FramerLayout'
import ElementaryPage from './pages/ElementaryPage'
import MiddlePage from './pages/MiddlePage'
import HighPage from './pages/HighPage'

export default function Router() {
  const [currentPage, setCurrentPage] = useState<'home' | 'elementary' | 'middle' | 'high'>('home')

  // Read page from URL query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page') as 'home' | 'elementary' | 'middle' | 'high' | null
    if (page && ['home', 'elementary', 'middle', 'high'].includes(page)) {
      setCurrentPage(page)
    }
  }, [])

  // Navigation handler
  const handleNavigate = (path: string) => {
    let page: 'home' | 'elementary' | 'middle' | 'high' = 'home'

    if (path === '/' || path === '/?page=home') {
      page = 'home'
    } else if (path === '/elementary' || path.includes('elementary')) {
      page = 'elementary'
    } else if (path === '/middle' || path.includes('middle')) {
      page = 'middle'
    } else if (path === '/high' || path.includes('high')) {
      page = 'high'
    }

    // Update URL with query parameter
    window.history.pushState({}, '', `/?page=${page}`)
    setCurrentPage(page)
  }

  return (
    <FramerLayout currentPath={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'elementary' && <ElementaryPage />}
      {currentPage === 'middle' && <MiddlePage />}
      {currentPage === 'high' && <HighPage />}
    </FramerLayout>
  )
}
