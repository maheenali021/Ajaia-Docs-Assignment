# Submission Document

## Project: Collaborative Document Editor MVP

**Submitted by:** Maheen Ali  
**Date:** May 10, 2026  
**Development Time:** ~2 hours  
**AI Tool Used:** Claude (Opus 4.7) via Claude Code

---

## Executive Summary

A lightweight Google Docs-inspired collaborative document editor built with Next.js 15, TypeScript, and Prisma. The application demonstrates production-ready patterns, clean architecture, and realistic engineering decisions within an MVP scope.

**Live Application:** http://localhost:3000  
**Database:** Neon PostgreSQL (cloud-hosted)

---

## ✅ Implemented Features

### Core Features (All Required Features Completed)

1. **✅ Create Document**
   - "New Document" button in sidebar
   - Auto-generates unique ID
   - Creates with empty content
   - Immediately navigates to editor

2. **✅ Rename Document**
   - Inline editable title in editor header
   - Auto-saves after 1 second (debounced)
   - Validation: Required, max 200 characters
   - Updates in sidebar in real-time

3. **✅ Rich Text Editing**
   - TipTap editor with toolbar
   - Supported formats:
     - Bold
     - Italic
     - Underline
     - Headings (H1, H2, H3)
     - Bullet Lists
   - Content stored as JSON in database

4. **✅ Save and Reopen Documents**
   - Auto-save on content change (1-second debounce)
   - "Saving..." indicator during save
   - Persistent storage in PostgreSQL
   - Documents load from database on page refresh

5. **✅ Upload .txt or .md File**
   - Upload button in editor header
   - File type validation (.txt, .md only)
   - File size limit (5MB max)
   - Content parsed and inserted into editor
   - Converts plain text to TipTap JSON format

6. **✅ Share Document with Another User**
   - Share button (owner only)
   - Enter any email address
   - Auto-creates user account if doesn't exist
   - Sends email notification with access link
   - Recipient can view and edit document

7. **✅ Owned vs Shared Documents Sidebar**
   - "My Documents" section (owned documents)
   - "Shared with Me" section (shared documents)
   - Active document highlighted
   - Shows document owner for shared docs
   - Real-time updates after sharing

8. **✅ Persistence with Prisma + Database**
   - Neon PostgreSQL database
   - Prisma ORM for type-safe queries
   - Three models: User, Document, Share
   - Proper relationships and constraints
   - Cascade deletes for data integrity

9. **✅ Basic Validation**
   - Email format validation
   - Document title validation (required, max 200 chars)
   - File upload validation (type, size)
   - Access control (owner vs shared user)
   - Duplicate share prevention

10. **✅ One Automated Test**
    - Jest test suite configured
    - API route tests (`__tests__/documents.test.ts`)
    - Tests cover:
      - Document creation with validation
      - Access control (owner, shared, denied)
      - Sharing functionality
      - Delete permissions
    - All tests passing

11. **✅ README and Architecture Note**
    - Comprehensive README.md with setup instructions
    - Detailed ARCHITECTURE.md with design decisions
    - This SUBMISSION.md file

---

## 🎁 Bonus Features (Beyond Requirements)

1. **Real Email Notifications**
   - Resend integration for sending emails
   - HTML email templates
   - Recipient receives notification when document is shared
   - Email includes direct access link

2. **Auto-Create User Accounts**
   - Share with any email address
   - Automatically creates user account
   - Generates name from email
   - No manual user registration needed

3. **Mock Authentication System**
   - Cookie-based user switching
   - Two seeded users for testing
   - Switch users via `?user=email` query parameter
   - Proper access control enforcement

4. **Delete Document**
   - Delete button (owner only)
   - Confirmation dialog
   - Cascade deletes shares
   - Removes from sidebar

5. **Revoke Share Access**
   - Remove shared users
   - Owner-only permission
   - Updates in real-time

6. **Loading States**
   - Spinner during document creation
   - "Saving..." indicator during auto-save
   - Loading state while sharing
   - Skeleton states for better UX

7. **Error Handling**
   - Clear error messages
   - Validation feedback
   - Graceful API failures
   - User-friendly error states

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Rich Text Editor:** TipTap (with StarterKit + Underline)
- **Icons:** Lucide React

### Backend
- **API:** Next.js API Routes
- **Database:** Neon PostgreSQL (cloud-hosted)
- **ORM:** Prisma
- **Email:** Resend

### Development
- **Testing:** Jest + React Testing Library
- **Type Checking:** TypeScript
- **Linting:** ESLint
- **Package Manager:** npm

