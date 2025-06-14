import { cn } from "@/lib/utils"

type Props = React.PropsWithChildren<React.ComponentProps<"h2">>

export const H2: React.FC<Props> = ({ children, className }) => <h2 className={cn("scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0", className)}>{children}</h2>