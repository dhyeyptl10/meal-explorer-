import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ThemeProvider } from './context/ThemeContext'
import { LikesProvider } from './context/LikesContext'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import MealDetails from './pages/MealDetails'
import CategoriesPage from './pages/CategoriesPage'
import LikedMeals from './pages/LikedMeals'

function PageWrapper({ children }) {
  const location = useLocation()
  const wrapperRef = useRef(null)

  useEffect(() => {
    const el = wrapperRef.current
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
    )
  }, [location.pathname])

  return (
    <div ref={wrapperRef} className="page-wrapper">
      {children}
    </div>
  )
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          <Route path="/liked" element={<LikedMeals />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </PageWrapper>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LikesProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LikesProvider>
    </ThemeProvider>
  )
}

export default App
