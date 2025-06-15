import { InventoryCard } from "@/components/InventoryCard";
import { ProductBrowser } from "@/components/ProductBrowser";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";

export const Inventory: React.FC = () => {
  return (
    <div className="py-10">
      <H1>Tu Inventario</H1>
      <P className="text-center">Administra tus cartas y mazos para crear las estrategias más poderosas.</P>
      <ProductBrowser categories={["Mis cartas"]} productComponent={InventoryCard} />
    </div>
  );
}
