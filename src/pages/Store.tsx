import { getCards, getPacks, type Product as ApiProduct } from "@/api";
import { Product } from "@/components/Product";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ButtonGroup } from "@/elements/ButtonGroup";
import { H1 } from "@/elements/H1";
import { P } from "@/elements/P";
import { Search } from "@/elements/Search";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type ProductCategory = "Cartas Individuales" | "Paquetes";

export const Store: React.FC = () => {
  const [ productCategory, setProductCategory ] = useState<ProductCategory>("Cartas Individuales");
  const [ products, setProducts ] = useState<ApiProduct[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ page, setPage ] = useState(1);
  const [ searchParams ] = useSearchParams();

  const handleProductCategoryChange = (option: ProductCategory) => {
    if (option != productCategory) {
      setLoading(true)
    }
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
        setProducts(cards)
        setError("")
      } catch (err) {
        setProducts([])
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage)
      }
      setLoading(false)
    }

    async function loadPacks() {
      try {
        const packs = await getPacks({ page, itemsPerPage: 20 });
        setProducts(packs)
        setError("")
      } catch (err) {
        setProducts([])
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

  return (
    <>
      <H1>Tienda de cartas</H1>
      <P className="text-center">Explora nuestra colección de cartas místicas y poderosas. Encuentra las piezas perfectas para tu estrategia.</P>
      <Search placeholder="Buscar cartas o paquetes" className="w-xs mt-8" />
      <ButtonGroup options={["Cartas Individuales", "Paquetes"]} selected={productCategory} onSelect={handleProductCategoryChange} className="mt-7" />

      {error.length > 0 && <p>Ha ocurrido un error inesperado: {error}</p>}

      <div className="flex flex-wrap mt-10 gap-17">
        { loading && Array.from({length: 10}, (_, idx: number) => (
          <Product key={idx} />
        )) }
        { !loading && products.map(product => <Product key={product.id} product={product} />) }
        { !loading && error.length == 0 && products.length == 0 && <p>No se encontraron {productCategory}</p>}
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
