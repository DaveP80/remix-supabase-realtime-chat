import type { V2_MetaFunction } from "@remix-run/node";
import {
  useOutletContext,
} from "@remix-run/react";
import { Login } from "~/components/Login";
import type { OutletContext } from "~/types";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Remix Supabase Realtime Chat" }];
};

export default function Index() {
  const { session, supabase } = useOutletContext<OutletContext>();

  return (
    <>
      {!session?.user ? (
        <Login />
      ) : (
        <div className="container mx-auto md:w-[800px] h-screen">
          Welcome to multi view chat program.
        </div>
      )}
    </>
  );
}