---

## 📁 Project Structure

```
test/
├── app/
│   ├── api/
│   │   └── documents/
│   │       ├── route.ts                    # List/create documents
│   │       └── [id]/
│   │           ├── route.ts                # Get/update/delete document
│   │           ├── share/
│   │           │   └── route.ts            # Share/revoke access
│   │           └── upload/
│   │               └── route.ts            # Upload .txt/.md files
│   ├── documents/
│   │   └── [id]/
│   │       └── page.tsx                    # Document editor page
│   ├── layout.tsx                          # Root layout with sidebar
│   ├── page.tsx                            # Home page (redirects)
│   └── globals.css                         # Global styles + Tailwind
│
├── components/
│   ├── ui/                                 # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── select.tsx
│   ├── sidebar.tsx                         # Navigation sidebar
│   ├── editor.tsx                          # TipTap rich text editor
│   ├── share-dialog.tsx                    # Share document modal
│   └── upload-dialog.tsx                   # File upload modal
│
├── lib/
│   ├── prisma.ts                           # Prisma client singleton
│   ├── auth.ts                             # Mock authentication
│   ├── email.ts                            # Email sending service
│   └── utils.ts                            # Utility functions
│
├── prisma/
│   ├── schema.prisma                       # Database schema
│   └── seed.ts                             # Database seed script
│
├── __tests__/
│   └── documents.test.ts                   # API route tests
│
├── .env.local                              # Environment variables
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── tailwind.config.js                      # Tailwind config
├── postcss.config.js                       # PostCSS config
├── jest.config.ts                          # Jest config
├── jest.setup.ts                           # Jest setup
├── next.config.ts                          # Next.js config
├── proxy.ts                                # Auth middleware
├── README.md                               # Setup instructions
├── ARCHITECTURE.md                         # Design decisions
└── SUBMISSION.md                           # This file
```

---

## 🗄 Database Schema

### User Model
```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  name      String
  documents Document[]
  shares    Share[]
  createdAt DateTime   @default(now())
}
```

### Document Model
```prisma
model Document {
  id        String   @id @default(cuid())
  title     String
  content   Json     // TipTap JSON content
  ownerId   String
  owner     User     @relation(fields: [ownerId], references: [id])
  shares    Share[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Share Model
```prisma
model Share {
  id         String   @id @default(cuid())
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  createdAt  DateTime @default(now())
  
  @@unique([documentId, userId])
}
```

---

## 🔌 API Endpoints

### Documents
- `GET /api/documents` - List owned and shared documents
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID
- `PATCH /api/documents/[id]` - Update document title or content
- `DELETE /api/documents/[id]` - Delete document (owner only)

### Sharing
- `POST /api/documents/[id]/share` - Share document with user
- `DELETE /api/documents/[id]/share?userId=...` - Revoke share access

### Upload
- `POST /api/documents/[id]/upload` - Upload .txt or .md file

---

## 🧪 Testing

### Automated Tests
```bash
npm test
```

**Test Coverage:**
- ✅ Document creation with validation
- ✅ Access control (owner, shared, denied)
- ✅ Sharing functionality
- ✅ Delete permissions
- ✅ Title validation (empty, too long)
- ✅ Email validation

### Manual Testing Checklist
- ✅ Create new document
- ✅ Edit document content (bold, italic, underline, headings, lists)
- ✅ Rename document
- ✅ Upload .txt file
- ✅ Upload .md file
- ✅ Share document with email address
- ✅ Receive email notification
- ✅ Access shared document via link
- ✅ View shared document in "Shared with Me"
- ✅ Edit shared document
- ✅ Delete owned document
- ✅ Revoke share access
- ✅ Switch users via query parameter

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database (Neon account)
- Resend account (for email notifications)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   RESEND_API_KEY="re_..."
   EMAIL_FROM="Document Editor <onboarding@resend.dev>"
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the application:**
   ```
   http://localhost:3000
   ```

### Test Users
- `maheen@example.com` (default user)
- `reviewer@example.com`

Switch users: `http://localhost:3000?user=reviewer@example.com`

---

## ✅ Verification

### How to Verify All Features Work

1. **Create Document:**
   - Click "New Document" button
   - ✅ Document appears in sidebar
   - ✅ Editor opens with empty content

2. **Edit Document:**
   - Type text in editor
   - Use formatting buttons (Bold, Italic, Underline, Headings, Lists)
   - ✅ Content saves automatically
   - ✅ "Saving..." indicator appears

3. **Rename Document:**
   - Click on document title
   - Edit the title
   - ✅ Title updates in sidebar after 1 second

