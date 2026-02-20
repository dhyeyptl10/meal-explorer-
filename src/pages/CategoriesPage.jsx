import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )

    const fetchCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          'https://www.themealdb.com/api/json/v1/1/categories.php'
        )
        const data = await res.json()
        setCategories(data.categories || [])
      } catch {
        setError('Failed to fetch categories.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!loading && categories.length > 0 && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
        }
      )
    }
  }, [loading, categories])

  const trimDescription = (desc, max = 120) => {
    if (!desc) return ''
    return desc.length > max ? desc.slice(0, max) + '…' : desc
  }

  return (
    <main className="page">
      <section ref={headerRef} className="page-header">
        <div className="hero-eyebrow">✦ Browse All</div>
        <h1 className="page-title">
          Meal <em>Categories</em>
        </h1>
        <p className="page-sub">
          Explore {categories.length} cuisines and food categories
        </p>
      </section>

      {loading && (
        <div className="loading-wrap">
          <div className="loader" />
          <p>Loading categories…</p>
        </div>
      )}

      {error && (
        <div className="error-box">⚠ {error}</div>
      )}

      {!loading && !error && (
        <div className="category-grid" ref={gridRef}>
          {categories.map((cat) => (
            <div key={cat.idCategory} className="category-card">
              <div className="cat-img-wrap">
                <img
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  className="cat-img"
                  loading="lazy"
                />
                <div className="cat-overlay" />
              </div>
              <div className="cat-body">
                <h3 className="cat-name">{cat.strCategory}</h3>
                <p className="cat-desc">
                  {trimDescription(cat.strCategoryDescription)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
