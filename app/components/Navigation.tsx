import { Form, NavLink, useNavigate } from "@remix-run/react";

export default function Navigation({ context }: any) {
  const { session } = context;
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
        {session?.user ? (
          <li>
            <Form
              id="logoutForm"
              action={`/logout/${session.user.id}`}
              method="post"
            >
              <button type="submit" className="btn btn-xs btn-error">Logout</button>
            </Form>
          </li>
        ) : (
          <div className=""></div>
        )}
      </ul>
    </nav>
  );
}
