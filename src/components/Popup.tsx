import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
    trigger: ReactNode;
    title: string;
    description: string;
    buttonText?: string;
    input?: React.ComponentProps<typeof Input>;
    actionButton?: {
        button: React.ComponentProps<typeof Button>;
        text: string;
    }

}

export const Popup: React.FC<Props> = ({
    trigger, 
    title, 
    description,
    input,
    actionButton,
}) => {
    return (
    <Dialog>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-primary text-2xl font-extrabold">{title}</DialogTitle>
                <DialogDescription className="text-foreground font-extrabold">
                {description}
                </DialogDescription>
            </DialogHeader>
            {input && <Input {...input}></Input>}
            {actionButton && (
            <DialogFooter>
                <Button {...actionButton.button}>
                    {actionButton.text}
                </Button>
            </DialogFooter>
            )}
        </DialogContent>
    </Dialog>
    )
}