import { useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect } from "react";
import { OutletContext } from "~/types";

export function useProtectedRoute() {
  const { supabase, session } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  useEffect(() => {
    const userId = localStorage.getItem(session?.user.id);
    if (userId === null) {
      navigate("/");
    }
  }, []);

  return { isAuthenticated: undefined };
}