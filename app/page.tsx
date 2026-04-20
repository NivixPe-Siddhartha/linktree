import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/public/profile-page'
import type { Metadata } from 'next'

// Look up by user ID (never changes, even when username changes).
// Set NEXT_PUBLIC_PROFILE_USER_ID in your .env.local and Vercel env vars.
const PROFILE_USER_ID = process.env.NEXT_PUBLIC_PROFILE_USER_ID

export async function generateMetadata(): Promise<Metadata> {
  if (!PROFILE_USER_ID) return { title: 'LinkHub' }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', PROFILE_USER_ID)
    .single()

  if (!profile) {
    return { title: 'LinkHub' }
  }

  return {
    title: profile.display_name || 'LinkHub',
    description: profile.bio || 'Check out our links',
  }
}

export default async function HomePage() {
  if (!PROFILE_USER_ID) {
    notFound()
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', PROFILE_USER_ID)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true })

  return <ProfilePage profile={profile} links={links || []} />
}
