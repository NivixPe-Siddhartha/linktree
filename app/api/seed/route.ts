import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
  // Use service role key to bypass RLS for admin operations
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  try {
    // 1. Create the user using Admin API
    const email = 'team@nivixpe.com'
    const password = 'Siddhu@2006'
    const username = 'nivixpe'

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
      console.log('User already exists, using existing user ID:', userId)
    } else {
      // Create new user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          username,
          display_name: 'Nivixpe Team'
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json({ error: authError.message }, { status: 500 })
      }

      userId = authData.user!.id
      console.log('Created new user with ID:', userId)
    }

    // 2. Create or update profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        username,
        display_name: 'Nivixpe Team',
        bio: 'Building amazing digital experiences. Connect with us across the web!',
        avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=NT&backgroundColor=0ea5e9',
        theme: 'ocean'
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 3. Delete existing links for this user (to start fresh)
    await supabaseAdmin
      .from('links')
      .delete()
      .eq('user_id', userId)

    // 4. Create sample links
    const sampleLinks = [
      {
        user_id: userId,
        title: 'Our Website',
        url: 'https://nivixpe.com',
        icon: 'globe',
        position: 0,
        is_active: true,
        clicks: 245
      },
      {
        user_id: userId,
        title: 'Twitter / X',
        url: 'https://twitter.com/nivixpe',
        icon: 'twitter',
        position: 1,
        is_active: true,
        clicks: 189
      },
      {
        user_id: userId,
        title: 'LinkedIn',
        url: 'https://linkedin.com/company/nivixpe',
        icon: 'linkedin',
        position: 2,
        is_active: true,
        clicks: 156
      },
      {
        user_id: userId,
        title: 'GitHub',
        url: 'https://github.com/nivixpe',
        icon: 'github',
        position: 3,
        is_active: true,
        clicks: 312
      },
      {
        user_id: userId,
        title: 'YouTube Channel',
        url: 'https://youtube.com/@nivixpe',
        icon: 'youtube',
        position: 4,
        is_active: true,
        clicks: 98
      },
      {
        user_id: userId,
        title: 'Contact Us',
        url: 'mailto:team@nivixpe.com',
        icon: 'mail',
        position: 5,
        is_active: true,
        clicks: 67
      }
    ]

    const { data: linksData, error: linksError } = await supabaseAdmin
      .from('links')
      .insert(sampleLinks)
      .select()

    if (linksError) {
      console.error('Links error:', linksError)
      return NextResponse.json({ error: linksError.message }, { status: 500 })
    }

    // 5. Create sample click analytics (last 7 days)
    const clicksData = []
    const now = new Date()
    
    for (const link of linksData || []) {
      // Generate random clicks for each day in the last 7 days
      for (let day = 0; day < 7; day++) {
        const clickCount = Math.floor(Math.random() * 15) + 3
        for (let i = 0; i < clickCount; i++) {
          const clickDate = new Date(now)
          clickDate.setDate(clickDate.getDate() - day)
          clickDate.setHours(Math.floor(Math.random() * 24))
          clickDate.setMinutes(Math.floor(Math.random() * 60))

          const referrers = ['google.com', 'twitter.com', 'linkedin.com', 'direct', 'instagram.com', null]
          const countries = ['US', 'UK', 'IN', 'CA', 'DE', 'AU', 'FR']
          const cities = ['New York', 'London', 'Mumbai', 'Toronto', 'Berlin', 'Sydney', 'Paris']

          clicksData.push({
            link_id: link.id,
            clicked_at: clickDate.toISOString(),
            referrer: referrers[Math.floor(Math.random() * referrers.length)],
            user_agent: 'Mozilla/5.0 (compatible; seed-data)',
            country: countries[Math.floor(Math.random() * countries.length)],
            city: cities[Math.floor(Math.random() * cities.length)]
          })
        }
      }
    }

    if (clicksData.length > 0) {
      const { error: clicksError } = await supabaseAdmin
        .from('link_clicks')
        .insert(clicksData)

      if (clicksError) {
        console.error('Clicks error:', clicksError)
        // Don't fail the whole operation for clicks
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data seeded successfully!',
      user: {
        id: userId,
        email,
        username
      },
      linksCreated: linksData?.length || 0,
      clicksCreated: clicksData.length
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
