import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<React.ComponentProps<"p">>;

export const P: React.FC<Props> = ({ children, className, ...rest }) => <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...rest}>{children}</p>
