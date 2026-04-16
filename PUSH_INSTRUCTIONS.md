# How to Push to GitHub

## The Problem
You're getting a 403 error because Git doesn't have permission to push to the repository.

## Solution: Use Personal Access Token

### Step 1: Create a Personal Access Token
1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Linktree Deploy"
4. Select scopes: Check "repo" (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push Using the Token

Run this command in your terminal (replace YOUR_TOKEN with the actual token):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/NivixPe-Siddhartha/linktree.git
git push -u origin main
```

## Alternative: Use SSH (More Secure)

### Step 1: Generate SSH Key (if you don't have one)
```bash
ssh-keygen -t ed25519 -C "sahi0045@hotmail.com"
# Press Enter for all prompts (use default location)
```

### Step 2: Add SSH Key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
```

1. Go to GitHub: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste the key and save

### Step 3: Change Remote to SSH and Push
```bash
git remote set-url origin git@github.com:NivixPe-Siddhartha/linktree.git
git push -u origin main
```

## Quick Fix: Push from GitHub Account Owner

If the repository belongs to a different GitHub account:
1. Make sure you're logged into the correct GitHub account in your browser
2. Use the Personal Access Token method above with a token from that account

## After Successful Push

Once pushed, you can deploy to Vercel:
```bash
npx vercel
```

Or connect the GitHub repository to Vercel/Netlify for automatic deployments.
