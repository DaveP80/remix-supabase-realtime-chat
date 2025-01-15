import { redirect } from "@remix-run/node";
import { getOrCreateSessionId } from "~/utils/auth.server";
import { getCache, setCache } from "~/utils/redis.server";

export async function loader({ request, params }: any) {
  const id = params.id;
  const { sessionId } = await getOrCreateSessionId(request);
  const gptErr = await getCache(`${sessionId}-submit`);
  if (gptErr) {
    await setCache(`${sessionId}-submit`, false, 3600);
    throw new Error();
  }
  
  if (!id) {
    throw new Response("Missing ID parameter", { status: 400 });
  } else {
      throw redirect("/");

  }
}

export default function Logout() {
  return null;
}