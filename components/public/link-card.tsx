'use client'

import { useState } from 'react'
import type { Link } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface LinkCardProps {
  link: Link
  theme: {
    bg: string
    card: string
    text: string
    accent: string
  }
  isDemo?: boolean
}

export function LinkCard({ link, theme, isDemo = false }: LinkCardProps) {
  const [isClicking, setIsClicking] = useState(false)

  const handleClick = async () => {
    setIsClicking(true)
    
    // Track click via API (skip for demo)
    if (!isDemo) {
      try {
        await fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkId: link.id }),
        })
      } catch (error) {
        // Silently fail - don't block the user from navigating
      }
    }
    
    // Open link
    window.open(link.url, '_blank', 'noopener,noreferrer')
    setIsClicking(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isClicking}
      className={`group w-full rounded-xl ${theme.accent} p-4 text-center font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] disabled:opacity-75`}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="truncate">{link.title}</span>
        <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </button>
  )
}
