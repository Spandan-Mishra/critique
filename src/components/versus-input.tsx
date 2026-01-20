import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Swords } from "lucide-react";

const VersusInput = ({
  onUser1Change,
  user1Value,
  onUser2Change,
  user2Value,
  emptyPlaceholder1,
  emptyPlaceholder2,
  textPlaceholder,
  isLoading,
  setIsLoading,
  onSubmit,
  onSuccess,
}: {
  onUser1Change: (value: string) => void;
  user1Value: string;
  onUser2Change: (value: string) => void;
  user2Value: string;
  emptyPlaceholder1: string;
  emptyPlaceholder2: string;
  textPlaceholder: string;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSubmit: ({
    user1Value,
    user2Value,
  }: {
    user1Value: string;
    user2Value: string;
  }) => string | Promise<string>;
  onSuccess: (response: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
            User 1
          </label>
          <Input
            className="h-12 bg-background/50 border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20 transition-all text-center md:text-left"
            value={user1Value}
            onChange={(e) => onUser1Change(e.target.value)}
            placeholder={emptyPlaceholder1}
          />
        </div>

        <div className="flex justify-center items-center py-2 md:py-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl shadow-lg ring-4 ring-background z-10">
            VS
          </div>
          <div className="absolute inset-0 flex items-center justify-center -z-0 md:hidden">
            <div className="w-px h-full bg-border" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1 md:text-right">
            User 2
          </label>
          <Input
            className="h-12 bg-background/50 border-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20 transition-all text-center md:text-right"
            value={user2Value}
            onChange={(e) => onUser2Change(e.target.value)}
            placeholder={emptyPlaceholder2}
          />
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-12 font-semibold shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        disabled={!user1Value || !user2Value || isLoading}
        onClick={async () => {
          try {
            setIsLoading(true);
            const res = await onSubmit({ user1Value, user2Value });
            onSuccess(res);
          } catch (error) {
            toast.error("Error generating response");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Simulating Battle...
          </>
        ) : (
          <>
            {textPlaceholder}
          </>
        )}
      </Button>
    </div>
  );
};

export default VersusInput;