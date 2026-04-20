'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Profile, Theme } from '@/lib/types'
import { Check } from 'lucide-react'
import { ImageUpload } from './image-upload'

interface SettingsFormProps {
  profile: Profile
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [theme, setTheme] = useState<Theme>(profile.theme as Theme || 'default')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError('')

    // --- Username validation ---
    const trimmed = username.trim().toLowerCase()

    if (trimmed.length < 3) {
      setError('Username must be at least 3 characters.')
      setIsLoading(false)
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setError('Username can only contain letters, numbers, and underscores.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // Check uniqueness only if username actually changed
    if (trimmed !== profile.username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmed)
        .single()

      if (existing) {
        setError('That username is already taken. Please choose another.')
        setIsLoading(false)
        return
      }
    }

    // --- Save all fields ---
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: trimmed,
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
        theme: theme,
      })
      .eq('id', profile.id)

    if (updateError) {
      setError('Failed to save changes. Please try again.')
    } else {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  const themeOptions: { value: Theme; label: string; preview: string }[] = [
    { value: 'default', label: 'Classic', preview: 'bg-gradient-to-br from-slate-100 to-slate-200' },
    { value: 'dark', label: 'Dark', preview: 'bg-gradient-to-br from-slate-900 to-slate-800' },
    { value: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' },
    { value: 'minimal', label: 'Minimal', preview: 'bg-white border-2 border-slate-200' },
    { value: 'neon', label: 'Neon', preview: 'bg-slate-950 border-2 border-emerald-500' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="your_username"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Only letters, numbers, and underscores. Minimum 3 characters.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
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
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <ImageUpload
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              onRemove={() => setAvatarUrl('')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how your public page looks</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as Theme)}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5"
          >
            {themeOptions.map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.value}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-transparent p-3 transition-all hover:bg-slate-50 peer-data-[state=checked]:border-slate-900"
                >
                  <div className={`h-16 w-full rounded-md ${option.preview}`} />
                  <span className="text-sm font-medium">{option.label}</span>
                  {theme === option.value && (
                    <Check className="h-4 w-4 text-slate-900" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {success && !error && (
          <p className="text-sm text-emerald-600">Changes saved successfully!</p>
        )}
      </div>
    </form>
  )
}
