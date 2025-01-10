import { createContext, useState } from "react";

type GlobalContextTypes = {
  promptVal: string;
  setPromptVal: (args: any) => void;
} | undefined;

export const GlobalContext = createContext<GlobalContextTypes>(undefined);


export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [promptVal, setPromptVal] = useState("");

  return (
    <GlobalContext.Provider value={{ promptVal, setPromptVal }}>
      {children}
    </GlobalContext.Provider>
  );
}