import { getCards, getPacks, type Card as ApiCard, type Pack as ApiPack } from "@/api";
import { Card } from "@/components/Card";
import { Pack } from "@/components/Pack";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonGroup } from "@/elements/ButtonGroup";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";
import { Search } from "@/elements/Search";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type ProductCategory = "Cartas Individuales" | "Paquetes";

export const Store: React.FC = () => {
  const [ productCategory, setProductCategory ] = useState<ProductCategory>("Cartas Individuales");
  const [ cards, setCards ] = useState<ApiCard[]>([]);
  const [ packs, setPacks ] = useState<ApiPack[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ page, setPage ] = useState(1);
  const [ searchParams ] = useSearchParams();

  const handleProductCategoryChange = (option: ProductCategory) => {
    setProductCategory(option)
  }

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setPage(parseInt(page))
    }
  }, [searchParams])

  useEffect(() => {
    setLoading(true)

    async function loadCards() {
      try {
        const cards = await getCards({ page, itemsPerPage: 20 })
        setCards(cards)
        setError("")
      } catch (err) {
        setCards([])
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage)
      }
      setLoading(false)
    }

    async function loadPacks() {
      try {
        const packs = await getPacks({ page, itemsPerPage: 20 });
        setPacks(packs)
      } catch (err) {
        setPacks([])
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage)
      }
      setLoading(false)
    }

    if (productCategory == "Cartas Individuales") {
      loadCards()
    } else {
      loadPacks()
    }
  }, [productCategory, page])

  let content;

  if (productCategory == "Cartas Individuales") {
    content = cards.map(card => (
      <Card key={card.id} card={card} />
    ))
  } else {
    content = packs.map(pack => (
      <Pack key={pack.id} pack={pack} />
    ))
  }

  if (error.length == 0 && content.length == 0) {
    content.push(<p>No se encontraron {productCategory}</p>)
  }

  return (
    <>
      <H1>Tienda de cartas</H1>
      <P className="text-center">Explora nuestra colección de cartas místicas y poderosas. Encuentra las piezas perfectas para tu estrategia.</P>
      <Search placeholder="Buscar cartas o paquetes" className="w-xs mt-8" />
      <ButtonGroup options={["Cartas Individuales", "Paquetes"]} selected={productCategory} onSelect={handleProductCategoryChange} className="mt-7" />

      {error.length > 0 && <p>Ha ocurrido un error inesperado: {error}</p>}

      <div className="flex flex-wrap mt-10 gap-17">
        { loading && productCategory == "Cartas Individuales" && Array.from({length: 10}, (_, idx: number) => (
          <Card key={idx} />
        )) }
        { loading && productCategory == "Paquetes" && Array.from({length: 10}, (_, idx: number) => (
          <Pack key={idx} />
        )) }
        { !loading && content }
      </div>

      <Pagination className="my-10">
        <PaginationContent>
          { page > 1 &&
            <PaginationItem>
              <PaginationPrevious to={`?page=${page-1}`} />
            </PaginationItem>
          }
          { page > 1 &&
            <PaginationItem>
              <PaginationLink to={`?page=${page-1}`}>{page-1}</PaginationLink>
            </PaginationItem>
          }
          <PaginationItem>
            <PaginationLink to={`?page=${page}`} className="text-primary">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink to={`?page=${page+1}`}>{page+1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext to={`?page=${page+1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
