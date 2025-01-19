import { NavLink, useNavigate } from "@remix-run/react";
import { handleLogout } from "~/hooks/chat";

export default function Navigation({ context }: any) {
  const navigate = useNavigate();
  const { supabase, session } = context;
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/gpt"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            GPT
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 ${isActive ? "font-bold" : ""}`
            }
          >
            Google Chat
          </NavLink>
        </li>
        { session?.user ? (
          <li>
            <button
              className="btn btn-xs btn-error"
              onClick={() => handleLogout(supabase, session, navigate)}
            >
              Logout
            </button>
          </li>
        ) : (
          <div className=""></div>
        )}
      </ul>
    </nav>
  );
}
