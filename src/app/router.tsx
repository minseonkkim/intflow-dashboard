import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PenDetailPage from "@/pages/PenDetailPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <DashboardPage /> },
  { path: "/pens/:penId", element: <PenDetailPage /> },
]);
