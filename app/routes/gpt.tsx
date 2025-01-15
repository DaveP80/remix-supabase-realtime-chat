import { type LoaderArgs, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { GPTChat } from "~/components/GPTChat";
import type { ActionReturnType, GPTMessage } from "~/types";
import { getOrCreateSessionId } from "~/utils/auth.server";
import { setCache } from "~/utils/redis.server";
import { generateSummary } from "~/utils/summarizer.server";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export async function action({
  request
}: any): Promise<ActionReturnType> {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { sessionId, getHeaders } = await getOrCreateSessionId(request);
  const { gpt_message, messageId } = Object.fromEntries(
    await request.formData()
  );
  //GPT prompts and response will take a lot of time.
  gpt_message && await setCache(`${sessionId}-submit`, true, 3600);
  // Check if chart_data exists in form data
  try {
    if (gpt_message) {
      const summary = await generateSummary(gpt_message);
      if (summary) {
        await supabase.from("gpt_messages").insert([
          { content: gpt_message, user_id: session?.user.id, is_gpt: false },
          { content: summary, user_id: session?.user.id, is_gpt: true },
        ]);
        await setCache(`${sessionId}-submit`, false, 3600);
        return json({ summary, gpt_message }, {
          headers: {
            "Set-Cookie": await getHeaders(),
          },
        });
      } else {
        return json(
          { summary: null, gpt_message },
          {
            headers: {
              "Set-Cookie": await getHeaders(),
            },
          }
        );
      }
    }
    if (messageId) {
      await supabase.from("gpt_messages").delete().eq("id", messageId);
      return json(null, {
        headers: {
          "Set-Cookie": await getHeaders(),
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
  return json({ summary: "error", gpt_message }, {
    headers: {
      "Set-Cookie": await getHeaders(),
    },
  });
}

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw redirect("/");
  }
  const { data } = await supabase.from("gpt_messages").select("*");

  return json({ gpt_messages: data ?? [] }, { headers: response.headers });
};

const Index = () => {
  const actionData = useActionData<typeof action>();
  const { gpt_messages } = useLoaderData<typeof loader>();
  const summary = actionData?.summary;
  const gpt_message = actionData?.gpt_message;

  return (
    <div className="container mx-auto md:w-[800px] h-screen">
      <GPTChat
        messages={gpt_messages as GPTMessage[]}
        message_log={summary && gpt_message}
      ></GPTChat>
    </div>
  );
};

export default Index;