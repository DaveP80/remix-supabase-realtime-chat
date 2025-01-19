import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Chat } from "~/components/Chat";
import type { Message } from "~/types";
import { getOrCreateSessionId } from "~/utils/auth.server";
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
  const { getHeaders } = await getOrCreateSessionId(request);

  const { message, messageId } = Object.fromEntries(await request.formData());
  if (message) {
    const updatedObject = { content: message, user_id: session?.user.id };

    await supabase.from("messages").insert([updatedObject]);
  }
  if (messageId) {
    await supabase.from("messages").delete().eq("id", messageId);
  }
  return json(null, {
    headers: {
      "Set-Cookie": await getHeaders(),
    },
  });
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw redirect("/");
  }
  const { data } = await supabase.from("messages").select("*");

  return json({ messages: data ?? [] }, { headers: response.headers });
};

const Index = () => {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto md:w-[800px] h-screen">
      <>
        <Chat messages={messages as Message[]} />
      </>
    </div>
  );
};

export default Index;
