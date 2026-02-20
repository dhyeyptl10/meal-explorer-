import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MealCard from '../components/MealCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const heroRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
    fetchByLetter('a')
  }, [])

  const fetchByLetter = async (letter) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
      )
      const data = await res.json()
      setMeals(data.meals || [])
    } catch {
      setError('Failed to fetch meals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`
      )
      const data = await res.json()
      setMeals(data.meals || [])
      if (!data.meals) setError('No meals found. Try a different search.')
    } catch {
      setError('Failed to fetch meals. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  return (
    <main className="page">
      <section ref={heroRef} className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">✦ Culinary Discovery</div>
          <h1 className="hero-title">
            Explore the World<br />
            <em>One Meal at a Time</em>
          </h1>
          <p className="hero-sub">
            Search thousands of recipes from every corner of the globe
          </p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-wrap">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Search meals… e.g. Pasta, Sushi, Curry"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>

        <div className="letter-filter">
          <span className="filter-label">Browse by letter:</span>
          <div className="letters">
            {alphabet.map((letter) => (
              <button
                key={letter}
                className="letter-btn"
                onClick={() => {
                  setQuery('')
                  fetchByLetter(letter)
                }}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="results-section">
        {loading && (
          <div className="loading-wrap">
            <div className="loader" />
            <p>Discovering meals…</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-box">
            <span>⚠</span> {error}
          </div>
        )}

        {!loading && !error && meals.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">{meals.length} meals found</span>
            </div>
            <div className="meal-grid">
              {meals.map((meal, i) => (
                <MealCard key={meal.idMeal} meal={meal} index={i} />
              ))}
            </div>
          </>
        )}

        {!loading && !error && meals.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🍽</div>
            <p>No meals found. Try searching something else!</p>
          </div>
        )}
      </section>
    </main>
  )
}
