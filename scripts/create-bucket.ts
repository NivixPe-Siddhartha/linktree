import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
  })
  
  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket "avatars" already exists or has been created.')
    } else {
      console.error('Error creating bucket:', error.message)
    }
  } else {
    console.log('Successfully created the "avatars" storage bucket!', data)
  }
}

createBucket()
