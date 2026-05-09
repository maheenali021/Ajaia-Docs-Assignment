# Collaborative Document Editor

A lightweight Google Docs-inspired collaborative document editor built with Next.js 15, TypeScript, and Prisma. This project demonstrates clean architecture, realistic engineering decisions, and production-ready patterns within a focused MVP scope.

## Features

- ✅ Create and manage documents
- ✅ Rich text editing (bold, italic, underline, headings, bullet lists)
- ✅ Rename documents with auto-save
- ✅ Upload .txt or .md files
- ✅ Share documents with other users
- ✅ Owned vs Shared documents sidebar
- ✅ Persistent storage with Prisma + Supabase
- ✅ Input validation and error handling
- ✅ Automated tests
- ✅ Mobile responsive design

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM + Supabase (PostgreSQL)
- **Editor**: TipTap (rich text editing)
- **UI**: Tailwind CSS + shadcn/ui
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Update `.env.local` with your database connection:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   For Supabase:
   - Go to your Supabase project settings
   - Navigate to Database → Connection String
   - Copy the connection string and update `.env.local`

3. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database**
   ```bash
   npx prisma db seed
   ```

   This creates two test users:
   - `maheen@example.com` (default user)
   - `reviewer@example.com`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing Users

The application uses mocked authentication with two seeded users:

- **Maheen** (`maheen@example.com`) - Default user
- **Reviewer** (`reviewer@example.com`)

To switch users, add `?user=reviewer@example.com` to any URL:
```
http://localhost:3000?user=reviewer@example.com
```

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
test/
├── app/
│   ├── api/documents/          # API routes for CRUD operations
│   ├── documents/[id]/         # Document editor page
│   ├── layout.tsx              # Root layout with sidebar
│   └── page.tsx                # Home page
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── sidebar.tsx             # Navigation sidebar
│   ├── editor.tsx              # TipTap rich text editor
│   ├── share-dialog.tsx        # Share document modal
│   └── upload-dialog.tsx       # File upload modal
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # Mock authentication
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
└── __tests__/
    └── documents.test.ts       # API route tests
```

## Key Features

### Document Management
- Create new documents with a single click
- Documents auto-save as you type (1-second debounce)
- Rename documents inline
- Delete documents (owner only)

### Rich Text Editing
- TipTap editor with toolbar
- Supports: Bold, Italic, Underline, Headings (H1, H2), Bullet Lists
- Content stored as JSON in the database

### File Upload
- Import .txt or .md files
- Maximum file size: 5MB
- Content is parsed and inserted into the editor

### Sharing
- Share documents with other users by email
- Shared users can view and edit documents
- Only the owner can share or delete documents
- Revoke access at any time

## API Routes

- `GET /api/documents` - List owned and shared documents
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document by ID
- `PATCH /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document
- `POST /api/documents/[id]/share` - Share document
- `DELETE /api/documents/[id]/share` - Revoke share
- `POST /api/documents/[id]/upload` - Upload file

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Vercel**
   - Import your repository at [vercel.com](https://vercel.com)
   - Add environment variable: `DATABASE_URL`
   - Deploy

3. **Seed production database**
   ```bash
   DATABASE_URL="your-production-url" npx prisma db seed
   ```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions and rationale.

## License

MIT
