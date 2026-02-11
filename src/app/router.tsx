import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AuthGuard from "@/routes/AuthGuard";
import PenDetailPage from "@/pages/PenDetailPage";

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
    path: "/pen/:penId",
    element: (
      <AuthGuard>
        <PenDetailPage />
      </AuthGuard>
    ),
  },
]);
