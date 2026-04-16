export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  theme: string
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  icon: string | null
  position: number
  is_active: boolean
  clicks: number
  created_at: string
  updated_at: string
}

export interface LinkClick {
  id: string
  link_id: string
  clicked_at: string
  referrer: string | null
  user_agent: string | null
  country: string | null
  city: string | null
}

export interface ProfileWithLinks extends Profile {
  links: Link[]
}

export type Theme = 'default' | 'dark' | 'gradient' | 'minimal' | 'neon'

export const THEMES: Record<Theme, { bg: string; card: string; text: string; accent: string }> = {
  default: {
    bg: 'bg-gradient-to-br from-slate-100 to-slate-200',
    card: 'bg-white',
    text: 'text-slate-900',
    accent: 'bg-slate-900 text-white hover:bg-slate-800'
  },
  dark: {
    bg: 'bg-gradient-to-br from-slate-900 to-slate-800',
    card: 'bg-slate-800',
    text: 'text-white',
    accent: 'bg-white text-slate-900 hover:bg-slate-100'
  },
  gradient: {
    bg: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    card: 'bg-white/90 backdrop-blur-sm',
    text: 'text-slate-900',
    accent: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
  },
  minimal: {
    bg: 'bg-white',
    card: 'bg-slate-50',
    text: 'text-slate-900',
    accent: 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-200'
  },
  neon: {
    bg: 'bg-slate-950',
    card: 'bg-slate-900 border border-emerald-500/30',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25'
  }
}
