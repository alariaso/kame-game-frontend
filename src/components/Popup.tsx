import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

type Props = {
    open: boolean;
    setOpen: (state: boolean) => void;
}
export const Popup: React.FC<React.PropsWithChildren<Props>> = ({ open, setOpen, children }) => {
    const { user, update } = useUser();
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const amountAsNumber = Number(amount);

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // validate input
        if (user) {
            if (!amount || isNaN(amountAsNumber) || amountAsNumber <= 0) {
                setError("Valor incorrecto");
                toast.error("Valor incorrecto");
                return;
            }

            try {
                setLoading(true);
                await update({...user, yugiPesos: user.yugiPesos + amountAsNumber});
                setOpen(false);
                setError("");
                toast.success("Fondos añadidos");
            } catch (err) {
                console.log(error); // eslint error
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(errorMessage);
                toast.error(errorMessage)
            } finally {
                setLoading(false);
                setAmount("");
            }
        }
    }

    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-primary text-lg font-semibold">Recargar Yugi Pesos</DialogTitle>
                <DialogDescription className="text-foreground text-sm leading-none font-medium">
                    Aca puedes recargar Yugi Pesos a tu cuenta
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddFunds} className="mt-2">
                <Label htmlFor="amount">
                </Label>
                <Input
                    id="amount"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-primary"
                    value={amount}
                    type="number"
                    placeholder="Cantidad a recargar"
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                >
                </Input>
                <DialogFooter className="mt-4">
                    <Button type="submit" disabled={loading}>
                        Recargar
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
    )
}