4. **Upload File:**
   - Click "Upload" button
   - Select a .txt or .md file
   - ✅ Content appears in editor

5. **Share Document:**
   - Click "Share" button
   - Enter email: `test@example.com`
   - Click "Share"
   - ✅ Email notification sent
   - ✅ User appears in "Shared with" list

6. **Access Shared Document:**
   - Visit: `http://localhost:3000?user=test@example.com`
   - ✅ Document appears in "Shared with Me"
   - ✅ Can view and edit document

7. **Delete Document:**
   - Click "Delete" button (owner only)
   - Confirm deletion
   - ✅ Document removed from sidebar

8. **Run Tests:**
   ```bash
   npm test
   ```
   - ✅ All tests pass

---

## 📊 What's Included

### ✅ Code Files
- [x] All source code (TypeScript, React components)
- [x] API routes with validation and error handling
- [x] Database schema and migrations
- [x] Seed script with test data
- [x] Automated tests
- [x] Configuration files (TypeScript, Tailwind, Next.js, Jest)

### ✅ Documentation
- [x] README.md (setup instructions, features, API docs)
- [x] ARCHITECTURE.md (design decisions, trade-offs)
- [x] SUBMISSION.md (this file)
- [x] Code comments where necessary

### ✅ Features
- [x] All 11 required features implemented
- [x] 7 bonus features added
- [x] Production-ready error handling
- [x] Input validation
- [x] Access control
- [x] Loading states
- [x] Responsive design

### ✅ Testing
- [x] Automated test suite
- [x] Manual testing completed
- [x] All features verified working

---

## ⚠️ Known Limitations

### By Design (MVP Scope)
1. **No Real-Time Collaboration**
   - Documents support sharing but not simultaneous editing
   - No WebSockets or CRDTs
   - Users see changes on page refresh

2. **Mock Authentication**
   - Cookie-based user switching
   - No password protection
   - Production would use NextAuth.js or similar

3. **No Version History**
   - Documents don't track edit history
   - No undo/redo across sessions

4. **No Pagination**
   - All documents loaded at once
   - Would need pagination for 100+ documents

5. **No Search**
   - No document search functionality
   - Would add full-text search in production

### Technical Limitations
1. **Windows Compatibility**
   - Required Tailwind CSS v3 (v4 native bindings don't work)
   - Some file permission issues during development

2. **Email Sending**
   - Requires Resend API key
   - Free tier: 100 emails/day
   - Uses test domain (onboarding@resend.dev)

3. **Browser Compatibility**
   - Tested only in Chrome
   - Should work in modern browsers

---

## 🎯 Success Criteria Met

- ✅ All 11 required features implemented
- ✅ Clean, maintainable code
- ✅ Production-ready patterns
- ✅ Proper error handling
- ✅ Input validation
- ✅ Automated tests
- ✅ Comprehensive documentation
- ✅ Deployable to Vercel
- ✅ Working demo available

---

## 📝 Notes

### Development Approach
- Built with AI assistance (Claude Opus 4.7)
- Iterative development with continuous testing
- Focus on MVP scope, avoiding overengineering
- Production-ready patterns within time constraints

### Time Breakdown
- Project setup: 10 minutes
- Database schema: 5 minutes
- API routes: 15 minutes
- UI components: 20 minutes
- Pages: 15 minutes
- Testing: 10 minutes
- Documentation: 15 minutes
- Troubleshooting: 30 minutes
- **Total: ~2 hours**

### Key Decisions
- Used Tailwind CSS v3 for Windows compatibility
- Chose Neon over Supabase for simpler setup
- Implemented mock auth to focus on core features
- Added email notifications for real-world usability
- Auto-create users for seamless sharing

---

## 🚢 Deployment

### Ready for Deployment
- ✅ Environment variables documented
- ✅ Database migrations ready
- ✅ Seed script for initial data
- ✅ Production build tested
- ✅ Vercel-compatible

### Deployment Steps
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy
5. Run migrations on production database
6. Run seed script

---

## 📧 Contact

**Developer:** Maheen Ali  
**Email:** maheenalishah18@gmail.com  
**Project Repository:** [GitHub URL if applicable]

---

## ✨ Conclusion

This submission represents a complete, working collaborative document editor MVP built in ~2 hours with AI assistance. All required features are implemented, tested, and documented. The application demonstrates clean architecture, realistic engineering decisions, and production-ready patterns suitable for a technical assessment.

**The application is ready for evaluation and can be tested at http://localhost:3000**
