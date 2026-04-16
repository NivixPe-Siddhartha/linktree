# Deployment Guide

## ✅ Pre-Deployment Checklist

Your application is ready for production deployment!

### 1. Environment Variables

Add these to your hosting platform (Vercel/Netlify/etc.):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dhzreoocvibyetxscqft.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenJlb29jdmlieWV0eHNjcWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjA5MzcsImV4cCI6MjA5MTkzNjkzN30.ACH1UY7DTC6Y0LTwy6wcUAIqVoAK1r_ZBEHu5eVRtWI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenJlb29jdmlieWV0eHNjcWZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM2MDkzNywiZXhwIjoyMDkxOTM2OTM3fQ.SEZo2wmnvsHjltIXSTIybV7P8QYcVm4QHYKSWMG1Y8s
```

### 2. Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **Authentication** → **URL Configuration**
3. Add your production domain to **Redirect URLs**:
   - Example: `https://yourdomain.com/auth/callback`
   - Example: `https://yourdomain.com/auth/login`

### 3. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Add environment variables when prompted
```

Or use the Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Add environment variables in project settings
4. Deploy!

### 4. Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### 5. Other Platforms

For AWS, Google Cloud, or other platforms:
- Ensure Node.js 18+ is available
- Set environment variables in platform settings
- Run `npm run build` and `npm start`

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore` - secrets won't be committed
- ✅ Service role key should only be used server-side
- ✅ Anon key is safe for client-side use
- ⚠️ Never commit environment variables to Git

## 🧪 Test Your Deployment

After deployment:
1. Visit your production URL
2. Test login with: `sahi0045@hotmail.com` / `Sahi@0045`
3. Check public profile: `/sahi0045`
4. Access dashboard: `/dashboard`

## 📊 Current User

- **Email**: sahi0045@hotmail.com
- **Password**: Sahi@0045
- **Username**: sahi0045
- **Profile URL**: /sahi0045

## 🚀 Next Steps

1. Update profile information in dashboard
2. Add your company links
3. Customize theme and branding
4. Share your profile link with customers
5. Monitor analytics in dashboard

## 🆘 Troubleshooting

**Build fails:**
- Check all environment variables are set
- Verify Supabase credentials are correct

**Auth not working:**
- Verify redirect URLs in Supabase dashboard
- Check environment variables are deployed

**Database errors:**
- Ensure database schema is created (run SQL scripts in Supabase)
- Verify RLS policies are configured

## 📝 Additional Configuration

### Custom Domain
- Add your custom domain in hosting platform settings
- Update Supabase redirect URLs with new domain

### Email Templates
- Customize in Supabase Dashboard → Authentication → Email Templates

### Database Backups
- Enable automatic backups in Supabase Dashboard → Database → Backups
