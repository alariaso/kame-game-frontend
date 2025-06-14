import { getCards, getInventory, getPacks, type InventoryCard, type Product } from "@/api";
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
import { Search } from "@/elements/Search";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type ProductCategory = "Cartas Individuales" | "Paquetes" | "Mis cartas";

type ProductBrowserProps<T> = {
  categories: ProductCategory[];
  productComponent: React.ComponentType<{product?: T}>;
};

export const ProductBrowser = <T extends InventoryCard | Product,>({ categories, productComponent }: ProductBrowserProps<T>) => {
  const [ productCategory, setProductCategory ] = useState<ProductCategory>(categories[0]);
  const [ products, setProducts ] = useState<T[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ page, setPage ] = useState(1);
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ searchValue, setSearchValue ] = useState("");
  const [ debouncedSearchValue, setDebouncedSearchValue ] = useState("")

  const handleProductCategoryChange = (option: ProductCategory) => {
    if (option != productCategory || page != 1) {
      setLoading(true)
    }
    setSearchParams({"page": "1"})
    setProductCategory(option)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 300)
    return () => clearTimeout(timeout);
  }, [searchValue])

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setPage(parseInt(page))
    }
  }, [searchParams])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      let params;
      let f;

      switch (productCategory) {
        case "Cartas Individuales":
          f = getCards;
          params = { page, itemsPerPage: 20, cardName: debouncedSearchValue };
          break;
        case "Paquetes":
          f = getPacks;
          params = { page, itemsPerPage: 20, packName: debouncedSearchValue };
          break;
        case "Mis cartas":
          f = getInventory
          params = { page, itemsPerPage: 20, cardName: debouncedSearchValue };
          break;
      }

      try {
        const products = await f(params);
        setProducts(products as T[])
        setError("")
      } catch (err) {
        setProducts([])
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage)
      }

      setLoading(false)
    }

    loadProducts()
  }, [productCategory, page, debouncedSearchValue])

  const ProductComponent = productComponent;

  return (
    <>
      <Search placeholder={categories.includes("Paquetes") ? "Buscar cartas o paquetes" : "Buscar cartas"} className="w-xs mt-8" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
      {categories.length > 1 && <ButtonGroup options={categories} selected={productCategory} onSelect={handleProductCategoryChange} className="mt-7" /> }

      {error.length > 0 && <p>Ha ocurrido un error inesperado: {error}</p>}

      <div className="flex flex-wrap mt-10 gap-17 justify-around">
        { loading && Array.from({length: 10}, (_, idx: number) => (
          <ProductComponent key={idx} />
        )) }
        { !loading && products.map(product => <ProductComponent key={product.id} product={product} />) }
        { !loading && error.length === 0 && products.length == 0 && <p>No se encontraron {productCategory}</p>}
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

