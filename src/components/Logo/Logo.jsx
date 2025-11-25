import { useState, useEffect } from 'react'

/**
 * Composant Logo - Logo de l'application (avocat avec ciel étoilé)
 * @param {Object} props
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {string} props.size - Taille du logo ('sm' | 'md' | 'lg' | 'xl')
 */
function Logo({ className = '', size = 'md' }) {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  }

  // Essayer plusieurs formats d'image dans le dossier assets
  const imageSources = [
    '/assets/logo.png',
    '/assets/logo.svg',
    '/assets/logo.jpg',
    '/assets/logo.webp',
    '/assets/avocado.png',
    '/assets/avocado.svg',
    '/assets/avocado.jpg',
    '/assets/avocado.webp'
  ]

  useEffect(() => {
    // Essayer de charger la première image disponible
    let currentIndex = 0
    
    const tryLoadImage = (index) => {
      if (index >= imageSources.length) {
        setImageError(true)
        return
      }

      const img = new Image()
      img.onload = () => {
        setImageSrc(imageSources[index])
        setImageError(false)
      }
      img.onerror = () => {
        tryLoadImage(index + 1)
      }
      img.src = imageSources[index]
    }

    tryLoadImage(0)
  }, [])

  if (imageError || !imageSrc) {
    // Fallback vers l'icône si l'image n'est pas trouvée
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} flex items-center justify-center bg-primary/10 dark:bg-primary/20 rounded-2xl p-2`}>
          <span 
            className={`material-symbols-outlined text-primary ${iconSizes[size]}`}
            style={{ fontVariationSettings: "'wght' 300, 'opsz' 48, 'FILL' 1" }}
          >
            kitchen
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={imageSrc}
        alt="Logo de l'application"
        className={`${sizeClasses[size]} object-contain drop-shadow-sm`}
        onError={() => {
          setImageError(true)
        }}
      />
    </div>
  )
}

export default Logo

