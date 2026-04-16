import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LinkManager } from '@/components/dashboard/link-manager'
import { ProfileSetup } from '@/components/dashboard/profile-setup'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile, show profile setup
  if (!profile) {
    return <ProfileSetup user={user} />
  }

  // Get user's links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Links</h1>
        <p className="text-slate-600">Manage and organize your links</p>
      </div>
      <LinkManager initialLinks={links || []} userId={user.id} />
    </div>
  )
}
