'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile, Link, Theme } from '@/lib/types'
import { THEMES } from '@/lib/types'
import { LinkCard } from './link-card'

interface ProfilePageProps {
  profile: Profile
  links: Link[]
  isDemo?: boolean
}

export function ProfilePage({ profile, links, isDemo = false }: ProfilePageProps) {
  const theme = THEMES[profile.theme as Theme] || THEMES.default

  const initials = profile.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username[0].toUpperCase()

  return (
    <div className={`min-h-screen ${theme.bg} px-4 py-8 sm:py-16`}>
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username} />
            <AvatarFallback className="bg-slate-200 text-2xl font-semibold text-slate-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <h1 className={`mt-4 text-2xl font-bold ${theme.text}`}>
            {profile.display_name || profile.username}
          </h1>
          
          <p className={`mt-1 text-sm opacity-75 ${theme.text}`}>
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className={`mt-3 max-w-sm text-sm opacity-75 ${theme.text}`}>
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mt-8 space-y-3">
          {links.length === 0 ? (
            <div className={`rounded-xl ${theme.card} p-8 text-center`}>
              <p className={`${theme.text} opacity-75`}>No links yet</p>
            </div>
          ) : (
            links.map((link) => (
              <LinkCard key={link.id} link={link} theme={theme} isDemo={isDemo} />
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className={`text-sm ${theme.text} opacity-50 transition-opacity hover:opacity-75`}
          >
            Create your own LinkHub
          </a>
        </div>
      </div>
    </div>
  )
}
