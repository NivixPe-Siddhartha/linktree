'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setIsUploading(true)

      const file = event.target.files?.[0]
      if (!file) return

      // Validate file
      if (!file.type.includes('image')) {
        throw new Error('Please upload an image file.')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB.')
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('row-level security')) {
            throw new Error('Storage not configured. Please create an "avatars" public bucket in your Supabase project.')
        }
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (error: any) {
      console.error('Upload Error:', error)
      setError(error.message || 'Error uploading image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border">
          <AvatarImage src={value} alt="Profile" />
          <AvatarFallback className="bg-slate-100 text-slate-400">
            <Upload className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </Button>
            {value && (
              <Button type="button" variant="destructive" onClick={onRemove} disabled={isUploading}>
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Recommended: Square JPG, PNG, or WebP. Max 5MB.
          </p>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  )
}
