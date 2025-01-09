import { createContext, useState } from "react";

type GlobalContextTypes = {
  promptArr: any[];
  setPromptArr: (args: any) => void;
} | undefined;

export const GlobalContext = createContext<GlobalContextTypes>(undefined);


export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [promptArr, setPromptArr] = useState([]);

  return (
    <GlobalContext.Provider value={{ promptArr, setPromptArr }}>
      {children}
    </GlobalContext.Provider>
  );
}