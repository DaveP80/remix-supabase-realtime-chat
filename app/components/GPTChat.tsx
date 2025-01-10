import { Form, useNavigation, useOutletContext } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import type { GPTMessage, OutletContext } from "~/types";
import { GPTChatBubble } from "./GPTChatBubble";
import { GlobalContext } from "~/context/context";

interface ChatProps {
  messages: GPTMessage[];
  message_log: string | null;
}

export const GPTChat = (
  { messages: serverMessages, message_log: any }: ChatProps
) => {
  const FormContext = useContext(GlobalContext);
  const [messages, setMessages] = useState(serverMessages);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [inputValue, setInputValue] = useState<any>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const { supabase, session } = useOutletContext<OutletContext>();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  console.log(FormContext?.promptVal)

  useEffect(() => {
    if (!messages.find((item) => item.id == -1)){
      setIsDisabled(false);
      setInputValue(FormContext?.promptVal);
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "gpt_messages" },
        (payload) => {
          const newMessage = payload.new as GPTMessage;
          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "gpt_messages" },
        (payload) => {
          const deletedMessage = payload.old as GPTMessage;
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

  useEffect(() => {
    if (isDisabled) {
      FormContext?.setPromptVal(inputValue || "");
      setInputValue("");
    }
  }, [isDisabled]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isScrolledToBottom =
      Math.abs(scrollHeight - clientHeight - scrollTop) < 10;

    setUserHasScrolled(!isScrolledToBottom);
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex flex-col flex-grow h-0 p-4 overflow-auto bg-blue-50 rounded-md"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.map((message, idx) => (
          <GPTChatBubble
            message={message}
            key={message?.id}
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
          action="/gpt"
          ref={formRef}
          onSubmit={(e) => {
            if (isDisabled || inputValue == "") {
              e.preventDefault();
              return;
            }
            e.preventDefault();
            const userData = messages.length > 1 && messages.find(item => item?.user_id)?.user_id;
            formRef.current?.submit();
            formRef.current?.reset();
            setMessages([...messages, {content: inputValue, created_at: new Date().toString(), id: -1, is_gpt: false, user_id: userData?.toString()||""}])
            setIsDisabled(true);
          }}
          
        >
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
            name="gpt_message"
            ref={inputRef}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
        </Form>
      </div>
    </div>
  );
};
