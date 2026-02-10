import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PenDetailPage from "@/pages/PenDetailPage";
import AuthGuard from "@/routes/AuthGuard";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: "/pens/:penId",
    element: (
      <AuthGuard>
        <PenDetailPage />
      </AuthGuard>
    ),
  },
]);
