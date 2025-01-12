import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"], // In production, use actual secure secrets
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("supabase-auth-token", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("supabase-auth-token");
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = "/"
) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect(redirectTo);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

function hasSupabaseAuthCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return cookieHeader?.includes("supabase-auth-token") ?? false;
}

export function protectChatRoute(request: any, type: string) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  let isAuth = hasSupabaseAuthCookie(request);
  if (!isAuth && pathname.includes(type)) {
    throw redirect("/logout");
  }
}
