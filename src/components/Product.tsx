import { removeFromCart, type Product as ApiProduct } from "@/api"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

type Props = {
  product?: ApiProduct;
}

export const Product: React.FC<Props> = ({ product }) => {
  const { cart, loading: cartLoading, addToCart, removeFromCart } = useCart();
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const handleButton = async () => {
    if (!product) return;

    setAddToCartLoading(true)
    if (cart.includes(product.id)) {
      await removeFromCart({ productId: product.id })
    } else {
      await addToCart({ productId: product.id })
    }
    setAddToCartLoading(false)
  }

  let inCart = false;
  let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
  let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;
  let priceAndStock: JSX.Element = <Skeleton className="" />

  if (product) {
    inCart = cart.includes(product.id);
    title = product.name;
    img = <img src={product.image_url} className="w-[15rem]" />;
    priceAndStock = (<div className="flex mt-4">
      <span className="text-primary">${product.price}</span>
      {product.category === "card" && <span className="ml-auto">Stock: {product.stock}</span>}
    </div>)
  }

  const loading = cartLoading || addToCartLoading || !product;

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
          <Button onClick={handleButton} className="w-full" variant={loading ? "secondary" : (inCart ? "secondary" : "default")}>
            {loading ? "Cargando..." : (inCart ? "Eliminar del carrito" : "Agregar al carrito")}
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  )
}
