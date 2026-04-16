'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { User } from '@supabase/supabase-js'

interface ProfileSetupProps {
  user: User
}

export function ProfileSetup({ user }: ProfileSetupProps) {
  const [username, setUsername] = useState(user.user_metadata?.username || '')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      setIsLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // Check if username is taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .single()

    if (existing) {
      setError('Username is already taken')
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: username.toLowerCase(),
        display_name: displayName || null,
        bio: bio || null,
        theme: 'default',
      })

    if (insertError) {
      setError(insertError.message)
      setIsLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Choose your unique username to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <span className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  linkhub.com/
                </span>
                <Input
                  id="username"
                  type="text"
                  placeholder="yourname"
                  required
                  className="rounded-l-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell people about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating profile...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
