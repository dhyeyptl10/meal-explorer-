import { createContext, useContext, useState, useEffect } from 'react'

const LikesContext = createContext()

export function LikesProvider({ children }) {
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('meal-explorer-liked')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('meal-explorer-liked', JSON.stringify(likedIds))
  }, [likedIds])

  const toggleLike = (id) => {
    setLikedIds(prev => {
      if (prev.includes(String(id))) {
        return prev.filter(lid => lid !== String(id))
      } else {
        return [...prev, String(id)]
      }
    })
  }

  const isLiked = (id) => likedIds.includes(String(id))

  const removeLike = (id) => {
    setLikedIds(prev => prev.filter(lid => lid !== String(id)))
  }

  return (
    <LikesContext.Provider value={{ likedIds, toggleLike, isLiked, removeLike }}>
      {children}
    </LikesContext.Provider>
  )
}

export const useLikes = () => useContext(LikesContext)
