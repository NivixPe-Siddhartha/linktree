import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/public/profile-page'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()

  if (!profile) {
    return {
      title: 'User Not Found - LinkHub',
    }
  }

  return {
    title: `${profile.display_name || profile.username} - LinkHub`,
    description: profile.bio || `Check out ${profile.display_name || profile.username}'s links`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
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
