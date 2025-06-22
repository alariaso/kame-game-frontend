import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

type Props = React.ComponentProps<typeof Input>

export const Search: React.FC<Props> = ({ className, ...rest }) => (
	<label className="relative">
		<SearchIcon className="size-4 absolute top-1/2 -translate-y-1/2 left-2" />
		<Input className={cn("pl-7 border-primary", className)} {...rest} />
	</label>
)
