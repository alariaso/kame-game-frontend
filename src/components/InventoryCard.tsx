import { type InventoryCard as ApiInventoryCard } from "@/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { type JSX } from "react";

type Props = {
  product?: ApiInventoryCard;
}

export const InventoryCard: React.FC<Props> = ({ product }) => {
  let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
  let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;

  if (product) {
    title = product.name;
    img = <img src={product.image_url} className="w-[15rem] h-[22rem]" />;
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
