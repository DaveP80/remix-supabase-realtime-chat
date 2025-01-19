import { useOutletContext } from "@remix-run/react";
import useLogout from "~/hooks/logout";
import { OutletContext } from "~/types";

export async function action({ params }: any) {
  const id = params.id;
  if (!id) {
    throw new Response("Missing ID parameter", { status: 400 });
  } 
  return null;
}

export default function Logout() {
  const {supabase, session} = useOutletContext<OutletContext>();
  useLogout(supabase, session)
  return null;
}