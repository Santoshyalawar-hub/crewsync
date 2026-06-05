import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/apiClient";
import { getStoredRole, isTokenValid } from "./app/authGuard";

/**
 * Redirect.jsx — resolve where to send the user after login.
 * The app uses in-memory routing via AppShell (not URL-based navigation),
 * so all authenticated users always land at "/" which renders AppShell.
 */
export default function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const resolve = async () => {
      // If we already have a valid token in storage, go home
      if (isTokenValid()) {
        navigate("/", { replace: true });
        return;
      }

      // Otherwise try to validate token against backend
      try {
        await api.get("/api/auth/me");
        navigate("/", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };

    resolve();
  }, [navigate]);

  return null;
}
