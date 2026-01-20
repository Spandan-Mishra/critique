import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const VersusInput = ({
    width,
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
} : {
    width?: string;
    onUser1Change: (value: string) => void;
    user1Value: string;
    onUser2Change: (value: string) => void;
    user2Value: string;
    emptyPlaceholder1: string;
    emptyPlaceholder2: string;
    textPlaceholder: string;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    onSubmit: ({ user1Value, user2Value }: { user1Value: string; user2Value: string }) => string | Promise<string>;
    onSuccess: (response: string) => void;
}) => {
    return (
        <>
            <div className="flex items-center justify-center gap-4">
                <Input className={width ?? "w-56"} value={user1Value} onChange={(e) => onUser1Change(e.target.value)} placeholder={emptyPlaceholder1} />
                <p className="text-5xl">vs</p>
                <Input className={width ?? "w-56"} value={user2Value} onChange={(e) => onUser2Change(e.target.value)} placeholder={emptyPlaceholder2} />
            </div>
            <Button
            disabled={!user1Value || !user2Value || isLoading}
            onClick={async () => {
                try {
                setIsLoading(true);
                const res = await onSubmit({ user1Value, user2Value });
                onSuccess(res);
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
                ) : textPlaceholder}
            </Button>
        </>
    )
}

export default VersusInput;