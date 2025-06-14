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
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

type ProductCategory = "Cartas Individuales" | "Paquetes" | "Mis cartas";

type ProductBrowserProps<T> = {
  categories: ProductCategory[];
  productComponent: React.ComponentType<{product?: T}>;
};

export const ProductBrowser = <T extends InventoryCard | Product,>({ categories, productComponent }: ProductBrowserProps<T>) => {
  const [ products, setProducts ] = useState<T[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ debouncedSearchValue, setDebouncedSearchValue ] = useState(() => searchParams.get("q") || "");

  const page = useMemo(() => parseInt(searchParams.get("page") || "1"), [searchParams])
  const searchValue = useMemo(() => searchParams.get("q") || "", [searchParams])
  const productCategoryIdx = useMemo(() => parseInt(searchParams.get("category") || "0"), [searchParams])

  const handleProductCategoryChange = (option: ProductCategory) => {
    if (option != categories[productCategoryIdx] || page != 1 || !!searchValue) {
      setLoading(true)
    }
    setDebouncedSearchValue("")
    setSearchParams(s => {
      s.delete("page")
      s.delete("q")
      const c = categories.indexOf(option);
      if (c > 0) {
        s.set("category", c.toString())
      } else {
        s.delete("category")
      }
      return s
    })
  }

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setSearchParams(s => {
      s.set("q", value)
      s.delete("page")
      return s
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 300)
    return () => clearTimeout(timeout);
  }, [searchValue])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      let f;

      switch (categories[productCategoryIdx]) {
        case "Cartas Individuales":
          f = getCards({ page, itemsPerPage: 20, cardName: debouncedSearchValue });
          break;
        case "Paquetes":
          f = getPacks({ page, itemsPerPage: 20, packName: debouncedSearchValue });
          break;
        case "Mis cartas":
          f = getInventory({ page, itemsPerPage: 20, cardName: debouncedSearchValue });
          break;
      }

      try {
        const products = await f;
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
  }, [categories, productCategoryIdx, page, debouncedSearchValue])

  const ProductComponent = productComponent;

  return (
    <>
      <Search placeholder={categories.includes("Paquetes") ? "Buscar cartas o paquetes" : "Buscar cartas"} className="w-xs mt-8" value={searchValue} onChange={handleSearchChange} />
      {categories.length > 1 && <ButtonGroup options={categories} selected={productCategoryIdx} onSelect={handleProductCategoryChange} className="mt-7" /> }

      {error.length > 0 && <p>Ha ocurrido un error inesperado: {error}</p>}

      <div className="flex flex-wrap mt-10 gap-17 justify-around">
        { loading && Array.from({length: 20}, (_, idx: number) => (
          <ProductComponent key={idx} />
        )) }
        { !loading && products.map(product => <ProductComponent key={product.id} product={product} />) }
        { !loading && error.length === 0 && products.length == 0 && <p>No se encontraron {categories[productCategoryIdx]}</p>}
      </div>

      <Pagination className="my-10">
        <PaginationContent>
          { page > 1 &&
            <PaginationItem>
              <PaginationPrevious to={`?page=${page-1}&q=${debouncedSearchValue}&category=${productCategoryIdx}`} />
            </PaginationItem>
          }
          { page > 2 &&
            <PaginationItem>
              <PaginationLink to={`?page=${page-2}&q=${debouncedSearchValue}&category=${productCategoryIdx}`}>{page-2}</PaginationLink>
            </PaginationItem>
          }
          { page > 1 &&
            <PaginationItem>
              <PaginationLink to={`?page=${page-1}&q=${debouncedSearchValue}&category=${productCategoryIdx}`}>{page-1}</PaginationLink>
            </PaginationItem>
          }
          <PaginationItem>
            <PaginationLink to={`?page=${page}&q=${debouncedSearchValue}&category=${productCategoryIdx}`} className="text-primary">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink to={`?page=${page+1}&q=${debouncedSearchValue}&category=${productCategoryIdx}`}>{page+1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink to={`?page=${page+1}&q=${debouncedSearchValue}&category=${productCategoryIdx}`}>{page+2}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext to={`?page=${page+1}&q=${debouncedSearchValue}&category=${productCategoryIdx}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}

