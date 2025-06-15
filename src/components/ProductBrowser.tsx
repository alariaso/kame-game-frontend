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
  const [ totalPages, setTotalPages ] = useState<number | null>(null);
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
      const params = { page, itemsPerPage: 20, itemName: debouncedSearchValue };

      switch (categories[productCategoryIdx]) {
        case "Cartas Individuales":
          f = getCards;
          break;
        case "Paquetes":
          f = getPacks;
          break;
        case "Mis cartas":
          f = getInventory;
          break;
      }

      try {
        const productsRes = await f(params);
        setTotalPages(productsRes.totalPages)
        setProducts(productsRes.items as T[])
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

  const createPageLink = (targetPage: number) => {
    let s = `?page=${targetPage}`
    if (debouncedSearchValue) {
      s += `&q=${debouncedSearchValue}`
    }
    if (productCategoryIdx > 0) {
      s += `&category=${productCategoryIdx}`
    }
    return s
  };

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
              <PaginationPrevious to={createPageLink(page-1)} />
            </PaginationItem>
          }
          { page > 3 && <>
            <PaginationItem>
              <PaginationLink to={createPageLink(1)}>{1}</PaginationLink>
            </PaginationItem>
          </> }
          { page > 4 && <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>}
          { page > 2 &&
            <PaginationItem>
              <PaginationLink to={createPageLink(page-2)}>{page-2}</PaginationLink>
            </PaginationItem>
          }
          { page > 1 &&
            <PaginationItem>
              <PaginationLink to={createPageLink(page-1)}>{page-1}</PaginationLink>
            </PaginationItem>
          }
          <PaginationItem>
            <PaginationLink to={createPageLink(page)} className="text-primary">{page}</PaginationLink>
          </PaginationItem>

          { (totalPages === null || (totalPages !== null && page+1 <= totalPages)) &&
            <PaginationItem>
              <PaginationLink to={createPageLink(page+1)}>{page+1}</PaginationLink>
            </PaginationItem>
          }
          { (totalPages === null || (totalPages !== null && page+2 <= totalPages)) &&
            <PaginationItem>
              <PaginationLink to={createPageLink(page+2)}>{page+2}</PaginationLink>
            </PaginationItem>
          }
          { (totalPages === null || (totalPages !== null && page+3 < totalPages)) && <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>}
          { totalPages !== null && (totalPages !== null && page+2 < totalPages) &&
            <PaginationItem>
              <PaginationLink to={createPageLink(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          }
          <PaginationItem>
            <PaginationNext to={createPageLink(page+1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
