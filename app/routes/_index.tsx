import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { Chat } from "~/components/Chat";
import { Login } from "~/components/Login";
import { handleLogout, handleNavigate } from "~/hooks/chat";
import type { Message, OutletContext } from "~/types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Remix Supabase Realtime Chat" }];
};

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { message, messageId } = Object.fromEntries(await request.formData());
  if (message) {
    const updatedObject = { content: message, user_id: session?.user.id };

    await supabase.from("messages").insert([updatedObject]);
  }
  if (messageId) {
    await supabase.from("messages").delete().eq("id", messageId);
  }
  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });

  const { data } = await supabase.from("messages").select("*");

  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  const { session, supabase } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto md:w-[800px] h-screen">
      {!session?.user ? (
        <Login />
      ) : (
        <>
          <div className="my-2 flex space-x-1">
            <button
              className="btn btn-xs btn-error"
              onClick={() => handleLogout(supabase)}
            >
              Logout
            </button>

            <button
              className="btn btn-xs btn-error"
              onClick={() => handleNavigate(navigate, "gpt")}
            >
              GPTchat
            </button>
          </div>
          <Chat messages={messages as Message[]} />
        </>
      )}
    </div>
  );
}
