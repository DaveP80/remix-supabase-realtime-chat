import { useLocation, useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export function useProtectedRoute(session: any) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem(session?.user.id || "");
    if (userId === null && location.pathname.includes("gpt")) {
      navigate("/");
    }
  }, []);

  return { isAuthenticated: undefined };
}
