import type { Card as ApiCard } from "@/api"
import {
  Card as SCard,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  card?: ApiCard;
}

export const Card: React.FC<Props> = ({ card }) => {
    let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
    let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;
    let priceAndStock: JSX.Element = <Skeleton className="" />

    if (card) {
      title = card.name;
      img = <img src={card.image_url} className="w-[15rem]" />;
      priceAndStock = (<div className="flex mt-4">
        <span className="text-primary">${card.price}</span>
        <span className="ml-auto">Stock: {card.stock}</span>
      </div>)
    }

    return (
      <SCard>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {img}
          {priceAndStock}
        </CardContent>
        <CardFooter>
          <CardAction className="w-full">
            <Button className="w-full">Agregar al carrito</Button>
          </CardAction>
        </CardFooter>
      </SCard>
    )
}
