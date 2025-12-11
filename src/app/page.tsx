"use client";

import { useState } from "react";
import testConnection from "./actions/test";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import analyzeSpotify from "./actions/spotify";
import analyzeAnime from "./actions/anime";
import analyzeGithub from "./actions/github";
import analyzeLetterboxd from "./actions/letterboxd";

export enum Tone {
  summarise = "summarise",
  criticism = "constructive_criticism",
  roast = "roast"
}

export enum Mode {
  spotify = "spotify",
  anime = "anime",
  github = "github",
  letterboxd = "letterboxd"
}

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<null | Tone>(null);
  const [mode, setMode] = useState<Mode>(Mode.spotify);
  const [username, setUsername] = useState("");
  const { data: session } = useSession();

  return (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl">Critique.</h1>

      <Textarea className="w-1/2" value={text} onChange={(e) => setText(e.target.value)}></Textarea>
      <Button
        onClick={async () => {
          try {
            const response = await testConnection(text, "roast");
            toast.success(response as string);
          } catch (error) {
            toast.error("Error generating response");
          }
        }}
      >
        Submit
      </Button>

      <ToggleGroup type="single" onValueChange={value => setMode(value as Mode)} defaultValue={Mode.spotify}>
        {Object.values(Mode).map((mode) => {
          return <ToggleGroupItem key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</ToggleGroupItem>
        })}
      </ToggleGroup>
      
      <Select onValueChange={(value) => setTone(value as Tone)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(Tone).map((tone) => {
              return <SelectItem key={tone} value={tone}>{tone.replace("_", " ").charAt(0).toUpperCase() + tone.replace("_", " ").slice(1)}</SelectItem>
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {mode === Mode.spotify ? (
        session ? (
          <div>
            Welcome user
            <Button onClick={() => signOut()}>Sign out</Button>
            <div className="m-4">
              <Button 
                disabled={!tone}
                onClick={async () => {
                  if (!session || !session.accessToken) {
                    toast.error("Please login first");
                    return ;
                  }

                  try {
                      const res = await analyzeSpotify({ accessToken: session.accessToken, tone: tone! });
                      toast.success(res);
                  } catch (error) {
                      toast.error("Error generating response");
                  }
                }}
              >Critique my musix</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => signIn("spotify")}>
            Login with Spotify
          </Button>
        )
      ) : mode === Mode.anime ? (
        <div>
          <Input onChange={(e) => setUsername(e.target.value)} placeholder="Enter your MAL username" />
          <Button
            disabled={!username || !tone}
            onClick={async () => {
              try {
                const res = await analyzeAnime({ username, tone: tone! });
                toast.success(res);
              } catch(error) {
                toast.error("Error generating response");
              }
            }}
          >
            Critique my anime
          </Button>
        </div>
      ) : mode === Mode.github ? (
        <div>
          <Input onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Github username" />
          <Button
            disabled={!username || !tone}
            onClick={async () => {
              try {
                const res = await analyzeGithub({ username, tone: tone! });
                toast.success(res);
              } catch(error) {
                toast.error("Error generating response");
              }
            }}
          >
            Critique my Github
          </Button>
        </div>
      ) : mode === Mode.letterboxd ? (
        <div>
          <Input onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Letterboxd username" />
          <Button
            disabled={!username || !tone}
            onClick={async () => {
              try {
                const res = await analyzeLetterboxd({ username, tone: tone! });
                toast.success(res);
              } catch(error) {
                toast.error("Error generating response");
              }
            }}
          >Critique my movies</Button>
        </div>
      ) : null}
    </div>
  );
}
