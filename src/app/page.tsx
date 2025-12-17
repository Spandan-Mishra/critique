"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import analyzeSpotify from "./actions/spotify";
import analyzeAnime from "./actions/anime";
import analyzeGithub from "./actions/github";
import analyzeLetterboxd from "./actions/letterboxd";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { motion, AnimatePresence, Variants } from "framer-motion";
import FireBackground from "@/components/fire-background";
import { Spinner } from "@/components/ui/spinner";
import CritiqueModal from "@/components/critique-modal";
import { analyzeChess } from "./actions/chess";

export enum Tone {
  summarise = "summarise",
  criticism = "constructive_criticism",
  roast = "roast"
}

export enum Mode {
  spotify = "spotify",
  anime = "anime",
  github = "github",
  letterboxd = "letterboxd",
  chess = "chess",
}

const containerVariants: Variants = {
  hidden: { opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    }
  },
}

export default function Home() {
  const [tone, setTone] = useState<null | Tone>(null);
  const [mode, setMode] = useState<Mode>(Mode.spotify);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [critiqueResult, setCritiqueResult] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setUsername("");
  }, [mode]);

  const handleSuccess = (text: string) => {
    setCritiqueResult(text);
    setShowDialog(true);
    setIsLoading(false);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans dark:text-white"
    >

      <motion.div variants={itemVariants} className="absolute bottom-5 right-8">
          <AnimatedThemeToggler className="shadow-xl/30 dark:shadow-white/30 rounded-full p-2" />
        </motion.div>

      <AnimatePresence>
        {tone === Tone.roast && (
          <motion.div
            key="fire-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <FireBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <CritiqueModal
        isOpen={showDialog} 
        onClose={() => setShowDialog(false)} 
        critique={critiqueResult} 
      />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full">
        <motion.h1 variants={itemVariants} className="text-9xl font-hero">
          Critique.
        </motion.h1>

        <motion.h2 variants={itemVariants} className="test-2xl text-muted-foreground">
          Get judged based on your media interests
        </motion.h2>

        <motion.div variants={itemVariants}>
          <ToggleGroup value={mode} type="single" variant="outline" onValueChange={value => value && setMode(value as Mode)} defaultValue={Mode.spotify}>
            {Object.values(Mode).map((mode) => {
              return <ToggleGroupItem key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</ToggleGroupItem>
            })}
          </ToggleGroup>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Select onValueChange={(value) => setTone(value as Tone)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Tone).map((tone) => {
                  if (tone === "roast") {}
                  return <SelectItem key={tone} value={tone}>{tone.replace("_", " ").charAt(0).toUpperCase() + tone.replace("_", " ").slice(1)}</SelectItem>
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </motion.div>
        
        <div className="h-30 w-full flex justify-center items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10, filter: "blur(5px)", transition: { duration: 0.2 } }}
              className="flex flex-col gap-4 w-full justify-center items-center"
            >
              {mode === Mode.spotify ? (
                session ? (
                  <>
                    <Button className="-mb-4" onClick={() => signOut()}>Sign out</Button>
                    <div className="m-4">
                      <Button 
                        disabled={!tone || isLoading}
                        onClick={async () => {
                          if (!session || !session.accessToken) {
                            toast.error("Please login first");
                            return ;
                          }

                          try {
                              setIsLoading(true);
                              const res = await analyzeSpotify({ accessToken: session.accessToken, tone: tone! });
                              handleSuccess(res);
                          } catch (error) {
                              toast.error("Error generating response");
                          } finally {
                              setIsLoading(false);
                          }
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Spinner />
                            Critiquing...
                          </>
                          ) : "Critique my music"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button onClick={() => signIn("spotify")}>
                      Login with Spotify
                    </Button>
                    <span className="shrink-0 text-xs text-muted-foreground px-2">OR</span>
                    <Button 
                      variant="outline"
                      className="text-muted-foreground hover:text-foreground" 
                      onClick={() => signIn("spotify", undefined, { show_dialog: "true" })}
                    >
                      Switch Account
                    </Button>
                  </>
                )
              ) : mode === Mode.anime ? (
                <>
                  <Input className="w-56" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your MAL username" />
                  <Button
                    disabled={!username || !tone || isLoading}
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const res = await analyzeAnime({ username, tone: tone! });
                        handleSuccess(res);
                      } catch(error) {
                        toast.error("Error generating response");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Critiquing...
                      </>
                      ) : "Critique my anime"}
                  </Button>
                </>
              ) : mode === Mode.github ? (
                <>
                  <Input className="w-62.5" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Github username" />
                  <Button
                    disabled={!username || !tone || isLoading}
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const res = await analyzeGithub({ username, tone: tone! });
                        handleSuccess(res);
                      } catch(error) {
                        toast.error("Error generating response");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Critiquing...
                      </>
                      ) : "Critique my Github"}
                  </Button>
                </>
              ) : mode === Mode.letterboxd ? (
                <>
                  <Input className="w-71" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Letterboxd username" />
                  <Button
                    disabled={!username || !tone}
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const res = await analyzeLetterboxd({ username, tone: tone! });
                        handleSuccess(res);
                      } catch(error) {
                        toast.error("Error generating response");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Critiquing...
                      </>
                      ) : "Critique my movies"}
                  </Button>
                </>
              ) : mode === Mode.chess ? (
                <>
                  <Input className="w-70" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Chess.com username" />
                  <Button
                    disabled={!username || !tone || isLoading}
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const res = await analyzeChess({ username, tone: tone! });
                        handleSuccess(res);
                      } catch(error) {
                        toast.error("Error generating response", error instanceof Error ? { description: error.message } : undefined);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Critiquing...
                      </>
                      ) : "Critique my chess"}
                  </Button>
                </>
              ): null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
