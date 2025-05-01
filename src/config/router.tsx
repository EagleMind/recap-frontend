import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingPage } from "@/components/landing/LandingPage";

import { AuthPage } from "@/components/auth/AuthPage";
import { HubPage } from "@/components/hub/HubPage";
import { MembersPage } from "@/components/hub/team";
import { RolesPage, PermissionsPage } from "@/components/settings";
import MemberEditPage from "@/components/hub/team/members/MemberEditPage";
import { MemberBreadcrumb } from "@/components/breadcrumbs/MemberBreadcrumb";
import RecapsPage from "@/components/hub/recaps/RecapsPage";
import TeamManagementPage from "@/components/hub/team/teamManagement/TeamManagementPage";
import TeamCreatePage from "@/components/hub/team/teamManagement/TeamCreatePage";
import TeamEditPage from "@/components/hub/team/teamManagement/TeamEditPage";
import { AuthGuard } from "@/guards/AuthGuard";
import { GuestGuard } from "@/guards/GuestGuard";
import { ForgotPassword } from "@/components/auth/ForgotPassword";
import { ResetPassword } from "@/components/auth/ResetPassword";
import AccountPage from "@/components/account/Account";
import Subscribe from "@/subscribe";
import VerifyAccount from "@/components/auth/VerifyAccount";
import SubscribeSuccess from "../subscribe-success";
import ManageSubscriptionPage from "@/components/hub/ManageSubscriptionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestGuard>
        <LandingPage />
      </GuestGuard>
    ),
    handle: { breadcrumb: "Home" },
  },

  {
    path: "/login",
    element: (
      <GuestGuard>
        <AuthPage />
      </GuestGuard>
    ),
    handle: { breadcrumb: "Login" },
  },
  {
    path: "/hub",
    element: (
      <AuthGuard>
        <HubPage />
      </AuthGuard>
    ),
    handle: { breadcrumb: "Hub" },
    children: [
      {
        index: true,
        element: <Navigate to="recaps" replace />,
      },
      {
        path: "team",
        children: [
          {
            path: "members",
            handle: { breadcrumb: "Members" },
            children: [
              { path: "", element: <MembersPage /> },
              {
                path: ":memberId/edit",
                element: <MemberEditPage />,
                handle: { breadcrumb: <MemberBreadcrumb /> },
              },
            ],
          },
          {
            path: "manage",
            handle: { breadcrumb: "Manage" },
            children: [
              {
                path: "",
                element: <TeamManagementPage />,
                handle: { breadcrumb: "Teams" },
              },
              {
                path: "new",
                element: <TeamCreatePage />,
                handle: { breadcrumb: "New Team" },
              },
              {
                path: ":teamId/edit",
                element: <TeamEditPage />,
                handle: {
                  breadcrumb: (match: any) => `Edit ${match.params.teamId}`,
                },
              },
            ],
          },
        ],
      },
      {
        path: "recaps",
        element: <RecapsPage />,
        handle: {
          breadcrumb: (
            <span
              style={{
                color: "#fff",
                background: "#7c3aed",
                borderRadius: 6,
                padding: "2px 10px",
                fontWeight: 700,
              }}
            >
              Recaps
            </span>
          ),
        },
      },
      {
        path: "account",
        element: <AccountPage />,
        handle: { breadcrumb: "Account" },
      },
    ],
  },
  {
    path: "/settings",
    element: (
      <AuthGuard>
        <HubPage />
      </AuthGuard>
    ),
    handle: { breadcrumb: "Settings" },
    children: [
      {
        path: "roles",
        element: <RolesPage />,
        handle: { breadcrumb: "Roles" },
      },
      {
        path: "permissions",
        element: <PermissionsPage />,
        handle: { breadcrumb: "Permissions" },
      },
    ],
  },
  {
    path: "/forgot-password",
    element: (
      <GuestGuard>
        <ForgotPassword />
      </GuestGuard>
    ),
    handle: { breadcrumb: "Forgot Password" },
  },
  {
    path: "/reset-password",
    element: (
      <GuestGuard>
        <ResetPassword />
      </GuestGuard>
    ),
    handle: { breadcrumb: "Reset Password" },
  },
  {
    path: "/subscribe",
    element: <Subscribe />,
    handle: { breadcrumb: "Subscribe" },
  },
  {
    path: "/verify-account",
    element: <VerifyAccount />,
    handle: { breadcrumb: "Verify Account" },
  },
  {
    path: "/subscribe/success",
    element: <SubscribeSuccess />,
  },
]);
