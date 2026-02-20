import { NavLink } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLikes } from '../context/LikesContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { likedIds } = useLikes()
  const { theme, toggleTheme } = useTheme()
  const navRef = useRef(null)
  const logoRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    gsap.fromTo(
      logoRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power3.out' }
    )
  }, [])

  return (
    <nav ref={navRef} className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo" ref={logoRef}>
          <span className="logo-icon">✦</span>
          <span className="logo-text">Meal<em>Explorer</em></span>
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">⊕</span>
            Search
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">◈</span>
            Categories
          </NavLink>
          <NavLink
            to="/liked"
            className={({ isActive }) => `nav-link liked-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">♥</span>
            Liked
            {likedIds.length > 0 && (
              <span className="liked-badge">{likedIds.length}</span>
            )}
          </NavLink>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span className="theme-icon">{theme === 'dark' ? '☀' : '◑'}</span>
        </button>
      </div>
    </nav>
  )
}
