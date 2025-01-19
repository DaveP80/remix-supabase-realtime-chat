import { redirect } from "@remix-run/node";

export async function loader({ params }: any) {
  const id = params.id;
  if (!id) {
    throw new Response("Missing ID parameter", { status: 400 });
  } else {
      throw redirect("/");
  }
}

export default function Logout() {
  return null;
}