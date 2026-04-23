/**
 * ProtectedRoute.tsx
 * Wraps portal pages to ensure only authenticated users can access them.
 * Redirects unauthenticated visitors to the appropriate login page.
 * Shows a spinner while the session is being resolved.
 */

import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Where to redirect if not authenticated */
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/donor/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // While Supabase resolves the session, show a centered spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p className="text-gray-500 text-sm font-medium">Verifying session…</p>
      </div>
    );
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
