import {  useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export function useProtectedRoute(session: any) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem(session?.user?.id || "");
    if (userId === null) {
      navigate("/");
    }
  }, []);

  return { isAuthenticated: undefined };
}
