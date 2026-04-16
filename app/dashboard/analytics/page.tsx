import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    redirect("/dashboard")
  }

  // Get links with click counts
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true })

  // Get click analytics for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: clickData } = await supabase
    .from("link_clicks")
    .select("*, links!inner(user_id)")
    .eq("links.user_id", user.id)
    .gte("clicked_at", thirtyDaysAgo.toISOString())
    .order("clicked_at", { ascending: true })

  return (
    <AnalyticsDashboard
      profile={profile}
      links={links || []}
      clickData={clickData || []}
    />
  )
}
