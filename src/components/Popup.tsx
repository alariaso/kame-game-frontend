import React, { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    children?: ReactNode;
    title: string;
    description: string;
    input?: React.ComponentProps<typeof Input>;
    actionButton?: {
        buttonProps: React.ComponentProps<typeof Button>;
        text: string;
    }
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const Popup: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    title,
    description,
    input,
    actionButton,
    open,
    onOpenChange
}) => {
    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-primary text-lg font-semibold">{title}</DialogTitle>
                <DialogDescription className="text-foreground text-sm leading-none font-medium">
                    {description}
                </DialogDescription>
            </DialogHeader>
            {input && <Input {...input}></Input>}
            {actionButton && (
            <DialogFooter>
                <Button {...actionButton.buttonProps}>
                    {actionButton.text}
                </Button>
            </DialogFooter>
            )}
        </DialogContent>
    </Dialog>
    )
}