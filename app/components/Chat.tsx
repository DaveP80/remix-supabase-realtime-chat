import { Form, useOutletContext } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { Message, OutletContext } from "~/types";
import { ChatBubble } from "./ChatBubble";

interface ChatProps {
  messages: Message[];
}

export const Chat = ({ messages: serverMessages }: ChatProps) => {
  const [messages, setMessages] = useState(serverMessages);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const { supabase } = useOutletContext<OutletContext>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const deletedMessage = payload.old as Message;
          setMessages(
            messages.filter((message) => message.id !== deletedMessage.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages, supabase]);

  useEffect(() => {
    if (!userHasScrolled && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, userHasScrolled]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isScrolledToBottom =
      Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    setUserHasScrolled(!isScrolledToBottom);
  };

  return (
    <div className="flex h-full flex-col my-1">
      <div
        className="flex flex-col flex-grow h-0 p-4 overflow-auto bg-blue-50 rounded-md"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((message, idx) => (
          <ChatBubble
            message={message}
            key={message.id}
            isGrouped={
              message.user_id === messages[idx - 1]?.user_id &&
              new Date(message.created_at).getTime() -
                new Date(messages[idx - 1]?.created_at).getTime() <
                60000
            }
          />
        ))}
      </div>
      <div className="mt-auto mb-5 py-2">
        <Form
          method="post"
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            formRef.current?.submit();
            formRef.current?.reset();
          }}
        >
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            name="message"
            ref={inputRef}
          />
        </Form>
      </div>
    </div>
  );
};
