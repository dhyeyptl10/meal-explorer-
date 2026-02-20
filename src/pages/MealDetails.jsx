import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useLikes } from '../context/LikesContext'

export default function MealDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toggleLike, isLiked } = useLikes()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFullInstructions, setShowFullInstructions] = useState(false)
  const contentRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        )
        const data = await res.json()
        if (data.meals && data.meals[0]) {
          setMeal(data.meals[0])
        } else {
          setError('Meal not found.')
        }
      } catch {
        setError('Failed to fetch meal details.')
      } finally {
        setLoading(false)
      }
    }
    fetchMeal()
  }, [id])

  useEffect(() => {
    if (meal && contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
      gsap.fromTo(
        imgRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
      )
    }
  }, [meal])

  const getIngredients = (meal) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]
      if (ingredient && ingredient.trim()) {
        ingredients.push({ ingredient, measure: measure?.trim() || '' })
      }
    }
    return ingredients
  }

  const liked = meal ? isLiked(meal.idMeal) : false

  const handleLike = () => {
    toggleLike(meal.idMeal)
    gsap.fromTo(
      '.detail-like-btn',
      { scale: 1 },
      { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }
    )
  }

  if (loading) {
    return (
      <div className="page center-page">
        <div className="loader" />
        <p>Loading meal details…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page center-page">
        <div className="error-box">⚠ {error}</div>
        <button className="btn-back" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    )
  }

  const ingredients = getIngredients(meal)
  const instructions = meal.strInstructions || ''
  const shortInstructions = instructions.length > 500
    ? instructions.slice(0, 500) + '…'
    : instructions

  return (
    <main className="page detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-layout">
        <div className="detail-img-col">
          <div className="detail-img-wrap" ref={imgRef}>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="detail-img" />
            <div className="detail-img-overlay" />
          </div>

          <div className="detail-meta-tags">
            {meal.strCategory && (
              <span className="meta-tag category-tag">{meal.strCategory}</span>
            )}
            {meal.strArea && (
              <span className="meta-tag area-tag">{meal.strArea}</span>
            )}
          </div>

          <button
            className={`detail-like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <span>{liked ? '♥' : '♡'}</span>
            {liked ? 'Liked!' : 'Add to Liked'}
          </button>
        </div>

        <div className="detail-content-col" ref={contentRef}>
          <div className="detail-eyebrow">Recipe Details</div>
          <h1 className="detail-title">{meal.strMeal}</h1>

          <div className="detail-section">
            <h2 className="section-heading">Instructions</h2>
            <p className="detail-instructions">
              {showFullInstructions ? instructions : shortInstructions}
            </p>
            {instructions.length > 500 && (
              <button
                className="expand-btn"
                onClick={() => setShowFullInstructions(!showFullInstructions)}
              >
                {showFullInstructions ? 'Show Less ↑' : 'Read Full Recipe ↓'}
              </button>
            )}
          </div>

          <div className="detail-section">
            <h2 className="section-heading">Ingredients</h2>
            <div className="ingredients-grid">
              {ingredients.map(({ ingredient, measure }, i) => (
                <div key={i} className="ingredient-item">
                  <span className="ingredient-measure">{measure}</span>
                  <span className="ingredient-name">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-link"
            >
              ▶ Watch on YouTube
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
