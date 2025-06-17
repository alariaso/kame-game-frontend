import { type Product as ApiProduct } from "@/api"
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
import { useUser } from "@/context/AuthContext";
import { useLocation, useNavigate } from "react-router";

type Props = {
  product?: ApiProduct;
}

export const Product: React.FC<Props> = ({ product }) => {
  const { cart, loading: cartLoading, addToCart, removeFromCart } = useCart();
  const { user } = useUser();
  const [addRemoveLoading, setAddRemoveLoading] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()

  const handleButton = async () => {
    if (!product) return;

    if (!user) {
      await navigate("/login", {state: {"prevLocation": location}})
      return;
    }

    setAddRemoveLoading(true)
    if (cart.includes(product.id)) {
      await removeFromCart({ productId: product.id })
    } else {
      await addToCart({ productId: product.id })
    }
    setAddRemoveLoading(false)
  }

  let inCart = false;
  let title: string | JSX.Element = <Skeleton className="h-4 w-[15rem] rounded-none bg-secondary" />;
  let img: JSX.Element = <Skeleton className="h-[22rem] w-[15rem] rounded-md bg-secondary" />;
  let price: JSX.Element = <Skeleton className="h-6 w-6 bg-secondary" />
  let stock: JSX.Element = <Skeleton className="h-6 w-18 bg-secondary ml-auto" />

  if (product) {
    inCart = user ? cart.includes(product.id) : false;
    title = product.name;
    img = <img src={product.image_url} className="w-[15rem] h-[22rem]" />;
    price = <span className="text-primary">${product.price}</span>
    if (product.category === "card") {
      stock = <span className="ml-auto">Stock: {product.stock}</span>
    } else {
      stock = <></>
    }
  }

  const loading = cartLoading || addRemoveLoading || !product;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {img}
        <div className="flex mt-4">
          {price}
          {stock}
        </div>
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
