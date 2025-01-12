import { redirect } from "@remix-run/node";

export const loader = ({request}: any) =>{ 
    
    const g = new URL(request.url);
    const err = g.searchParams.get("err");
    
    if (err?.includes("chat") || err?.includes("gpt")) {
        throw new Error();
    }
    
    return redirect("/");

}