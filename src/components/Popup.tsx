import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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

    const handleAddFunds = async () => {
        // validate input
        if (user) {
            if (!amount || isNaN(amountAsNumber) || amountAsNumber <= 0) {
                setError("Valor incorrecto");
                toast.error("Valor incorrecto"); // FIXME: si se presiona enter muchas veces se ejecuta justo cuando se esta cerrando el popup
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
                    Ingresa la cantidad a recargar
                </DialogDescription>
            </DialogHeader>
                <Input
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={amount}
                    type="number"
                    placeholder="Cantidad a recargar"
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) handleAddFunds();
                    }}
                >
                </Input>
            <DialogFooter>
                <Button onClick={handleAddFunds} disabled={loading}>
                    Recargar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}