import type { Pack as ApiPack } from "@/api"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import type { JSX } from "react";

type Props = {
  pack?: ApiPack;
}

export const Pack: React.FC<Props> = ({ pack }) => {
    let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
    let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;

    if (pack) {
      title = pack.name;
      img = <img src={pack.image_url} className="w-[15rem]" />;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {img}
        </CardContent>
      </Card>
    )
}
