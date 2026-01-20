import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Tone } from "@/app/page";

const SingleInput = ({ 
    width,
    onChange, 
    value, 
    emptyPlaceholder, 
    textPlaceholder, 
    isLoading, 
    setIsLoading,
    onSubmit,
    onSuccess,
    tone,
} : {
    width?: string;
    onChange: (value: string) => void;
    value: string;
    emptyPlaceholder: string;
    textPlaceholder: string;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    onSubmit: ({ value, tone }: { value: string; tone: Tone | null }) => string | Promise<string>;
    onSuccess: (response: string) => void;
    tone: Tone | null;
}) => {
    return (
        <>
            <Input className={width ?? "w-56"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={emptyPlaceholder} />
            <Button
            disabled={!value || !tone || isLoading}
            onClick={async () => {
                try {
                setIsLoading(true);
                const res = await onSubmit({ value, tone });
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

export default SingleInput;