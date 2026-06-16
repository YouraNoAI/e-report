# 📋 E-REPORT SMK TEXMACO SUBANG

## FINAL COMPREHENSIVE REQUIREMENTS DOCUMENT
### Single Source of Truth for Implementation

**Version:** 1.0 (Final)
**Date:** [Current Date]
**Status:** ✅ Approved for Development

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Final Functional Requirements (Modules A–J)](#2-final-functional-requirements-modules-a-j)
3. [Final RBAC Matrix](#3-final-rbac-matrix)
4. [Final Database Design](#4-final-database-design)
5. [Final UI/UX Decisions](#5-final-uiux-decisions)
6. [Final Security Requirements](#6-final-security-requirements)
7. [Final Testing Strategy](#7-final-testing-strategy)
8. [Final Deployment Plan](#8-final-deployment-plan)
9. [Final AI Feature Plan](#9-final-ai-feature-plan)
10. [State Machine Specifications](#10-state-machine-specifications)
11. [Point System & Thresholds](#11-point-system--thresholds)
12. [PDP Law Compliance Checklist](#12-pdp-law-compliance-checklist)
13. [Glossary & Definitions](#13-glossary--definitions)
14. [Appendices](#14-appendices)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview

E-Report SMK Texmaco Subang is a web-based violation reporting and case management system designed to digitize the school's manual discipline tracking process. The system replaces paper-based violation records with a digital workflow encompassing violation reporting, point accumulation, case management, counseling tracking, automated letter generation (SP1/SP2/SP3), stakeholder notifications, and comprehensive reporting.

### 1.2 Core Business Objectives

| Objective | Success Metric |
|-----------|---------------|
| Replace paper-based violation tracking | 100% of violations recorded digitally |
| Reduce administrative burden on teachers/BK staff | 50% reduction in paperwork time |
| Enable parent visibility into student behavior | 80% parent account activation rate |
| Automate letter generation (SP1/SP2/SP3) | Letters generated in <10 seconds |
| Ensure data privacy compliance (PDP Law) | Zero compliance violations |

### 1.3 Scope Summary

| Scope Category | Details |
|---------------|---------|
| **MVP (P0 + P1)** | ~33 items: Auth, Student Management, Violations, Points, Cases, Letters, Dashboard, Notifications, PDP Compliance, Basic Quality |
| **Phase 2 (P2)** | ~75 items: WhatsApp, MFA, Full-text Search, Appeal Mechanism, Advanced Reporting, Offline Support |
| **Development Timeline** | 6–8 weeks to MVP |
| **Pre-Development Phase** | 1 week (Sprint 0) with parallel tracks |
| **Technology Stack** | React + Vite + TailwindCSS + Firebase (Firestore, Auth, Cloud Functions, Storage, Hosting) |

### 1.4 Prioritization Framework

| Tier | Definition | Count | Examples |
|------|------------|-------|----------|
| **P0 – SHOWSTOPPER** | System cannot function or is illegal without it | 8 | Data model, Security Rules, PDP Law compliance, State machine |
| **P1 – MVP MUST-HAVE** | Core workflow breaks without it | ~25 | Violation input, Point calculation, Letter generation, Basic dashboard |
| **P2 – PHASE 2** | Valuable but not launch-blocking | ~75 | MFA, Algolia, WhatsApp, Appeal mechanism |

---

## 2. FINAL FUNCTIONAL REQUIREMENTS (MODULES A–J)

### 2.1 Module A: Authentication & User Management

#### P0 Requirements (Blockers)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| AUTH-01 | Firebase Auth with email/password authentication | P0 | Standard Firebase Auth setup |
| AUTH-02 | Role-based access control via Firebase Custom Claims | P0 | Claims set ONLY via Cloud Function triggered by user document changes |
| AUTH-03 | Dual-role user handling (e.g., teacher who is both Wali Kelas and BK) | P0 | `roles[]` array field; primary role selected at login; ability to switch roles without re-login |
| AUTH-04 | Password policy enforcement (minimum 8 characters) | P0 | Firebase Auth built-in toggle – enabled Day 1 |

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| AUTH-05 | Password recovery / "Forgot Password" flow | P1 | Firebase Auth built-in email flow |
| AUTH-06 | User profile management (change password, update contact info) | P1 | Basic profile page |
| AUTH-07 | Admin user management (create, disable, edit users) | P1 | Admin panel for user CRUD |
| AUTH-08 | 60-minute idle session timeout | P1 | Frontend detection + Firebase token expiry |
| AUTH-09 | Role-based UI rendering (menus, buttons hidden per role) | P1 | Frontend checks custom claims |
| AUTH-10 | First-time login flow for students/parents (forced password change) | P1 | Auto-generated accounts from student data |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| AUTH-11 | Multi-factor authentication (MFA) | P2 | For Admin, BK, Kesiswaan roles |
| AUTH-12 | Session revocation ("log out everywhere") | P2 | Firebase Admin SDK token revocation |
| AUTH-13 | OAuth/SSO integration | P2 | If school adopts Google Workspace |
| AUTH-14 | Rate limiting on login attempts | P2 | Firebase Auth already has basic protection |

---

### 2.2 Module B: Student Data Management

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SISWA-01 | CSV import of student data (bulk) | P1 | Cloud Function parses CSV, validates, creates user accounts + student records |
| SISWA-02 | Individual student creation/edit | P1 | For adding new students mid-semester |
| SISWA-03 | Student list view with search | P1 | Firestore composite index for name search; TanStack Table with client-side filtering |
| SISWA-04 | Student detail view with violation history | P1 | Drill-down from list; shows all violations, points, case status |
| SISWA-05 | Student status management (active, graduated, transferred, dropped) | P1 | Status affects case lifecycle |
| SISWA-06 | Student-to-class and student-to-jurusan assignment | P1 | Part of import/creation |
| SISWA-07 | Student-to-Wali Kelas assignment | P1 | Each student linked to their homeroom teacher |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SISWA-08 | Student profile photo upload | P2 | |
| SISWA-09 | Student academic information dashboard | P2 | |
| SISWA-10 | API integration with existing school system | P2 | |

---

### 2.3 Module C: Violation Management

#### P0 Requirements (Blockers)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| VIOL-01 | Violation input by authorized roles (Wali Kelas, Guru BK, STP2K, Admin) | P0 | CEO decision: Wali Kelas CAN input violations for their class only |
| VIOL-02 | Violation state machine (Draft → Submitted → Verified → Point Added / Rejected) | P0 | Clear status transitions |
| VIOL-03 | Violation categories (ringan/sedang/berat) with pre-assigned points | P0 | Pre-seeded data in Firestore |

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| VIOL-04 | Draft saving for in-progress violation input | P1 | Persist incomplete submissions |
| VIOL-05 | Evidence upload (optional, photo only, max 5MB) | P1 | Validated by magic bytes, not file extension |
| VIOL-06 | Delete violation with confirmation + point rollback | P1 | Only within configurable time window |
| VIOL-07 | Duplicate detection (same student + same category + same day) | P1 | Warning before submission, not a hard block |
| VIOL-08 | Violation history view (per student, per class, per date range) | P1 | Filterable list |
| VIOL-09 | Coaching notes field (visible to BK/STP2K/Admin only) | P1 | Added during verification step |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| VIOL-10 | Student appeal/dispute mechanism | P2 | |
| VIOL-11 | Multiple evidence files per violation | P2 | |
| VIOL-12 | Bulk violation creation (multiple students, same category) | P2 | |
| VIOL-13 | Violation category management UI | P2 | Admin configurable |

---

### 2.4 Module D: Point System

#### P0 Requirements (Blockers)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| POIN-01 | Automatic point calculation upon violation verification | P0 | Points added when violation reaches "Verified" state |
| POIN-02 | Semester-based point accumulation | P0 | Points reset each semester (CEO decision) |
| POIN-03 | Configurable point thresholds (SP1/SP2/SP3) | P0 | Stored in `config/settings` document |

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| POIN-04 | Real-time point display on student profile | P1 | Current semester total |
| POIN-05 | Point history by semester | P1 | Historical record for reporting |
| POIN-06 | Threshold-based alerts (visual indicator when approaching limit) | P1 | Dashboard warning when >70% of threshold |
| POIN-07 | Read-only view for students and parents | P1 | Self/children point display |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| POIN-08 | Manual point adjustment by Admin (with audit reason) | P2 | |
| POIN-09 | Point deduction for positive behavior (merit system) | P2 | |
| POIN-10 | Point projection/warning system | P2 | |

---

### 2.5 Module E: Coaching & Counseling

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| COACH-01 | Initial coaching documentation (by STP2K after violation verification) | P1 | Brief notes field |
| COACH-02 | Counseling session scheduling (by BK) | P1 | Date/time tracking |
| COACH-03 | Counseling session notes (by BK) | P1 | Structured notes template |
| COACH-04 | Session outcome tracking | P1 | Resolved / Ongoing / Escalated |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| COACH-05 | Counseling appointment reminders | P2 | |
| COACH-06 | Parent counseling involvement tracking | P2 | |
| COACH-07 | Counseling effectiveness metrics | P2 | |

---

### 2.6 Module F: Case Management

#### P0 Requirements (Blockers)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| KASUS-01 | One active case per student per academic year | P0 | CEO decision. Continuous case container for all violations |
| KASUS-02 | Case state machine (Active → Under Coaching → Escalated to BK → Escalated to Kesiswaan → Resolved → Closed) | P0 | Clear status transitions |
| KASUS-03 | Case timeline with audit trail | P0 | Every status change logged with actor, timestamp, reason |

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| KASUS-04 | Case creation auto-triggered by first verified violation | P1 | No manual case creation needed |
| KASUS-05 | Case detail view showing all related violations, coaching, letters | P1 | Comprehensive case file |
| KASUS-06 | Case status updates with required reason/notes | P1 | Cannot change status without explanation |
| KASUS-07 | Case closure (reachable from any state) | P1 | Requires Admin or BK authorization |
| KASUS-08 | Case reassignment (if primary handler changes) | P1 | Admin only |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| KASUS-09 | Case reopening by Admin | P2 | |
| KASUS-10 | Case priority/escalation matrix | P2 | |
| KASUS-11 | Case SLA monitoring (time in each state) | P2 | |

---

### 2.7 Module G: Letter Generation (SP1/SP2/SP3)

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SURAT-01 | SP1 auto-generation at configurable threshold (default: 25 points) | P1 | System-generated, no approval needed |
| SURAT-02 | SP2 auto-generation at configurable threshold (default: 50 points) | P1 | System-generated, no approval needed |
| SURAT-03 | SP3 generation with Kesiswaan approval workflow | P1 | Requires authorized user to approve before sending |
| SURAT-04 | Letter preview before finalize | P1 | Show rendered letter for confirmation |
| SURAT-05 | PDF download of generated letter | P1 | Server-side PDF generation via Cloud Function |
| SURAT-06 | Static letter templates with variable substitution | P1 | HTML templates stored in Firestore; variables: `{{student_name}}`, `{{violation_detail}}`, `{{points}}`, `{{date}}` |
| SURAT-07 | Letter state machine (Generated → Approved (if SP3) → Sent → Acknowledged / Unacknowledged) | P1 | Status tracking |
| SURAT-08 | Letter archive with search | P1 | Historical letter records |
| SURAT-09 | Letter number auto-generation | P1 | Sequential numbering per school year |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SURAT-10 | Dynamic template editor with school logo | P2 | |
| SURAT-11 | Digital signature integration | P2 | |
| SURAT-12 | Batch letter generation | P2 | |
| SURAT-13 | Email delivery of letters to parents | P2 | MVP: PDF download only |

---

### 2.8 Module H: Notifications

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| NOTIF-01 | In-app notification bell with unread count | P1 | Real-time via Firestore listener |
| NOTIF-02 | Email notification via SendGrid | P1 | For parents without active in-app sessions |
| NOTIF-03 | Notification triggers: new violation, case status change, new letter, coaching scheduled | P1 | Defined trigger events |
| NOTIF-04 | Notification history view | P1 | Read/unread filter |
| NOTIF-05 | Mark as read functionality | P1 | Single and bulk |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| NOTIF-06 | WhatsApp notification integration | P2 | API costs + compliance complexity |
| NOTIF-07 | Notification preferences (opt-in/out per channel) | P2 | |
| NOTIF-08 | Push notifications (Firebase Cloud Messaging) | P2 | |
| NOTIF-09 | Read receipts and delivery confirmation | P2 | |
| NOTIF-10 | Scheduled/digest notifications | P2 | |

---

### 2.9 Module I: Dashboard & Reporting

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| DASH-01 | Role-based dashboard KPIs | P1 | Different views per role |
| DASH-02 | Admin dashboard: total violations today, active cases, top categories, top students by points | P1 | Pre-computed aggregates via scheduled Cloud Function |
| DASH-03 | BK dashboard: active cases assigned, pending coaching sessions, case distribution | P1 | |
| DASH-04 | Wali Kelas dashboard: violations in class this week, class point ranking | P1 | |
| DASH-05 | Student/Parent dashboard: self/child violations, points, case status | P1 | Read-only |
| DASH-06 | Report: Per-class violation summary (exportable) | P1 | |
| DASH-07 | Report: Per-student violation history (exportable) | P1 | |
| DASH-08 | Report: Semester violation statistics (exportable) | P1 | |
| DASH-09 | Report export as Excel (server-side generation via Cloud Function) | P1 | Email download link |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| DASH-10 | Custom report builder | P2 | |
| DASH-11 | Data visualization charts (Chart.js/Recharts) | P2 | |
| DASH-12 | Scheduled report email delivery | P2 | |
| DASH-13 | Drill-down analytics (click through data) | P2 | |
| DASH-14 | Dashboard export as image/PDF | P2 | |

---

### 2.10 Module J: System Administration

#### P1 Requirements (MVP)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SYS-01 | Activity log / audit trail for all state-changing operations | P1 | Written to `auditLogs` collection |
| SYS-02 | Configurable point thresholds (SP1/SP2/SP3) | P1 | Via `config/settings` document |
| SYS-03 | User account management (create, disable, role assignment) | P1 | Admin panel |
| SYS-04 | Violation category management (add/edit/disable) | P1 | Admin panel |
| SYS-05 | School profile settings (name, address, logo placeholder) | P1 | Basic configuration |
| SYS-06 | Semester/year management | P1 | Current semester tracking |

#### P2 Requirements (Deferred)

| ID | Requirement | Priority | Notes |
|----|------------|----------|-------|
| SYS-07 | Data archival enforcement | P2 | |
| SYS-08 | Semester rollover automation | P2 | |
| SYS-09 | System backup and restore | P2 | |
| SYS-10 | Bulk operations (user import, data migration) | P2 | |

---

## 3. FINAL RBAC MATRIX

### 3.1 Role Definitions

| Role | Description | Assigned To |
|------|-------------|------------|
| **Admin** | System administrator with full access | School IT / designated admin staff |
| **Guru BK** | Guidance and counseling teacher | BK teachers |
| **Kesiswaan** | Student affairs coordinator | Kesiswaan staff |
| **STP2K** | Anti-violence task force | Designated STP2K members |
| **Wali Kelas** | Homeroom teacher | Class homeroom teachers |
| **Guru Mapel** | Subject teacher | Subject teachers |
| **Siswa** | Student | All enrolled students |
| **Parent** | Parent/guardian | Parents of enrolled students |

### 3.2 Final RBAC Permission Matrix

| Module / Action | Admin | Guru BK | Kesiswaan | STP2K | Wali Kelas | Guru Mapel | Siswa | Parent |
|----------------|-------|---------|-----------|-------|------------|------------|-------|--------|
| **STUDENTS** | | | | | | | | |
| View all | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own class only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View self only | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View children only | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Create | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **VIOLATIONS** | | | | | | | | |
| Create (any student) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create (own class only) | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Read (any) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read (own class) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Read (self) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read (children) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Update | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **POINTS** | | | | | | | | |
| Read (any) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read (own class) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Read (self) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read (children) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Adjust | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CASES** | | | | | | | | |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read (any) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read (own class) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Read (self) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read (children) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Update status | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign coaching | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Escalate to BK | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Escalate to Kesiswaan | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Close | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reopen | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **LETTERS** | | | | | | | | |
| Generate | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read (any) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read (own class) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Read (self) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Read (children) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Approve SP3 | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancel | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **COACHING** | | | | | | | | |
| Read (any) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Read (own class) | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create/Update | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **DASHBOARD** | | | | | | | | |
| Full (all data) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Active Cases | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Summary | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Class view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Self view | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Children view | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **REPORTS** | | | | | | | | |
| All reports | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Per-class reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Per-student reports | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **SYSTEM SETTINGS** | | | | | | | | |
| All settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Read-only settings | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.3 Dual-Role Handling Rules

| Rule | Description |
|------|-------------|
| A user can hold multiple roles (e.g., Guru BK + Wali Kelas) | Stored in `roles[]` array on user document |
| On login, user selects primary role | Role switcher available without re-login |
| Permissions are UNION of all roles | Highest permission applies |
| Custom Claims are set via Cloud Function | Never client-side |
| Role changes require Admin approval | Audit logged |

---

## 4. FINAL DATABASE DESIGN

### 4.1 Firestore Collections Structure

```
/ (root)
│
├── config/
│   └── settings (document)
│       ├── pointThresholds: { sp1: 25, sp2: 50, sp3: 75 }
│       ├── semesterInfo: { year: "2024/2025", semester: 1, startDate, endDate }
│       ├── schoolInfo: { name, address, phone, email, logo (placeholder) }
│       └── system: { maintenanceMode: false, version: "1.0.0" }
│
├── users/{userId}
│   ├── __fields__:
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── primaryRole: UserRole
│   │   ├── roles: UserRole[]           // Array for dual-role support
│   │   ├── phone: string (optional)
│   │   ├── classId: string (if Wali Kelas)
│   │   ├── nis: string (if student)
│   │   ├── parentOf: string[] (array of studentIds, if parent)
│   │   ├── consentGiven: boolean
│   │   ├── consentDate: timestamp
│   │   ├── consentVersion: string
│   │   ├── isActive: boolean
│   │   ├── lastLoginAt: timestamp
│   │   └── createdAt, updatedAt: timestamp
│   │
│   └── __indexes__:
│       ├── email (unique)
│       └── roles (array-contains)
│
├── students/{studentId}
│   ├── __fields__:
│   │   ├── nis: string                 // Nomor Induk Siswa
│   │   ├── nama: string
│   │   ├── kelas: string               // e.g., "X", "XI", "XII"
│   │   ├── jurusan: string             // e.g., "TKJ", "AKL", "OTKP"
│   │   ├── kelasParalel: string        // e.g., "A", "B", "C"
│   │   ├── parentIds: string[]         // References to users with parent role
│   │   ├── waliKelasId: string         // Reference to user (Wali Kelas)
│   │   ├── status: StudentStatus       // "active" | "graduated" | "transferred" | "dropped"
│   │   ├── totalPoints: number         // Current semester only
│   │   ├── activeCaseId: string | null // Reference to active case
│   │   ├── semesterPoints: {           // Historical record
│   │   │   "2024-2025-1": number,
│   │   │   "2024-2025-2": number
│   │   │ }
│   │   └── createdAt, updatedAt: timestamp
│   │
│   └── __indexes__:
│       ├── nis (unique)
│       ├── kelas + jurusan (composite)
│       ├── waliKelasId
│       └── status
│
├── violationCategories/{categoryId}
│   ├── __fields__:
│   │   ├── name: string                // e.g., "Terlambat", "Membolos"
│   │   ├── description: string
│   │   ├── points: number              // Points for this violation
│   │   ├── type: ViolationType         // "ringan" | "sedang" | "berat"
│   │   ├── isActive: boolean
│   │   └── createdAt, updatedAt: timestamp
│   │
│   └── __pre-seeded_data__ (MVP):
│       ├── Ringan: Terlambat (5pt), Tidak berseragam (5pt), Rambut tidak rapi (5pt)
│       ├── Sedang: Membolos (15pt), Merokok (20pt), Berkelahi (25pt)
│       └── Berat: Pencurian (50pt), Kekerasan fisik (50pt), Narkoba (75pt)
│
├── violations/{violationId}
│   ├── __fields__:
│   │   ├── studentId: string
│   │   ├── categoryId: string
│   │   ├── categoryName: string        // Denormalized for display
│   │   ├── categoryPoints: number      // Denormalized
│   │   ├── reporterId: string          // User who reported
│   │   ├── reporterName: string        // Denormalized
│   │   ├── description: string
│   │   ├── evidence: string | null     // Firebase Storage URL
│   │   ├── evidenceType: string | null // e.g., "image/jpeg"
│   │   ├── status: ViolationStatus
│   │   ├── points: number              // Points awarded (may differ from category if adjusted)
│   │   ├── semester: string            // e.g., "2024-2025-1"
│   │   ├── coachingNotes: string (optional, BK/STP2K only)
│   │   ├── caseId: string | null       // Reference to associated case
│   │   ├── rejectedReason: string (optional)
│   │   └── createdAt, updatedAt, verifiedAt: timestamp
│   │
│   └── __indexes__:
│       ├── studentId + createdAt (composite, DESC)
│       ├── reporterId + createdAt
│       ├── status
│       ├── semester
│       └── caseId
│
├── cases/{caseId}
│   ├── __fields__:
│   │   ├── studentId: string
│   │   ├── studentName: string         // Denormalized
│   │   ├── status: CaseStatus
│   │   ├── violationIds: string[]      // References to violations
│   │   ├── currentHandler: HandlerRole // "stp2k" | "bk" | "kesiswaan"
│   │   ├── handlerId: string           // Current handler user ID
│   │   ├── timeline: CaseTimelineEntry[]
│   │   │   └── { action, userId, userName, timestamp, notes }
│   │   ├── semester: string
│   │   ├── year: string
│   │   ├── coachingSessions: CoachingSession[]
│   │   │   └── { date, counselorId, counselorName, notes, outcome }
│   │   ├── resolvedAt: timestamp (optional)
│   │   ├── closedAt: timestamp (optional)
│   │   └── createdAt, updatedAt: timestamp
│   │
│   └── __indexes__:
│       ├── studentId (unique per active case)
│       ├── status + currentHandler (composite)
│       ├── handlerId + status
│       └── semester
│
├── letters/{letterId}
│   ├── __fields__:
│   │   ├── caseId: string
│   │   ├── studentId: string
│   │   ├── studentName: string         // Denormalized
│   │   ├── type: LetterType            // "sp1" | "sp2" | "sp3"
│   │   ├── status: LetterStatus
│   │   ├── letterNumber: string        // e.g., "SP1/2024-2025/001"
│   │   ├── content: string             // Generated HTML content
│   │   ├── pdfUrl: string (optional)   // Firebase Storage URL
│   │   ├── approvedBy: string (optional, SP3 only)
│   │   ├── approvedAt: timestamp (optional)
│   │   ├── sentAt: timestamp (optional)
│   │   ├── acknowledgedAt: timestamp (optional)
│   │   ├── sentMethod: "download" | "email"
│   │   └── createdAt, updatedAt: timestamp
│   │
│   └── __indexes__:
│       ├── caseId
│       ├── studentId + type (composite)
│       ├── status
│       └── createdAt (DESC)
│
├── notifications/{notificationId}
│   ├── __fields__:
│   │   ├── recipientId: string
│   │   ├── type: NotificationType      // "new_violation" | "case_update" | "new_letter" | "coaching_scheduled"
│   │   ├── title: string
│   │   ├── body: string
│   │   ├── data: {                     // Deep link payload
│   │   │   screen: string,
│   │   │   params: object
│   │   │ }
│   │   ├── read: boolean
│   │   ├── readAt: timestamp (optional)
│   │   ├── channel: "in_app" | "email"
│   │   ├── emailStatus: "pending" | "sent" | "failed" (optional)
│   │   ├── emailError: string (optional)
│   │   └── createdAt: timestamp
│   │
│   └── __indexes__:
│       ├── recipientId + read + createdAt (composite)
│       └── recipientId + createdAt (DESC)
│
├── auditLogs/{logId}
│   ├── __fields__:
│   │   ├── action: string              // e.g., "violation.created", "case.status_changed"
│   │   ├── actorId: string
│   │   ├── actorRole: UserRole
│   │   ├── actorName: string           // Denormalized
│   │   ├── targetType: string          // "violation" | "case" | "letter" | "user" | "student"
│   │   ├── targetId: string
│   │   ├── changes: {                  // Diff of old/new values
│   │   │   old: object | null,
│   │   │   new: object | null
│   │   │ }
│   │   ├── ipAddress: string (optional)
│   │   ├── userAgent: string (optional)
│   │   └── timestamp: timestamp
│   │
│   └── __indexes__:
│       ├── targetType + targetId (composite)
│       ├── actorId + timestamp (DESC)
│       ├── action + timestamp (DESC)
│       └── timestamp (DESC)
│
└── reports/{reportId} (generated documents)
    ├── __fields__:
    │   ├── type: "class_summary" | "student_history" | "semester_statistics"
    │   ├── generatedBy: string         // User ID
    │   ├── parameters: object          // Report filter parameters
    │   ├── fileUrl: string             // Firebase Storage URL
    │   ├── format: "xlsx" | "pdf"
    │   └── generatedAt: timestamp
    │
    └── __indexes__:
        ├── type + generatedAt
        └── generatedBy
```

### 4.2 Composite Indexes Required

| Collection | Fields | Query Pattern |
|-----------|--------|---------------|
| `violations` | `studentId` ASC, `createdAt` DESC | Get violations for a student ordered by date |
| `violations` | `reporterId` ASC, `createdAt` DESC | Get violations reported by a user |
| `violations` | `caseId` ASC, `createdAt` ASC | Get all violations in a case |
| `violations` | `semester` ASC, `createdAt` DESC | Get violations in a semester |
| `students` | `kelas` ASC, `jurusan` ASC | Get students by class + jurusan |
| `students` | `waliKelasId` ASC, `nama` ASC | Get students for a Wali Kelas |
| `cases` | `handlerId` ASC, `status` ASC, `createdAt` DESC | Get active cases for a handler |
| `cases` | `status` ASC, `createdAt` DESC | Get cases by status |
| `cases` | `studentId` ASC, `semester` ASC | Get cases for a student by semester |
| `notifications` | `recipientId` ASC, `read` ASC, `createdAt` DESC | Get unread notifications for user |
| `notifications` | `recipientId` ASC, `createdAt` DESC | Get notification history for user |
| `auditLogs` | `targetType` ASC, `targetId` ASC | Get audit trail for an entity |
| `auditLogs` | `actorId` ASC, `timestamp` DESC | Get actions by a user |
| `letters` | `studentId` ASC, `createdAt` DESC | Get letters for a student |
| `letters` | `caseId` ASC, `type` ASC | Get letters in a case |

### 4.3 Data Retention Policy

| Data Type | Retention Period | Action After Period |
|-----------|-----------------|-------------------|
| Active student records | Until graduation + 1 year | Archive, then delete |
| Graduated/transferred student records | 1 year after status change | Archive to cold storage |
| Violation records | Until graduation + 1 year | Anonymize (remove student name, keep aggregate data) |
| Case records | Until graduation + 1 year | Anonymize |
| Letter records | Until graduation + 2 years | Archive, then delete |
| Audit logs | 5 years | Archive, then delete |
| User accounts (inactive) | 2 years after last login | Disable, then delete after 1 more year |
| Notification history | 90 days | Auto-delete |
| Evidence files | Until case closed + 30 days | Auto-delete via Cloud Function |

### 4.4 CSV Import Schema

| Column | Type | Required | Validation |
|--------|------|----------|------------|
| `nis` | String | ✅ | Unique, 8-20 characters, alphanumeric |
| `nama` | String | ✅ | 2-100 characters |
| `kelas` | String | ✅ | One of: X, XI, XII |
| `jurusan` | String | ✅ | Must match configured jurusan list |
| `kelas_paralel` | String | ✅ | Single character A-Z |
| `wali_kelas_email` | String | ✅ | Must match existing user with Wali Kelas role |
| `parent_email` | String | ❌ | Valid email format |
| `parent_name` | String | ❌ | Required if parent_email provided |

---

## 5. FINAL UI/UX DECISIONS

### 5.1 Design Approach

| Decision | Final Choice | Rationale |
|----------|-------------|-----------|
| **Approach** | Responsive desktop-first | Primary users (teachers, BK, admin) work on desktop/laptops. Student/parent views optimized responsively for mobile. |
| **Framework** | TailwindCSS utility classes | Consistent, rapid development, responsive utilities built-in |
| **Component Library** | Custom shared library (Button, Input, Table, Modal, Card, Badge, Toast, RoleGuard) | Reusable, consistent, tailored to school context |
| **Design Tokens** | School-branded color palette, typography, spacing | Professional, trustworthy feel |

### 5.2 Screen Inventory (MVP)

| # | Screen | Role(s) | Priority |
|---|--------|---------|----------|
| 1 | Login | All | P0 |
| 2 | Password Reset | All | P1 |
| 3 | Admin Dashboard | Admin | P1 |
| 4 | BK Dashboard | Guru BK | P1 |
| 5 | Kesiswaan Dashboard | Kesiswaan | P1 |
| 6 | Wali Kelas Dashboard | Wali Kelas | P1 |
| 7 | Student Dashboard | Siswa | P1 |
| 8 | Parent Dashboard | Parent | P1 |
| 9 | Student List | Admin, BK, Kesiswaan, STP2K | P1 |
| 10 | Student Detail | Admin, BK, Kesiswaan, STP2K, Wali Kelas | P1 |
| 11 | Student Self-View | Siswa | P1 |
| 12 | Student Children-View | Parent | P1 |
| 13 | Violation Create Form | Wali Kelas, BK, STP2K, Admin | P1 |
| 14 | Violation Detail | Authorized roles | P1 |
| 15 | Violation List/History | Authorized roles | P1 |
| 16 | Case Detail | Authorized roles | P1 |
| 17 | Case Timeline | Authorized roles | P1 |
| 18 | Letter Preview | Authorized roles | P1 |
| 19 | Letter Archive | Authorized roles | P1 |
| 20 | Coaching Session Form | BK, STP2K | P1 |
| 21 | Notification Panel (Bell) | All | P1 |
| 22 | User Management (Admin) | Admin | P1 |
| 23 | Settings Page | Admin | P1 |
| 24 | Consent/Privacy Screen | All (first login) | P0 |

### 5.3 Low-Fidelity Prototypes (Core Flow)

The following screens require low-fi prototypes by Day 3 of Sprint 0:

1. **Login** → Email/password form, "Forgot Password" link, role selector (if dual-role)
2. **Dashboard** → Role-based KPI cards, recent violations list, quick action buttons
3. **Violation Input** → Student selector, category dropdown, description field, evidence upload, coaching notes (BK/STP2K)
4. **Student List** → Search bar, class/jurusan filters, sortable table, click-to-detail
5. **Letter Generation** → Letter preview, approve button (SP3), download button

### 5.4 Responsive Breakpoints

| Breakpoint | Width | Layout | Notes |
|------------|-------|--------|-------|
| Desktop | ≥1024px | Full sidebar navigation, multi-column layouts | Primary design target |
| Tablet | 768px – 1023px | Collapsed sidebar, 2-column grids | |
| Mobile | <768px | Bottom navigation, single column, stacked cards | Student/parent primary view |

### 5.5 Accessibility Requirements (MVP)

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | Use proper `<button>`, `<form>`, `<label>`, `<nav>`, `<main>` elements |
| Keyboard navigation | All interactive elements reachable and operable via keyboard |
| Color contrast | Minimum 4.5:1 for text, 3:1 for large text (WCAG AA) |
| Focus indicators | Visible focus ring on all interactive elements |
| Form labels | All inputs have associated `<label>` elements |
| Error messages | Inline error messages with `aria-describedby` |
| Role announcements | `aria-live` regions for dynamic content changes |

### 5.6 Shared Component Library

| Component | Props | States |
|-----------|-------|--------|
| `Button` | variant, size, loading, disabled, icon | default, hover, active, loading, disabled |
| `Input` | label, error, helperText, icon, type | default, focused, error, disabled |
| `Select` | label, options, placeholder, error | default, focused, error, disabled |
| `Table` | columns, data, loading, emptyMessage, sortable | loading, empty, populated, error |
| `Modal` | title, size, closeable, footer | open, closing |
| `Card` | title, subtitle, variant, onClick | default, hover, selected |
| `Badge` | variant (success, warning, error, info), size | default |
| `Toast` | variant, message, duration, action | show, hide, auto-dismiss |
| `RoleGuard` | allowedRoles, fallback | children visible or fallback rendered |
| `DataTable` | server-side pagination, search, sort, filter | loading, empty, populated, error |
| `StatusBadge` | status enum value | colored badge per status |
| `EmptyState` | icon, title, description, action | |

---

## 6. FINAL SECURITY REQUIREMENTS

### 6.1 P0 Security Requirements (Blockers)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-01 | Firestore Security Rules enforcing full RBAC matrix | Collection-level rules matching the RBAC matrix. Rules tested with Firebase Emulator Suite. |
| SEC-02 | Custom Claims set ONLY via Cloud Function | Never client-side. Cloud Function triggered by user document creation/update. |
| SEC-03 | PDP Law consent mechanism | Consent checkbox on first login. Stored as `consentGiven: boolean` with timestamp and version. |
| SEC-04 | Privacy policy display | Accessible from login page and user profile. Explains data collection, purpose, retention, rights. |
| SEC-05 | Data deletion capability (Right to be forgotten) | Cloud Function that anonymizes/deletes all user data across collections. Admin-initiated with audit trail. |
| SEC-06 | Audit logging for all state-changing operations | Write to `auditLogs` collection for: violation create/update/delete, case status change, letter generate/approve/send, user create/update/delete, point adjustments, consent changes. |
| SEC-07 | Password policy (minimum 8 characters) | Firebase Auth built-in setting. Enabled Day 1. |

### 6.2 P1 Security Requirements (MVP)

| ID | Requirement | Implementation |
|----|-------------|----------------|
| SEC-08 | 60-minute idle session timeout | Frontend idle detection (user interaction tracker) + Firebase Auth token refresh policy. Show warning at 55 minutes. |
| SEC-09 | DOMPurify XSS protection on all rendered user input | Sanitize all user-generated content before rendering: violation descriptions, coaching notes, letter content, student names. |
| SEC-10 | File upload validation by magic bytes | Check file signature bytes (not file extension) for allowed types: JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), PDF (`25 50 44 46`). |
| SEC-11 | File size limit (max 5MB) | Validate on client-side (before upload) and server-side (Cloud Function trigger). |
| SEC-12 | Storage Security Rules | Restrict file read/write by role. Students can only read own evidence. Teachers can write to their class. |
| SEC-13 | Storage file expiration | Cloud Function to delete evidence files 30 days after case closed. |

### 6.3 P2 Security Requirements (Deferred)

| ID | Requirement | Rationale for Deferral |
|----|-------------|----------------------|
| SEC-14 | Multi-factor authentication | <200 users at a vocational school. Current password policy sufficient for MVP. |
| SEC-15 | Rate limiting on API calls | Firebase Auth already has basic protection. Additional rate limiting can be added when abuse is detected. |
| SEC-16 | Session revocation ("log out everywhere") | Can be added when user management needs grow. |
| SEC-17 | Penetration testing | Schedule before public launch (if applicable) or when handling more sensitive data. |
| SEC-18 | Data encryption key management | Firestore and Storage are encrypted at rest by default. Custom key management is over-engineering for MVP. |

### 6.4 Firestore Security Rules (Summary)

```
// Key patterns (full rules in separate file):

// Students collection
match /students/{studentId} {
  // Admin: full access
  // Guru BK, Kesiswaan, STP2K: read all
  // Wali Kelas: read own class only
  // Siswa: read self only
  // Parent: read children only
  allow read: if isAdmin() 
    || isBK() || isKesiswaan() || isSTP2K()
    || (isWaliKelas() && resource.data.waliKelasId == request.auth.uid)
    || (isSiswa() && studentId == getStudentIdForUser(request.auth.uid))
    || (isParent() && resource.data.parentIds.hasAny([getParentId(request.auth.uid)]));
  
  allow create: if isAdmin();
  allow update: if isAdmin();
  allow delete: if isAdmin();
}

// Violations collection
match /violations/{violationId} {
  allow read: if isAdmin() || isBK() || isKesiswaan() || isSTP2K()
    || (isWaliKelas() && getStudentData(resource.data.studentId).waliKelasId == request.auth.uid)
    || (isSiswa() && resource.data.studentId == getStudentIdForUser(request.auth.uid))
    || (isParent() && isChildOfParent(resource.data.studentId, request.auth.uid));
  
  allow create: if isAdmin() || isBK() || isSTP2K() 
    || (isWaliKelas() && isStudentInMyClass(request.resource.data.studentId));
  
  allow update: if isAdmin() 
    || (isWaliKelas() && isStudentInMyClass(resource.data.studentId));
  
  allow delete: if isAdmin();
}

// Cases collection
match /cases/{caseId} {
  allow read: if isAdmin() || isBK() || isKesiswaan() || isSTP2K()
    || (isWaliKelas() && isStudentInMyClass(resource.data.studentId))
    || (isSiswa() && resource.data.studentId == getStudentIdForUser(request.auth.uid))
    || (isParent() && isChildOfParent(resource.data.studentId, request.auth.uid));
  
  allow create: if isAdmin() || isBK();
  allow update: if isAdmin() || isBK() || isKesiswaan() || isSTP2K();
  allow delete: if isAdmin();
}
```

### 6.5 PDP Law Compliance Checklist (P0)

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Explicit consent for data processing | ✅ P0 | Consent checkbox on first login |
| 2 | Privacy policy displayed | ✅ P0 | Link on login page + profile page |
| 3 | Right to access personal data | ✅ P0 | Students/parents can view their data |
| 4 | Right to correct personal data | ✅ P1 | Profile management |
| 5 | Right to deletion (right to be forgotten) | ✅ P0 | Data deletion Cloud Function |
| 6 | Right to restrict processing | ✅ P1 | Account deactivation |
| 7 | Right to data portability | ✅ P2 | Data export in machine-readable format |
| 8 | Data breach notification plan | 📋 Documented | Breach response process documented |
| 9 | Data retention schedule | ✅ P0 | Retention policy defined (Section 4.3) |
| 10 | Data processing records | ✅ P0 | Audit logging |
| 11 | Security measures documentation | ✅ P0 | This document |
| 12 | Data Protection Officer contact | 📋 To be assigned | School to designate |

---

## 7. FINAL TESTING STRATEGY

### 7.1 Testing Tiers

| Tier | Scope | Tool | Coverage Goal | Timeline |
|------|-------|------|---------------|----------|
| **Tier 1: Unit** | Critical path functions only | Jest + React Testing Library | Critical paths only (auth, point calculation, letter generation, state machine transitions) | Sprint 1+ |
| **Tier 2: Integration** | Core API flows | Firebase Emulator Suite | Create violation → Update points → Generate letter | Sprint 2+ |
| **Tier 3: E2E** | One core user journey | Cypress | Login → Create Violation → View in Dashboard | Sprint 2+ |
| **Tier 4: Manual** | Smoke test + critical path | Manual QA | Before each sprint demo | Every sprint |

### 7.2 Unit Test Requirements (Critical Paths)

| Module | Test Case | Priority |
|--------|-----------|----------|
| **Auth** | Login with valid credentials succeeds | P1 |
| **Auth** | Login with invalid credentials fails with appropriate error | P1 |
| **Auth** | Password reset email sent for valid email | P1 |
| **Auth** | Role-based routing: unauthorized role redirected | P1 |
| **Auth** | Dual-role user can switch roles | P1 |
| **Auth** | Session timeout triggers logout after 60 min idle | P1 |
| **Points** | Points calculated correctly for single violation | P1 |
| **Points** | Points accumulated across multiple violations | P1 |
| **Points** | Points reset at semester boundary | P1 |
| **Points** | Threshold alert triggers at correct point level | P1 |
| **Points** | Point rollback on violation deletion | P1 |
| **State Machine** | Violation transitions through all valid states | P1 |
| **State Machine** | Invalid state transitions are rejected | P1 |
| **State Machine** | Case created when first violation verified | P1 |
| **State Machine** | Case can be resolved from any state | P1 |
| **Letters** | SP1 auto-generated at threshold | P1 |
| **Letters** | SP2 auto-generated at threshold | P1 |
| **Letters** | SP3 requires Kesiswaan approval | P1 |
| **Letters** | Letter number auto-increment is sequential | P1 |
| **Security** | Firestore rules deny unauthorized access | P0 |
| **Security** | Custom claims correctly enforce RBAC | P0 |
| **Security** | XSS input is sanitized on render | P1 |
| **Security** | File upload validates magic bytes, rejects invalid types | P1 |
| **Audit** | All state changes create audit log entry | P0 |
| **Import** | CSV import validates all required fields | P1 |
| **Import** | CSV import rejects duplicate NIS | P1 |
| **Import** | CSV import creates user accounts + student records | P1 |

### 7.3 E2E Test: Core User Journey

**Test Scenario:** Complete flow from login to violation creation to dashboard

```
Steps:
1. Navigate to /login
2. Enter valid credentials (Wali Kelas role)
3. Assert: Redirected to Wali Kelas dashboard
4. Click "Input Pelanggaran" button
5. Select student from class list
6. Select violation category
7. Enter description
8. Upload evidence file (valid JPEG, <5MB)
9. Click "Submit"
10. Assert: Success toast shown
11. Assert: Violation visible in "Recent Violations" on dashboard
12. Assert: Student point total updated
13. Assert: Notification created for Wali Kelas
14. Logout
15. Login as student
16. Assert: Dashboard shows the violation in self-view
```

### 7.4 Quality Gates (MVP)

| Gate | Criteria | Blocking? |
|------|----------|-----------|
| **Lint** | ESLint passes with 0 errors | ✅ Yes |
| **Type Check** | TypeScript compilation succeeds | ✅ Yes |
| **Unit Tests** | All critical path tests pass | ✅ Yes |
| **E2E Smoke** | Core user journey passes | ✅ Yes |
| **Security Rules** | Firestore rules tests pass | ✅ Yes |
| **Build** | Production build succeeds | ✅ Yes |
| **Manual QA** | QA sign-off on sprint features | ✅ Yes |
| **Accessibility** | No critical aXe violations | ⚠️ Recommended |

### 7.5 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run type-check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test -- --coverage

  firebase-rules-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:rules
      
  build:
    runs-on: ubuntu-latest
    needs: [lint, type-check, unit-tests, firebase-rules-test]
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: e-report-smk-texmaco
```

---

## 8. FINAL DEPLOYMENT PLAN

### 8.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  React + Vite + TailwindCSS                                 │
│  Firebase Auth SDK + Firestore SDK + Storage SDK            │
│  React Query (server state) + Zustand (client state)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE HOSTING                           │
│  CDN-delivered static assets (JS, CSS, images)              │
│  Automatic SSL/TLS                                          │
│  Custom domain: e-report.smktexmaco.sch.id                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌─────────────────┐   ┌─────────────────────────┐
│  FIREBASE AUTH  │   │     CLOUD FUNCTIONS      │
│  Email/Password │   │  (asia-southeast2)        │
│  Custom Claims  │   │                           │
│  Password Reset │   │  - createUser             │
└─────────────────┘   │  - importStudents         │
                      │  - generateLetter         │
          ┌───────────┤  - sendNotification       │
          │           │  - processViolation       │
          ▼           │  - semesterRollover       │
┌─────────────────┐   │  - deleteUserData         │
│  CLOUD STORAGE  │   │  - cleanupEvidence        │
│  Evidence files │   └─────────────────────────┘
│  Letter PDFs    │
│  Report exports │
└─────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                       FIRESTORE                              │
│  (Native mode, asia-southeast2 - Jakarta)                    │
│  Collections: users, students, violations, cases,           │
│  letters, notifications, auditLogs, config                  │
│  Security Rules: RBAC-enforced                              │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  SendGrid (Transactional Email)                             │
│  Firebase Cloud Messaging (Push - Phase 2)                  │
│  WhatsApp Business API (Phase 2)                            │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Firebase Project Configuration

| Setting | Value |
|---------|-------|
| Project ID | `e-report-smk-texmaco` |
| Firestore Location | `asia-southeast2` (Jakarta) |
| Cloud Functions Location | `asia-southeast2` |
| Storage Location | `asia-southeast2` |
| Firebase Hosting Custom Domain | `e-report.smktexmaco.sch.id` |
| Firebase Auth Providers | Email/Password only (MVP) |
| Firebase Auth Password Policy | Min 8 characters, enabled |
| Firebase Auth Session Duration | 60 minutes |
| Firebase Emulator Suite | Local development only |

### 8.3 Deployment Environments

| Environment | Purpose | URL | Firebase Project |
|-------------|---------|-----|------------------|
| **Local** | Development | `localhost:5173` | Emulator Suite |
| **Staging** | QA & Testing | `staging.e-report.smktexmaco.sch.id` | Same project, separate site |
| **Production** | Live | `e-report.smktexmaco.sch.id` | Same project, production site |

### 8.4 Minimum Requirements (Client-Side)

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Browser | Chrome 80+, Firefox 75+, Safari 13+, Edge 80+ | Latest versions |
| Internet Speed | 1 Mbps | 5 Mbps+ |
| Screen Resolution | 1024×768 (desktop), 375×667 (mobile) | 1920×1080+ |
| JavaScript | Enabled | Enabled |
| Cookies | Required for auth session | Required |

### 8.5 Deployment Checklist

| Pre-Deployment | Post-Deployment |
|----------------|-----------------|
| ✅ All P0/P1 tests pass | ✅ Smoke test core workflow |
| ✅ Security Rules tested with emulator | ✅ Verify all roles can access correctly |
| ✅ Environment variables configured | ✅ Test password reset flow |
| ✅ Firebase Hosting preview channel tested | ✅ Verify email sending (SendGrid) |
| ✅ Custom domain DNS configured | ✅ Test file upload and retrieval |
| ✅ SSL certificate provisioned | ✅ Verify audit logs are being written |
| ✅ SendGrid API key configured | ✅ Monitor Firebase Crashlytics |
| ✅ Rollback plan documented | ✅ Verify Firestore indexes are created |
| ✅ Backup of Firestore data (if migrating) | ✅ Test all state machine transitions |
| ✅ Stakeholder notification sent | ✅ Verify responsive layouts on mobile |

---

## 9. FINAL AI FEATURE PLAN

### 9.1 AI Features Status

| Feature | Phase | Rationale |
|---------|-------|-----------|
| No AI features for MVP | **Phase 2+** | Core functionality must be stable before introducing AI complexity |

### 9.2 AI Features Considered for Phase 2

| Feature | Description | Value | Complexity |
|---------|-------------|-------|------------|
| **Violation Description Assist** | AI-suggested violation descriptions based on category + student history | Reduces teacher input time | Medium |
| **Counseling Note Suggestions** | AI-generated draft notes based on violation patterns | Assists BK staff | Medium |
| **Letter Content Personalization** | AI-adjusted letter language based on severity and history | More contextually appropriate letters | Medium-High |
| **Behavior Pattern Analysis** | Identify at-risk students before reaching critical thresholds | Proactive intervention | High |
| **Smart Notification Prioritization** | AI-prioritized notification feed for teachers | Reduces information overload | Medium |
| **Report Narrative Generation** | AI-written summary of semester statistics | Saves admin time | High |
| **Chatbot for User Guidance** | FAQ chatbot for teachers/parents using the system | Reduces support burden | High |

### 9.3 AI Implementation Prerequisites

| Precondition | Status | Notes |
|-------------|--------|-------|
| Sufficient violation data (at least 1 semester of data) | ❌ Not yet | Need minimum viable dataset |
| Cloud Functions with GPU support | ❌ Not configured | Firestore + Cloud Functions only for MVP |
| Google Cloud AI Platform access | ❌ Not configured | Need project upgrade |
| Data anonymization pipeline | ❌ Not designed | Required before any AI on student data |
| Privacy impact assessment | ❌ Not conducted | PDP Law requirement for AI processing |
| Stakeholder consent for AI processing | ❌ Not obtained | Separate consent needed |

### 9.4 Recommendation

**Do NOT implement AI features in MVP.** The school's core need is reliable, predictable violation tracking and letter generation. AI adds:
- Unpredictable behavior (non-deterministic outputs)
- Privacy compliance complexity
- Maintenance burden
- Cost for API calls

**Revisit AI features after:**
1. 6 months of production data accumulated
2. Core system is stable with zero critical bugs
3. PDP Law compliance for AI processing is established
4. Stakeholders express specific need for AI features

---

## 10. STATE MACHINE SPECIFICATIONS

### 10.1 Violation State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                    VIOLATION STATE MACHINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────┐    ┌──────────┐    ┌──────────┐    ┌─────────────┐   │
│  │DRAFT │───►│SUBMITTED │───►│VERIFIED  │───►│POINT ADDED  │   │
│  └──────┘    └──────────┘    └──────────┘    └──────┬──────┘   │
│       ▲              │                                │         │
│       │              │ (rejected)                     │         │
│       │    ┌─────────▼────────┐                      │         │
│       │    │    REJECTED      │──► Return to Draft    │         │
│       │    └──────────────────┘                      │         │
│       │                                               │         │
│       └───────────────────────────────────────────────┘         │
│                     (edit & resubmit)                            │
└─────────────────────────────────────────────────────────────────┘
```

**Transition Rules:**

| From | To | Authorized Actor | Conditions |
|------|----|-----------------|------------|
| `Draft` | `Submitted` | Creator (WK, BK, STP2K, Admin) | All required fields filled |
| `Submitted` | `Verified` | STP2K, Admin | Evidence reviewed, coaching notes added |
| `Submitted` | `Rejected` | STP2K, Admin, BK | Reason required for rejection |
| `Rejected` | `Draft` | Creator | Edit and resubmit |
| `Verified` | `Point Added` | System (automatic) | Points calculated and added to student total |
| Any | Any | Admin | Admin override (with audit reason) |

**Side Effects:**
- `Submitted` → Automatically creates or attaches to active case for the student
- `Point Added` → Checks if threshold crossed; if yes, triggers letter auto-generation
- Any state change → Writes to audit log

### 10.2 Case State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                      CASE STATE MACHINE                          │
│              (One active case per student per year)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │ ACTIVE │───►│UNDER COACHING│───►│ESCALATED TO  │             │
│  │        │    │  (BK)        │    │    BK        │             │
│  └───┬────┘    └──────┬───────┘    └──────┬───────┘             │
│      │                │                   │                     │
│      │                │                   ▼                     │
│      │                │            ┌────────────────┐           │
│      │                │            │ESCALATED TO    │           │
│      │                │            │KESISWAAN (SP3) │           │
│      │                │            └────────┬───────┘           │
│      │                │                     │                   │
│      ▼                ▼                     ▼                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │                    RESOLVED                        │         │
│  │  (Can be reached from ANY state)                   │         │
│  └────────────────────┬───────────────────────────────┘         │
│                       │                                         │
│                       ▼                                         │
│  ┌────────────────────────────────────────────────────┐         │
│  │                    CLOSED                          │         │
│  │  (Year-end / graduation / admin decision)          │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

**Transition Rules:**

| From | To | Authorized Actor | Conditions |
|------|----|-----------------|------------|
| `Active` | `Under Coaching` | BK | Initial coaching assigned |
| `Active` | `Resolved` | BK, Admin | Issue resolved without formal coaching |
| `Under Coaching` | `Escalated to BK` | BK | Coaching not sufficient, needs BK intervention |
| `Under Coaching` | `Resolved` | BK, Admin | Coaching successful |
| `Escalated to BK` | `Under Coaching` | BK | BK assigns structured counseling |
| `Escalated to BK` | `Escalated to Kesiswaan` | Kesiswaan | SP3 threshold reached or serious violation |
| `Escalated to BK` | `Resolved` | BK, Admin | BK resolves the case |
| `Escalated to Kesiswaan` | `Resolved` | Kesiswaan, Admin | Final resolution after SP3 |
| Any | `Resolved` | Admin | Admin override (with reason) |
| `Resolved` | `Closed` | System (auto) | End of academic year |
| `Resolved` | `Active` (reopen) | Admin | Only with documented reason |
| `Closed` | `Active` (reopen) | Admin | Exceptional circumstances only |

**Side Effects:**
- Case creation → Notification to Wali Kelas
- `Escalated to Kesiswaan` → SP3 letter generation requirement
- `Resolved` → Notification to all involved parties
- Any state change → Writes to case timeline and audit log

### 10.3 Letter State Machine

```
┌─────────────────────────────────────────────────────────────────┐
│                      LETTER STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌────────┐  │
│  │ GENERATED│───►│ APPROVED  │───►│   SENT    │───►│ACKNOWL- │  │
│  │ (draft)  │    │ (if SP3)  │    │           │    │EDGED   │  │
│  └──────────┘    └───────────┘    └─────┬─────┘    └────────┘  │
│       │                                 │                       │
│       │ (auto for SP1/SP2)              │ (no response in      │
│       ▼                                 │  7 days)             │
│  ┌──────────┐                           ▼                       │
│  │ CANCELLED│                    ┌────────────────┐             │
│  └──────────┘                    │SENT - UNACKNOW-│             │
│                                  │LEDGED          │             │
│                                  └────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

**Transition Rules:**

| From | To | Authorized Actor | Conditions |
|------|----|-----------------|------------|
| `Generated` | `Approved` | Kesiswaan (SP3 only) | SP3 requires explicit approval |
| `Generated` | `Cancelled` | Admin | Before sending |
| `Approved` | `Sent` | System / Admin | Letter sent (method: download or email) |
| `Sent` | `Acknowledged` | Student/Parent | Confirmation of receipt |
| `Sent` | `Sent - Unacknowledged` | System (auto) | No acknowledgement within 7 days |
| `Generated` | `Sent` | System (auto, SP1/SP2) | SP1/SP2 auto-sent (download available) |

**Letter Type Rules:**

| Type | Auto-Generate? | Approval Needed? | Trigger |
|------|---------------|------------------|---------|
| SP1 | ✅ Yes | ❌ No | Points reach threshold 1 (default: 25) |
| SP2 | ✅ Yes | ❌ No | Points reach threshold 2 (default: 50) |
| SP3 | ✅ Yes | ✅ Kesiswaan approval | Points reach threshold 3 (default: 75) |

---

## 11. POINT SYSTEM & THRESHOLDS

### 11.1 Point Thresholds (Configurable)

| Threshold | Default Points | Action | Auto-Generated | Requires Approval |
|-----------|---------------|--------|---------------|-------------------|
| SP1 | 25 | Warning letter to parent | ✅ Yes | ❌ No |
| SP2 | 50 | Second warning, parent summons | ✅ Yes | ❌ No |
| SP3 | 75 | Final warning, possible expulsion | ✅ Yes | ✅ Kesiswaan |
| Auto-Review | 100 | Immediate Kesiswaan review | ✅ Yes (escalation) | N/A |

### 11.2 Violation Category Points (Pre-Seeded)

| Category | Type | Points | SP1 Count | SP2 Count | SP3 Count |
|----------|------|--------|-----------|-----------|-----------|
| Terlambat | Ringan | 5 | 5x | 10x | 15x |
| Tidak Berseragam | Ringan | 5 | 5x | 10x | 15x |
| Rambut Tidak Rapi | Ringan | 5 | 5x | 10x | 15x |
| Tidak Mengerjakan Tugas | Ringan | 5 | 5x | 10x | 15x |
| Membolos | Sedang | 15 | 2x | 4x | 5x |
| Merokok | Sedang | 20 | 2x | 3x | 4x |
| Berkelahi | Sedang | 25 | 1x | 2x | 3x |
| Membawa HP (jika dilarang) | Sedang | 15 | 2x | 4x | 5x |
| Pencurian | Berat | 50 | N/A | 1x | 2x |
| Kekerasan Fisik | Berat | 50 | N/A | 1x | 2x |
| Narkoba | Berat | 75 | N/A | N/A | 1x |
| Perundungan (Bullying) | Berat | 50 | N/A | 1x | 2x |

### 11.3 Point Calculation Rules

| Rule | Description |
|------|-------------|
| Points accumulate per semester | Reset to 0 at semester start |
| Each violation adds category points | Points defined in violation category |
| Points cannot be negative | Minimum 0 points |
| Point adjustments by Admin only | With audit trail reason required |
| Deleted violation = points reversed | Full rollback of associated points |
| Points visible to student/parent | Read-only display |
| Threshold check on every violation | After each Point Added event |

---

## 12. PDP LAW COMPLIANCE CHECKLIST

### 12.1 Legal Basis (UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi)

| Article | Requirement | Implementation Status |
|---------|-------------|----------------------|
| **Pasal 5** | Personal data processing must have legal basis | ✅ School's educational interest + consent |
| **Pasal 13** | Data subject consent required | ✅ Consent checkbox on first login |
| **Pasal 18** | Privacy policy must be provided | ✅ Displayed on login and profile |
| **Pasal 19** | Data subject rights must be facilitated | ✅ View, correct, delete implemented |
| **Pasal 29** | Adequate security measures | ✅ This security document |
| **Pasal 36** | Data breach notification within 3 days | 📋 Procedure documented |
| **Pasal 46** | Data retention period defined | ✅ Retention policy documented |
| **Pasal 57** | Record of processing activities | ✅ Audit logging implemented |

### 12.2 Implementation Checklist

| # | Item | Status | Owner | Deadline |
|---|------|--------|-------|----------|
| 1 | Privacy policy document created | ✅ Done | Product Manager | Sprint 0 |
| 2 | Consent mechanism on first login | ✅ P0 | Frontend Architect | Sprint 1 |
| 3 | Data deletion (right to be forgotten) function | ✅ P0 | Firebase Architect | Sprint 1 |
| 4 | Data access portal (users can view their data) | ✅ P0 | Frontend Architect | Sprint 1 |
| 5 | Data correction functionality | ✅ P1 | Frontend Architect | Sprint 2 |
| 6 | Audit logging for all processing | ✅ P0 | Software Architect | Sprint 1 |
| 7 | Data retention automated enforcement | ✅ P0 | Firebase Architect | Sprint 2 |
| 8 | Data breach response plan documented | 📋 Documented | Security Architect | Sprint 0 |
| 9 | Data Processing Agreement (DPA) with Google | 📋 Verify | CEO | Sprint 0 |
| 10 | Consent versioning (track policy updates) | ✅ P1 | Software Architect | Sprint 2 |

### 12.3 Data Subject Rights Implementation

| Right | How It Works in System |
|-------|----------------------|
| **Right to Know** | Privacy policy explains what data is collected, why, and how it's used |
| **Right to Access** | Users can view all their personal data through their profile |
| **Right to Correct** | Users can update their profile information (name, contact) |
| **Right to Delete** | Admin-initiated data deletion function that anonymizes all user data |
| **Right to Restrict** | Account deactivation stops processing |
| **Right to Portability** | Phase 2: Export personal data in JSON format |
| **Right to Object** | Phase 2: Opt-out of specific processing types |

---

## 13. GLOSSARY & DEFINITIONS

| Term | Definition |
|------|-----------|
| **BK** | Bimbingan dan Konseling (Guidance and Counseling) |
| **STP2K** | Satuan Tugas Penanganan dan Pencegahan Kekerasan (Anti-Violence Task Force) |
| **SP1/SP2/SP3** | Surat Peringatan 1/2/3 (Warning Letter 1/2/3) |
| **NIS** | Nomor Induk Siswa (Student Identification Number) |
| **Kesiswaan** | Student Affairs Department |
| **Wali Kelas** | Homeroom Teacher |
| **Guru Mapel** | Subject Teacher |
| **Ringan** | Minor (violation type, ~5 points) |
| **Sedang** | Moderate (violation type, ~15-25 points) |
| **Berat** | Severe (violation type, ~50-75 points) |
| **Kasus** | Case – One continuous case per student per academic year |
| **Pelanggaran** | Violation – An individual infraction event |
| **Poin** | Points – Accumulated numerical score from violations |
| **Surat** | Letter – Warning letter generated at point thresholds |
| **PDP Law** | Indonesian Personal Data Protection Law (UU No. 27/2022) |
| **Firestore** | Firebase NoSQL document database |
| **Cloud Functions** | Serverless backend functions (Firebase/Google Cloud) |
| **Custom Claims** | Firebase Auth metadata storing user roles |
| **RBAC** | Role-Based Access Control |

---

## 14. APPENDICES

### Appendix A: Resolved Issues Summary

| Category | Issues Identified | P0 Resolved | P1 MVP | P2 Deferred |
|----------|------------------|-------------|--------|-------------|
| Missing Functional Requirements | 20 | 3 | 5 | 12 |
| Missing Non-Functional Requirements | 10 | 1 | 3 | 6 |
| Inconsistencies Between Documents | 10 | 10 | 0 | 0 |
| Technical Risks | 14 | 3 | 5 | 6 |
| Security Vulnerabilities | 16 | 4 | 5 | 7 |
| Ambiguities Needing Clarification | 15 | 15 | 0 | 0 |
| Missing User Stories | 11 | 2 | 4 | 5 |
| Missing Edge Cases | 12 | 3 | 3 | 6 |
| Performance Concerns | 10 | 1 | 3 | 6 |
| **TOTAL** | **118** | **42** | **28** | **48** |

### Appendix B: Key Design Decisions Log

| Decision ID | Topic | Decision | Rationale | Made By |
|-------------|-------|----------|-----------|---------|
| D-01 | Wali Kelas violation input | ✅ Wali Kelas CAN input violations | CEO: First point of contact for student behavior | CEO |
| D-02 | Mobile-first vs Desktop-first | ✅ Responsive desktop-first | Primary users work on desktop | CEO |
| D-03 | Case definition | ✅ One active case per student per year | Simplifies tracking | CEO + PM |
| D-04 | Point reset | ✅ Reset each semester | Fair and actionable | CEO |
| D-05 | WhatsApp notifications | ✅ Phase 2 (deferred) | Reduces MVP complexity | CEO + PM |
| D-06 | Student/parent accounts | ✅ Read-only for MVP | Essential transparency, low cost | CEO + PM |
| D-07 | Data import | ✅ CSV import | 1000+ manual entries non-viable | PM |
| D-08 | Evidence upload | ✅ Optional, photo, max 5MB | Reduces teacher friction | PM |
| D-09 | Full-text search | ✅ Rejected for MVP | Over-engineering for 1000 students | CEO |
| D-10 | MFA | ✅ Phase 2 | Proportional security | CEO + Security |
| D-11 | Pre-dev timeline | ✅ 1 week parallel tracks | Speed matters | CEO |
| D-12 | Testing scope | ✅ Critical paths only | Pragmatic quality | PM + QA |
| D-13 | AI features | ✅ Phase 2+ | Core stability first | CEO |

### Appendix C: Sprint 0 Detailed Task List

| Day | Track A (Dev) | Track B (Design/Req) |
|-----|--------------|----------------------|
| **Mon** | Firebase setup, React scaffold, Routing, Dependencies | Low-fi prototypes start, Workshop 1 materials |
| **Tue** | Security Rules, Shared components | Workshop 1 (BK + Kesiswaan) 09:00-11:00 |
| **Wed** | Cloud Functions scaffolding, Auth UI | Low-fi complete, Workshop 1 documentation |
| **Thu** | Component refinements, Initial Security Rules | Workshop 2 (Admin + STP2K) 09:00-11:00 |
| **Fri** | Sprint 0 closeout, Sprint 1 planning | All docs finalized, Sprint 1 user stories |

### Appendix D: Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | React | 18.x | UI components |
| Build Tool | Vite | 5.x | Fast dev/build |
| Styling | TailwindCSS | 3.x | Utility-first CSS |
| State Management (Server) | TanStack React Query | 5.x | Server state, caching |
| State Management (Client) | Zustand | 4.x | Client state (UI) |
| Forms | React Hook Form + Zod | Latest | Form validation |
| Table | TanStack Table | 8.x | Data tables |
| Routing | React Router DOM | 6.x | Client routing |
| Date Handling | date-fns | Latest | Date formatting |
| PDF Generation | PDFKit (server) | Latest | Letter PDF generation |
| Email | SendGrid | API v3 | Transactional email |
| Backend | Firebase Cloud Functions | Node 18 | Serverless functions |
| Database | Firestore (Native) | Latest | NoSQL document store |
| Auth | Firebase Auth | Latest | Authentication |
| Storage | Firebase Storage | Latest | File storage |
| Hosting | Firebase Hosting | Latest | Static asset hosting |
| CI/CD | GitHub Actions | Latest | Automated pipeline |
| Monitoring | Firebase Crashlytics | Latest | Error tracking |
| Testing (Unit) | Jest + React Testing Library | Latest | Unit/component tests |
| Testing (E2E) | Cypress | Latest | End-to-end tests |
| Testing (Rules) | Firebase Emulator Suite | Latest | Security rules tests |

---

## 🚀 READY FOR IMPLEMENTATION

This document serves as the **Single Source of Truth** for the E-Report SMK Texmaco Subang project. All team members should reference this document for:

- ✅ **Functional specifications** (Modules A–J)
- ✅ **Permission assignments** (RBAC Matrix)
- ✅ **Data structure** (Firestore Schema)
- ✅ **User interface approach** (UI/UX Decisions)
- ✅ **Protection measures** (Security Requirements)
- ✅ **Quality verification** (Testing Strategy)
- ✅ **Release process** (Deployment Plan)
- ✅ **Future capabilities** (AI Feature Plan)

**Development begins Sprint 0 – Week 1.**

**Any deviations from this document require CEO approval.**

---

**Document Version:** 1.0
**Last Updated:** [Current Date]
**Status:** ✅ Final – Approved for Implementation
**Maintained By:** Technical Writer
**Next Review:** After Sprint 2