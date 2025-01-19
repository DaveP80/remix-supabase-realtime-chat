import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/types";

export const Login = () => {
  const { supabase } = useOutletContext<OutletContext>();

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`
      }
    });
  };

  return (
    <div className="flex h-full items-center justify-center">
      <button className="btn btn-primary btn-wide" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};
