import { Form } from "@remix-run/react";
import type { GPTMessage } from "~/types";

interface ChatBubbleProps {
  message: GPTMessage;
  isGrouped?: boolean;
  key?: number | string;
}

export const GPTChatBubble = ({
  message,
  isGrouped = false,
}: ChatBubbleProps) => {

  const isCurrentUser = message.is_gpt ? true : false;

  return (
    <div className={`chat ${isCurrentUser ? "chat-start" : "chat-end"}`}>
      {!isCurrentUser && (
        <>
          <Form method="post">
            <input type="hidden" name="messageId" value={message.id} />
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Form>
        </>
      )}
      {!isGrouped ? (
        <>
          <div className="chat-image avatar"></div>
          <div className="chat-header mb-1">
            {!isCurrentUser ? "you" : "GPT"}
            <time className="text-xs opacity-50 ml-1">
              {new Date(message.created_at).toTimeString().slice(0, 5)}
            </time>
          </div>
        </>
      ) : (
        <>
          <div className="chat-image avatar">
          </div>
          <div className="chat-header mb-1">
            {!isCurrentUser ? "you" : "GPT"}
            <time className="text-xs opacity-50 ml-1">
              {new Date(message.created_at).toTimeString().slice(0, 5)}
            </time>
          </div>
        </>
      )}
      <div
        className={`chat-bubble ${isCurrentUser ? "chat-bubble-primary" : "bg-slate-500"
          }`}
      >
        {message.content}
      </div>
    </div>
  );
};
