import { type LoaderArgs, json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { type ActionFunctionArgs } from "react-router";
import { GPTChat } from "~/components/GPTChat";
import type { ActionReturnType, GPTMessage } from "~/types";
import { protectChatRoute } from "~/utils/auth.server";
import { generateSummary } from "~/utils/summarizer.server";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionReturnType> {
  const response = new Response();
  const supabase = createSupabaseServerClient({ request, response });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { gpt_message, messageId } = Object.fromEntries(
    await request.formData()
  );
  // Check if chart_data exists in form data
  try {
    if (gpt_message) {
      const summary = await generateSummary(gpt_message);
      if (summary) {
        await supabase.from("gpt_messages").insert([
          { content: gpt_message, user_id: session?.user.id, is_gpt: false },
          { content: summary, user_id: session?.user.id, is_gpt: true },
        ]);
        return json({ summary, gpt_message }, { headers: response.headers });
      } else {

        return json(
          { summary: null, gpt_message },
          { headers: response.headers }
        );
      }
    }
    if (messageId) {
      await supabase.from("gpt_messages").delete().eq("id", messageId);
      return json(null, { headers: response.headers });
    }
  } catch (e) {
    console.log(e);
  }
  return json({ summary: "error", gpt_message }, { headers: response.headers });
}

export const loader = async ({ request }: LoaderArgs) => {
  protectChatRoute(request, "gpt");
  const response = new Response();

  const supabase = createSupabaseServerClient({ request, response });

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
      <>
        <GPTChat
          messages={gpt_messages as GPTMessage[]}
          message_log={summary && gpt_message}
        ></GPTChat>
      </>
    </div>
  );
};

export default Index;
