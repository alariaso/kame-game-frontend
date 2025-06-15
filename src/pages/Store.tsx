import { Product } from "@/components/Product";
import { ProductBrowser } from "@/components/ProductBrowser";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";

export const Store: React.FC = () => {
  return (
    <div className="py-10">
      <H1>Tienda de cartas</H1>
      <P className="text-center">Explora nuestra colección de cartas místicas y poderosas. Encuentra las piezas perfectas para tu estrategia.</P>
      <ProductBrowser categories={["Cartas Individuales", "Paquetes"]} productComponent={Product} />
    </div>
  );
}
