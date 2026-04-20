import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/public/profile-page'
import type { Metadata } from 'next'

// The Nivixpe profile is served at the root URL — no username in the URL.
const PROFILE_USERNAME = 'sahi0045'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', PROFILE_USERNAME)
    .single()

  if (!profile) {
    return { title: 'LinkHub' }
  }

  return {
    title: `${profile.display_name || 'LinkHub'}`,
    description: profile.bio || 'Check out our links',
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', PROFILE_USERNAME)
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
