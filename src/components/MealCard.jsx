import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useLikes } from '../context/LikesContext'

export default function MealCard({ meal, index = 0 }) {
  const { toggleLike, isLiked } = useLikes()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const imgRef = useRef(null)
  const liked = isLiked(meal.idMeal)

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.07,
        ease: 'power3.out',
      }
    )
  }, [])

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: 'power2.out' })
    gsap.to(imgRef.current, { scale: 1.07, duration: 0.4, ease: 'power2.out' })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' })
    gsap.to(imgRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' })
  }

  const handleLike = (e) => {
    e.stopPropagation()
    gsap.fromTo(
      e.currentTarget,
      { scale: 1 },
      { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
    )
    toggleLike(meal.idMeal)
  }

  return (
    <div
      ref={cardRef}
      className="meal-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-img-wrap">
        <img
          ref={imgRef}
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="card-img"
          loading="lazy"
        />
        <div className="card-overlay" />
        <span className="card-category">{meal.strCategory}</span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{meal.strMeal}</h3>

        <div className="card-actions">
          <button
            className={`btn-like ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            aria-label={liked ? 'Unlike meal' : 'Like meal'}
          >
            {liked ? '♥' : '♡'}
          </button>
          <button
            className="btn-details"
            onClick={() => navigate(`/meal/${meal.idMeal}`)}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}
