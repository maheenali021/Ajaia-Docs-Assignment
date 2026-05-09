# AI-Native Full Stack Developer Assignment Report

---

## 1. Which AI tools did you use?

### Primary AI Tool:
- Claude (Opus 4.7) via Claude Code — used throughout the entire development process

---

### What Claude was used for:

#### 1. Architecture & Design
- Designed database schema (Prisma + PostgreSQL)
- Planned application structure and API routes
- Selected tech stack (Next.js 15, TypeScript, TipTap, Tailwind CSS)

#### 2. Full-Stack Development
- Built backend APIs (CRUD, sharing, file upload)
- Created frontend components (Editor, Sidebar, Dialogs)
- Implemented mock authentication system
- Integrated TipTap rich text editor
- Set up Prisma ORM with Neon database

#### 3. UI/UX Implementation
- Designed UI using Tailwind CSS
- Implemented shadcn/ui components
- Built responsive layouts

#### 4. Feature Implementation
- Document creation, editing, deletion
- Auto-save functionality
- Document sharing with email notifications (Resend integration)
- File upload (.txt, .md)
- Access control and permissions

#### 5. Testing & Documentation
- Wrote automated tests using Jest
- Created README.md
- Wrote ARCHITECTURE.md with design decisions

#### 6. Troubleshooting
- Fixed Windows compatibility issues
- Resolved Tailwind CSS configuration problems
- Debugged TipTap SSR hydration issues

No other AI tools were used.

---

## 2. Where AI materially sped up your work?

### AI (Claude) provided significant time savings:

#### 1. Debugging (Saved ~3–4 hours)
- Fixed Windows/Turbopack issues and Tailwind v4 errors
- Resolved file lock and build issues
- Fixed TipTap SSR hydration problems
- Reduced Stack Overflow dependency

#### 2. Project Setup (Saved ~1–2 hours)
- Fast setup of Next.js, TypeScript, Tailwind, Prisma
- Correct database schema and configuration in first attempt
- Clean environment setup without iteration

#### 3. Backend Development (Saved ~2–3 hours)
- CRUD APIs with validation and error handling
- Access control logic (owner vs shared users)
- Edge cases handled correctly

#### 4. Frontend Development (Saved ~2–3 hours)
- TipTap editor integration with toolbar
- State management and loading/error handling
- UI components setup using shadcn/ui

#### 5. Feature Integration (Saved ~2 hours)
- File upload (.txt/.md parsing)
- Sharing system with proper access flow
- Email/invitation logic

#### 6. Documentation (Saved ~1 hour)
- README and architecture notes generated quickly

#### 7. Testing (Saved ~1 hour)
- Basic automated tests for core flows

**Total Estimated Time Saved: ~10–15 hours**

---

### Key Impact:
- Faster delivery with fewer blockers
- Clean, production-style code
- Better structure and fewer bugs
- Systematic problem-solving instead of trial-and-error

---

## 3. What AI-generated output did you change or reject?

Several AI-generated outputs required modification due to compatibility, framework constraints, and real-world requirements:

### 1. Tailwind CSS Version (Replaced)
- Initial: Tailwind CSS v4 with native bindings
- Issue: Windows incompatibility (lightningcss native binaries)
- Change: Downgraded to Tailwind CSS v3
- Reason: Stable cross-platform development

---

### 2. Webpack Cache Configuration (Removed)
- Initial: Disabled Next.js webpack cache
- Issue: Broke build system and caused missing manifest errors
- Change: Removed custom webpack config
- Reason: Default Next.js config is more stable

---

### 3. Next.js Config (Simplified)
- Initial: Node path-based cache configuration
- Issue: ES module compatibility errors
- Change: Removed custom configuration
- Reason: Avoided module conflicts

---

### 4. TipTap Editor Setup (Modified)
- Initial: Basic configuration
- Issue: SSR hydration warning
- Change: Added `immediatelyRender: false`
- Reason: Fixed React hydration mismatch

---

### 5. Share Feature (Redesigned)
- Initial: Only pre-seeded users
- Issue: Not realistic for production use
- Change: Allow sharing with any email (auto-create user)
- Reason: Improved usability

---

### 6. Share API Logic (Enhanced)
- Initial: Required existing users only
- Issue: Sharing failed for new users
- Change: Auto-create user if not found
- Reason: Real-world sharing behavior

---

### 7. Middleware Configuration (Updated)
- Initial: Old middleware pattern
- Issue: Compatibility with newer Next.js standards
- Change: Updated to latest structure
- Reason: Framework alignment

---

### 8. File System Commands (Removed)
- Initial: Programmatic file deletion commands
- Issue: Windows permission errors
- Change: Manual instructions instead
- Reason: OS limitations

---

### 9. Email Notifications (Added)
- Initial: No email integration
- Issue: Poor sharing UX
- Change: Added Resend email notifications
- Reason: Improved real-world usability

---

### Key Insight:
AI-generated code worked best for standard patterns (CRUD, UI, schema design), but required adjustment for:
- OS-specific issues (Windows compatibility)
- Framework updates (Next.js changes)
- Real-world product behavior (sharing UX expectations)

---

## 4. How did you verify correctness, UX quality, and implementation reliability?

---

### 1. Correctness Verification

#### Database Testing
- Ran Prisma migrations successfully
- Verified seeded users and documents
- Confirmed relationships (users, documents, shares)

#### API Testing
- Tested endpoints using browser and curl
- Verified CRUD operations
- Confirmed sharing flow (user creation + access)

#### Access Control
- Owner permissions verified (create, edit, delete, share)
- Shared user permissions verified (edit only)
- Unauthorized access returns 403 errors

#### Automated Tests
- Jest tests for:
  - Document creation
  - Sharing logic
  - Access control

---

### 2. UX Quality Verification

#### Manual UI Testing
- Sidebar separation (Owned vs Shared)
- Rich text formatting (bold, italic, lists, headings)
- Loading and error states

#### User Flows
- Create → Edit → Save document
- Share document via email
- Upload .txt/.md file

#### Responsive Design
- Tested mobile and desktop layouts
- Verified editor usability on small screens

#### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Focus states implemented

---

### 3. Implementation Reliability

#### Type Safety
- Full TypeScript coverage
- Prevented runtime type errors

#### Input Validation
- Email validation
- File type and size restrictions
- Title length validation

#### Error Handling
- API try/catch with proper HTTP responses
- Frontend error states for user feedback

#### Database Integrity
- Unique constraints for shares
- Cascade deletes
- Prevented duplicate shares

#### Security Basics
- Access control in all API routes
- Prisma parameterized queries (SQL injection protection)
- React default XSS protection

---

### 4. End-to-End Testing

- Created and edited documents successfully
- Shared documents between users
- Verified persistence after refresh
- Tested file upload and formatting

---

### 5. Limitations (Due to Time Scope)

- No load testing
- No real-time collaboration
- Limited browser testing (Chrome only)
- No full accessibility audit (screen readers not tested)

---

### Summary:
Verification was done using a combination of database checks, API testing, manual UI testing, and automated tests to ensure correctness, usability, and reliability within the MVP scope.
