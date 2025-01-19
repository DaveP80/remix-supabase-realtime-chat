import type { V2_MetaFunction } from "@remix-run/node";
import {
  useOutletContext,
} from "@remix-run/react";
import { Login } from "~/components/Login";
import gptImage from "~/gptlogo.jpeg";
import { OutletContext } from "~/types";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Remix Supabase Realtime Chat" }];
};

export default function Index() {
  const { session } = useOutletContext<OutletContext>();
  return (
    <>
      {!session?.user ? (
        <Login />
      ) : (
        <div className="container mx-auto md:w-[800px]">
          Welcome to multi view chat program.
          <h3>{session.user.user_metadata.name}</h3>
          <img src={gptImage}></img>
        </div>
      )}
    </>
  );
}
