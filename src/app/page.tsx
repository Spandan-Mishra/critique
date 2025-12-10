"use client";

import { useState } from "react";
import testConnection from "./actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const [text, setText] = useState("");
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl">Critique.</h1>

      <Textarea className="w-1/2" value={text} onChange={(e) => setText(e.target.value)}></Textarea>
      <Button
        onClick={async () => {
          try {
            const response = await testConnection(text, "roast");
            toast.success(response);
          } catch (error) {
            toast.error("Error generating response");
          }
        }}
      >
        Submit
      </Button>

      {session ? (
        <div>
          Welcome user
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <button onClick={() => signIn("spotify")}>
          Login with Spotify
        </button>
      )}
    </div>
  );
}
