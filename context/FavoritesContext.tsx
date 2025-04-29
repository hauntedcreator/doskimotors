'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface FavoriteVehicle {
  id: string
  timestamp: number
  userEmail?: string
}

interface FavoritesContextType {
  favorites: FavoriteVehicle[]
  addFavorite: (vehicleId: string, email?: string) => void
  removeFavorite: (vehicleId: string) => void
  updateFavoriteEmail: (vehicleId: string, email: string) => void
  isFavorite: (vehicleId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('vehicleFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vehicleFavorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (vehicleId: string, email?: string) => {
    setFavorites(prev => {
      const existingFavorite = prev.find(fav => fav.id === vehicleId)
      if (!existingFavorite) {
        return [...prev, { 
          id: vehicleId, 
          timestamp: Date.now(),
          userEmail: email 
        }]
      }
      if (email && !existingFavorite.userEmail) {
        return prev.map(fav => 
          fav.id === vehicleId ? { ...fav, userEmail: email } : fav
        )
      }
      return prev
    })
  }

  const removeFavorite = (vehicleId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== vehicleId))
  }

  const updateFavoriteEmail = (vehicleId: string, email: string) => {
    setFavorites(prev => prev.map(fav => 
      fav.id === vehicleId ? { ...fav, userEmail: email } : fav
    ))
  }

  const isFavorite = (vehicleId: string) => {
    return favorites.some(fav => fav.id === vehicleId)
  }

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      updateFavoriteEmail,
      isFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
} 