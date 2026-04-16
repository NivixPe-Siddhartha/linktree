import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { linkId } = await request.json()

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get referrer and user agent from headers
    const referrer = request.headers.get('referer') || null
    const userAgent = request.headers.get('user-agent') || null

    // Insert click record
    await supabase.from('link_clicks').insert({
      link_id: linkId,
      referrer,
      user_agent: userAgent,
    })

    // Increment clicks counter on the link
    await supabase.rpc('increment_link_clicks', { link_id: linkId })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
