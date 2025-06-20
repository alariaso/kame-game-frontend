import type { LucideIcon } from "lucide-react";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";

type Props = {
    header: {
        title: string;
        description?: string;
        icon?: LucideIcon;
    }
    footer?: React.ReactNode;
}

export const FormContainer: React.FC<React.PropsWithChildren<Props>> = ({ header, footer, children }) => {
    const Icon = header.icon;

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center items-center">
            <div className="bg-[#1E1E1EE5] w-full max-w-md px-10 py-8 rounded-lg space-y-6">
                <div>
                    {Icon && <>
                        <div className="mx-auto rounded-full bg-primary/20 h-12 w-12 flex justify-center items-center">
                            <Icon className="text-primary h-6 w-6"/>
                        </div>
                    </>}
                    <H1>{header.title}</H1>
                    <P className="text-center">{header.description}</P>
                </div>
                {children}
                {footer && <>
                    {footer}
                </>}
            </div>
        </div>
    )

}