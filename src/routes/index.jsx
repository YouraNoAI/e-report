/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppShell from "../components/layout/AppShell";
import LazyLoad from "../components/shared/LazyLoad";
import { ROLES } from "../constants/roles";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const UnauthorizedPage = lazy(() => import("../pages/auth/UnauthorizedPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const StudentsPage = lazy(() => import("../pages/students/index"));
const StudentDetailPage = lazy(() => import("../pages/students/detail"));
const ViolationsPage = lazy(() => import("../pages/violations/index"));
const AddViolationPage = lazy(() => import("../pages/violations/new"));
const ViolationDetailPage = lazy(() => import("../pages/violations/detail"));
const CoachingPage = lazy(() => import("../pages/coaching/index"));
const AddCoachingPage = lazy(() => import("../pages/coaching/new"));
const CasesPage = lazy(() => import("../pages/cases/index"));
const CaseDetailPage = lazy(() => import("../pages/cases/detail"));
const LettersPage = lazy(() => import("../pages/letters/index"));
const LetterGeneratePage = lazy(() => import("../pages/letters/generate"));
const LetterDetailPage = lazy(() => import("../pages/letters/detail"));
const ReportsPage = lazy(() => import("../pages/reports/index"));
const NotificationsPage = lazy(() => import("../pages/notifications/index"));
const SettingsPage = lazy(() => import("../pages/settings/index"));
const UserManagementPage = lazy(() => import("../pages/settings/users"));
const CategoryManagementPage = lazy(() => import("../pages/settings/categories"));
const PortalPage = lazy(() => import("../pages/portal/index"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <LazyLoad>
        <LoginPage />
      </LazyLoad>
    ),
  },
  {
    path: "/unauthorized",
    element: (
      <LazyLoad>
        <UnauthorizedPage />
      </LazyLoad>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyLoad>
            <DashboardPage />
          </LazyLoad>
        ),
      },
      {
        path: "dashboard",
        element: <Navigate to="/" replace />,
      },
      {
        path: "students",
        element: (
          <LazyLoad>
            <StudentsPage />
          </LazyLoad>
        ),
      },
      {
        path: "students/:id",
        element: (
          <LazyLoad>
            <StudentDetailPage />
          </LazyLoad>
        ),
      },
      {
        path: "violations",
        element: (
          <LazyLoad>
            <ViolationsPage />
          </LazyLoad>
        ),
      },
      {
        path: "violations/new",
        element: (
          <LazyLoad>
            <AddViolationPage />
          </LazyLoad>
        ),
      },
      {
        path: "violations/:id",
        element: (
          <LazyLoad>
            <ViolationDetailPage />
          </LazyLoad>
        ),
      },
      {
        path: "coaching",
        element: (
          <LazyLoad>
            <CoachingPage />
          </LazyLoad>
        ),
      },
      {
        path: "coaching/new",
        element: (
          <LazyLoad>
            <AddCoachingPage />
          </LazyLoad>
        ),
      },
      {
        path: "cases",
        element: (
          <LazyLoad>
            <CasesPage />
          </LazyLoad>
        ),
      },
      {
        path: "cases/:studentId",
        element: (
          <LazyLoad>
            <CaseDetailPage />
          </LazyLoad>
        ),
      },
      {
        path: "letters",
        element: (
          <LazyLoad>
            <LettersPage />
          </LazyLoad>
        ),
      },
      {
        path: "letters/generate",
        element: (
          <LazyLoad>
            <LetterGeneratePage />
          </LazyLoad>
        ),
      },
      {
        path: "letters/:id",
        element: (
          <LazyLoad>
            <LetterDetailPage />
          </LazyLoad>
        ),
      },
      {
        path: "reports",
        element: (
          <LazyLoad>
            <ReportsPage />
          </LazyLoad>
        ),
      },
      {
        path: "notifications",
        element: (
          <LazyLoad>
            <NotificationsPage />
          </LazyLoad>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <LazyLoad>
              <SettingsPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/users",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <LazyLoad>
              <UserManagementPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings/categories",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <LazyLoad>
              <CategoryManagementPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },
      {
        path: "portal",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ORANG_TUA, ROLES.SISWA]}>
            <LazyLoad>
              <PortalPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
