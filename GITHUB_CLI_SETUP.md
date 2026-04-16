# GitHub CLI Authentication Guide

## Step 1: Create a Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Settings:
   - **Note**: "GitHub CLI - Linktree"
   - **Expiration**: 90 days (or your preference)
   - **Scopes**: Check these boxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages)
     - ✅ `delete:packages` (Delete packages)
     - ✅ `admin:org` (if pushing to organization repo)
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)

## Step 2: Authenticate with GitHub CLI

Run this command and paste your token when prompted:

```bash
gh auth login
```

Select:
- Where do you use GitHub? → **GitHub.com**
- Protocol? → **HTTPS**
- Authenticate Git? → **Yes**
- How to authenticate? → **Paste an authentication token**
- Then paste your token

## Step 3: Push to GitHub

After authentication, run:

```bash
git push -u origin main
```

## Alternative: One-Command Authentication

If you have your token ready, run:

```bash
echo "YOUR_TOKEN_HERE" | gh auth login --with-token
```

Then push:

```bash
git push -u origin main
```

## Verify Authentication

Check if you're logged in:

```bash
gh auth status
```

## After Successful Push

Your code will be on GitHub at:
https://github.com/NivixPe-Siddhartha/linktree

Then you can deploy to Vercel:
```bash
npx vercel
```
