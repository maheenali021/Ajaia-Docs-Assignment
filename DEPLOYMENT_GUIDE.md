# GitHub Deployment Guide

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `collaborative-document-editor`
3. Description: `Lightweight Google Docs-inspired collaborative document editor built with Next.js, TypeScript, and Prisma`
4. Visibility: **Public** (for assessment)
5. **Don't** check "Initialize with README"
6. Click "Create repository"

## Step 2: Push Your Code

Open your terminal in the project folder and run these commands:

```bash
# Navigate to your project
cd C:\Users\Dell\Desktop\maheen\test

# Initialize git repository
git init

# Add all files (your .gitignore will protect sensitive files)
git add .

# Create your first commit
git commit -m "Initial commit: Collaborative document editor MVP

- Implemented all 11 required features
- Added email notifications for sharing
- Complete documentation (README, ARCHITECTURE, SUBMISSION)
- Automated tests with Jest
- Production-ready code"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/collaborative-document-editor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify on GitHub

After pushing, check your GitHub repository:
- ✅ All code files should be there
- ✅ README.md, ARCHITECTURE.md, SUBMISSION.md visible
- ❌ .env.local should NOT be visible
- ❌ VIDEO_SCRIPT.md should NOT be visible
- ✅ .env.example should be visible

## Step 4: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Select `collaborative-document-editor` repository
5. Configure environment variables:
   - Click "Environment Variables"
   - Add each variable:

```
DATABASE_URL
postgresql://neondb_owner:npg_hBMy7oNb3zxQ@ep-round-glitter-aqd9inmj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

RESEND_API_KEY
re_SzcK9XGo_3BcAJt1vYchXskVcfko7bhHt

EMAIL_FROM
Document Editor <onboarding@resend.dev>

NEXT_PUBLIC_APP_URL
(Leave empty for now, will update after deployment)
```

6. Click "Deploy"
7. Wait for deployment to complete (~2-3 minutes)
8. Copy your production URL (e.g., `https://collaborative-document-editor.vercel.app`)
9. Go back to Settings → Environment Variables
10. Update `NEXT_PUBLIC_APP_URL` with your production URL
11. Redeploy (Deployments → click "..." → Redeploy)

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts
# Add environment variables when prompted
```

## Step 5: Test Production Deployment

1. Visit your Vercel URL
2. Test all features:
   - Create document
   - Edit with rich text
   - Share document
   - Check email notification
   - Upload file
   - Delete document

## Troubleshooting

### If .env.local was accidentally pushed:
```bash
# Remove from git history
git rm --cached .env.local
git commit -m "Remove .env.local from repository"
git push
```

### If deployment fails:
- Check Vercel build logs
- Verify all environment variables are set
- Ensure DATABASE_URL is correct
- Check that Prisma migrations ran

### If emails don't work in production:
- Verify RESEND_API_KEY is set in Vercel
- Check Resend dashboard for delivery status
- Ensure EMAIL_FROM is correct

## What Gets Deployed

✅ **Included:**
- All source code
- README.md, ARCHITECTURE.md, SUBMISSION.md
- .env.example (template)
- package.json and dependencies
- Prisma schema

❌ **Excluded (via .gitignore):**
- .env.local (sensitive credentials)
- VIDEO_SCRIPT.md (internal file)
- node_modules (rebuilt on Vercel)
- .next (rebuilt on Vercel)

## Post-Deployment Checklist

- [ ] GitHub repository is public
- [ ] All documentation files visible on GitHub
- [ ] .env.local NOT visible on GitHub
- [ ] Vercel deployment successful
- [ ] All environment variables configured in Vercel
- [ ] Production app loads correctly
- [ ] Can create and edit documents
- [ ] Email notifications work
- [ ] Share functionality works
- [ ] Database persistence works

## Your Deployment URLs

- **GitHub Repository:** https://github.com/YOUR_USERNAME/collaborative-document-editor
- **Production App:** https://collaborative-document-editor.vercel.app (or your custom URL)

---

**Ready to deploy!** Start with Step 1 above.
