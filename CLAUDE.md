# CLAUDE.md

## Project Overview

Nama Proyek: E-Report Siswa SMK Texmaco

E-Report adalah aplikasi pelaporan siswa berbasis web untuk membantu sekolah mengelola:

* Pelanggaran siswa
* Pembinaan STP2K
* Konseling BK
* Tracking kasus siswa
* Generator surat otomatis
* Notifikasi
* Pelaporan dan analitik

Target pengguna:

* Admin
* Guru BK
* STP2K
* Wali Kelas
* Kesiswaan
* Orang Tua
* Siswa

---

# Tech Stack

## Frontend

* React JS
* Vite
* JavaScript
* React Router DOM
* Tailwind CSS
* Shadcn UI
* React Hook Form
* Zod
* TanStack Table
* TanStack Query

## Backend

* Firebase Authentication
* Firestore
* Firebase Storage
* Firebase Cloud Functions

## Deployment

* Vercel
* Firebase Hosting

---

# Development Principles

1. Mobile First
2. Responsive Design
3. Accessibility Friendly
4. RBAC First
5. Reusable Components
6. Clean Architecture
7. Performance Oriented
8. Maintainable Code

---

# Coding Standards

## General

* Use JavaScript (ES6+)
* Avoid code duplication
* Use async/await
* Prefer functional programming
* Prefer composition over inheritance
* Use named exports when possible
* Keep components small and reusable

---

## Naming

### Components

PascalCase

Examples:

* StudentTable.jsx
* ViolationForm.jsx
* DashboardCard.jsx

### Hooks

useSomething

Examples:

* useStudents.js
* useViolations.js
* useAuth.js

### Utility

camelCase

Examples:

* formatDate.js
* generateLetterNumber.js

---

# Folder Structure

src/

assets/

components/
ui/
shared/
layout/

pages/
auth/
dashboard/
students/
violations/
coaching/
cases/
letters/
reports/
settings/

features/
students/
violations/
coaching/
cases/
letters/
reports/

hooks/

services/

lib/
firebase/
utils/

schemas/

constants/

routes/

contexts/

providers/

---

# Authentication Rules

Use Firebase Authentication.

Every authenticated user must have:

* uid
* role

Available roles:

* admin
* guru_bk
* stp2k
* wali_kelas
* kesiswaan
* orang_tua
* siswa

Never trust role validation from frontend.

Always validate role in:

* Firestore Rules
* Cloud Functions

---

# Firestore Rules

Always:

* Validate user permissions
* Validate ownership
* Validate document existence

Avoid:

* Deep nested collections
* Unnecessary duplicate data

Prefer:

* Flat collections
* Query-friendly structure

---

# UI Design Rules

Design Style:

* Modern Academic Dashboard
* Clean
* Professional
* Minimalist

Use:

* Shadcn UI
* Tailwind CSS

Required:

* Dark Mode
* Light Mode

Color Palette:

Primary:
#0F766E

Primary Dark:
#115E59

Accent:
#14B8A6

Background:
#F8FAFC

Dark Background:
#0F172A

Danger:
#DC2626

Warning:
#F59E0B

Success:
#16A34A

---

# Feature Development Workflow

When building a feature:

1. Create schema validation
2. Create service layer
3. Create custom hooks
4. Create UI components
5. Create page implementation
6. Add loading state
7. Add empty state
8. Add error state
9. Add RBAC validation

---

# Form Standards

Every form must:

* Use React Hook Form
* Use Zod validation
* Show loading state
* Show success toast
* Show error toast

---

# Table Standards

Every table must support:

* Search
* Pagination
* Sorting
* Empty state
* Loading state

---

# Error Handling

Never show raw Firebase errors.

Create user-friendly error messages.

Log technical errors separately.

---

# Performance Rules

Avoid unnecessary re-renders.

Use:

* React.memo when needed
* Lazy Loading
* Dynamic Import
* TanStack Query caching

Optimize:

* Firestore queries
* Component rendering
* Network requests

---

# Security Rules

Never expose:

* Firebase Admin SDK credentials
* Service Account Keys
* Environment Secrets

Always use:

* Environment Variables
* Firestore Security Rules
* Cloud Functions validation

---

# Definition of Done

A feature is complete when:

* ESLint passes
* Build passes
* Responsive works
* RBAC works
* Loading state exists
* Error state exists
* Empty state exists
* Dark mode works
* No console errors

---

# Important Context

This project follows:

* PRD.md
* Wireframe.md

located in the project root.

Always use those documents as the source of truth before implementing any feature.

If there is a conflict between PRD and implementation:

1. Follow PRD.
2. Add TODO comments.
3. Document assumptions clearly.

Do not invent business rules without evidence from the PRD.
