import type { Product as ApiProduct } from "@/api"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  product?: ApiProduct;
}

export const Product: React.FC<Props> = ({ product }) => {
    let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
    let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;
    let priceAndStock: JSX.Element = <Skeleton className="" />

    if (product) {
      title = product.name;
      img = <img src={product.image_url} className="w-[15rem]" />;
      priceAndStock = (<div className="flex mt-4">
        <span className="text-primary">${product.price}</span>
        {product.category === "card" && <span className="ml-auto">Stock: {product.stock}</span>}
      </div>)
    }

    return (
      <Card>
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
      </Card>
    )
}
