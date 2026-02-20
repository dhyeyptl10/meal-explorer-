import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useLikes } from '../context/LikesContext'

export default function LikedMeals() {
  const { likedIds, removeLike } = useLikes()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => {
    if (likedIds.length === 0) {
      setMeals([])
      return
    }

    const fetchLikedMeals = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          likedIds.map((id) =>
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
              .then((r) => r.json())
              .then((d) => d.meals?.[0] || null)
          )
        )
        setMeals(results.filter(Boolean))
      } catch {
        setMeals([])
      } finally {
        setLoading(false)
      }
    }

    fetchLikedMeals()
  }, [likedIds])

  useEffect(() => {
    if (!loading && meals.length > 0 && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, meals])

  const handleRemove = (id, cardEl) => {
    gsap.to(cardEl, {
      opacity: 0,
      scale: 0.9,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => removeLike(id),
    })
  }

  return (
    <main className="page">
      <section ref={headerRef} className="page-header">
        <div className="hero-eyebrow">♥ Your Collection</div>
        <h1 className="page-title">
          Liked <em>Meals</em>
        </h1>
        <p className="page-sub">
          {likedIds.length > 0
            ? `${likedIds.length} meal${likedIds.length !== 1 ? 's' : ''} saved to your collection`
            : 'Start exploring and save meals you love'}
        </p>
      </section>

      {loading && (
        <div className="loading-wrap">
          <div className="loader" />
          <p>Loading your liked meals…</p>
        </div>
      )}

      {!loading && likedIds.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <p>No liked meals yet.</p>
          <button className="btn-cta" onClick={() => navigate('/')}>
            Explore Meals →
          </button>
        </div>
      )}

      {!loading && meals.length > 0 && (
        <div className="meal-grid liked-grid" ref={gridRef}>
          {meals.map((meal) => (
            <LikedCard
              key={meal.idMeal}
              meal={meal}
              onRemove={handleRemove}
              onView={() => navigate(`/meal/${meal.idMeal}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}

function LikedCard({ meal, onRemove, onView }) {
  const cardRef = useRef(null)

  return (
    <div ref={cardRef} className="meal-card liked-card">
      <div className="card-img-wrap">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="card-img"
          loading="lazy"
        />
        <div className="card-overlay" />
        <span className="card-category">{meal.strCategory}</span>
        <div className="liked-indicator">♥</div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{meal.strMeal}</h3>
        <div className="card-actions">
          <button
            className="btn-remove"
            onClick={() => onRemove(meal.idMeal, cardRef.current)}
          >
            ✕ Remove
          </button>
          <button className="btn-details" onClick={onView}>
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}
