import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { TypingAnimation } from "./ui/typing-animation";
import { DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { toast } from "sonner";

const fileToBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface CritiqueModalProps {
    isOpen: boolean;
    onClose: () => void;
    critique: string;
}

export default function CritiqueModal({ isOpen, onClose, critique }: CritiqueModalProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    const handleCopyImage = async () => {
        if (!contentRef) return;

        try {
            setIsCopying(true);

            const grenzeB64 = await fileToBase64(window.location.origin + "/fonts/Grenze-Regular.ttf");
            const spaceMonoB64 = await fileToBase64(window.location.origin + "/fonts/SpaceMono-Regular.ttf");

            const fontCss = `
                @font-face {
                font-family: 'Grenze';
                src: url('${grenzeB64}') format('truetype');
                font-weight: bold;
                font-style: normal;
                }
                @font-face {
                font-family: 'Space Mono';
                src: url('${spaceMonoB64}') format('truetype');
                font-weight: normal;
                font-style: normal;
                }
            `;

            const blob = await toBlob(contentRef.current!, {
                cacheBust: true,
                backgroundColor: document.documentElement.classList.contains("dark") ? "#09090b" : "#ffffff",
                fontEmbedCSS: fontCss,
            });

            if (!blob) {
                throw new Error("Failed to generate image");
            }

            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            toast.success("Critique copied to clipboard as image!");
        } catch (error) {
            console.error("Error copying critique image:", error);
            toast.error("Failed to copy critique image. Please try again.");
        } finally {
            setIsCopying(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle hidden></DialogTitle>
            <DialogContent className="p-0 overflow-hidden border-border">
                <div
                    className={"bg-card text-card-foreground p-6 flex flex-col gap-4"}
                    ref={contentRef}
                >
                    <div className="flex items-center justify-center">
                        <h2 
                            className="text-4xl"
                            style={{ fontFamily: "'Grenze', serif" }}
                        >
                            Critique.
                        </h2>
                    </div>

                    <div 
                        className="min-h-25"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                        <TypingAnimation typeSpeed={20} duration={200}>{critique}</TypingAnimation>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 flex gap-2 justify-end border-t">
                    <Button variant="outline" onClick={onClose} disabled={isCopying}>
                        <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                    <Button onClick={handleCopyImage} disabled={isCopying}>
                        {isCopying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copy Critique
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}