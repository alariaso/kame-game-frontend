import { getCards, getInventory, getPacks, type CardKind, type InventoryCard, type PackRarity, type Product } from "@/api";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSearchParams from "@/hooks/useSearchParams";

export type ProductCategory = "Cartas Individuales" | "Paquetes" | "Mis cartas";

type ProductBrowserProps<T> = {
  categories: ProductCategory[];
  productComponent: React.ComponentType<{product?: T}>;
};

const apiCalls = {
  "Cartas Individuales": getCards,
  "Paquetes": getPacks,
  "Mis cartas": getInventory
}

type Filter = "cardKind" | "packRarity";

const extraFilters: Record<ProductCategory, Filter[]> = {
  "Cartas Individuales": ["cardKind"],
  "Paquetes": ["packRarity"],
  "Mis cartas": ["cardKind"],
};

type FilterInfo = {
  title: string,
  values: (CardKind | PackRarity)[];
}

const filterInfo: Record<Filter, FilterInfo> = {
  cardKind: {
    title: "Tipo",
    values: ["DARK", "DIVINE", "EARTH", "FIRE", "LIGHT", "WATER", "WIND"]
  },
  packRarity: {
    title: "Rareza",
    values: ["COMMON", "RARE", "SUPER RARE", "ULTRA RARE"]
  },
};

export const ProductBrowser = <T extends InventoryCard | Product,>({ categories, productComponent }: ProductBrowserProps<T>) => {
  const [ products, setProducts ] = useState<T[]>([]);
  const [ totalPages, setTotalPages ] = useState<number | null>(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");
  const [ searchParams, setSearchParams ] = useSearchParams();

  const page = useMemo(() => parseInt(searchParams.get("page") || "1"), [searchParams])
  const [searchValue, setSearchValue] = useState(() => searchParams.get("q") || "");
  const debouncedSearchValue = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const productCategoryIdx = useMemo(() => parseInt(searchParams.get("category") || "0"), [searchParams])

  const filters = useMemo(() => extraFilters[categories[productCategoryIdx]], [categories, productCategoryIdx])
  const filterValues = useMemo<Partial<Record<Filter, string | null>>>(() => {
    return filters.reduce((acc, v) => ({ ...acc, [v]: searchParams.get(v) }), {})
  }, [filters, searchParams]);

  const handleProductCategoryChange = (option: ProductCategory) => {
    if (option != categories[productCategoryIdx] || page != 1 || !!searchValue) {
      setLoading(true)
    }
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

  const handleFilterChange = (filter: Filter) => {
    return (value: string) => {
      setSearchParams(s => {
        if (value.length > 0) {
          s.set(filter, value)
        } else {
          s.delete(filter)
        }
        s.delete("page")
        return s
      })
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams(s => {
        if (searchValue.length > 0) {
          s.set("q", searchValue)
        } else {
          s.delete("q")
        }
        s.delete("page")
        return s
      })
    }, 400)
    return () => clearTimeout(timeout);
  }, [searchValue, setSearchParams])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const f = apiCalls[categories[productCategoryIdx]];
      const params = { page, itemsPerPage: 20, itemName: debouncedSearchValue, ...filterValues } as Parameters<typeof f>[0];

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
  }, [categories, productCategoryIdx, page, debouncedSearchValue, filterValues])

  const createPageLink = (targetPage: number) => {
    let s = `?page=${targetPage}`
    if (debouncedSearchValue) {
      s += `&q=${debouncedSearchValue}`
    }
    if (productCategoryIdx > 0) {
      s += `&category=${productCategoryIdx}`
    }
    for (const [filter, value] of Object.entries(filterValues)) {
      if (value) {
        s += `&${filter}=${value}`
      }
    }
    return s
  };

  const ProductComponent = productComponent;

  return (
    <div className="px-14">
      <Search placeholder={categories.includes("Paquetes") ? "Buscar cartas o paquetes" : "Buscar cartas"} className="w-xs mt-8" value={searchValue} onChange={e => setSearchValue(e.target.value)} />

      <div className="flex mt-7 gap-4">
        {categories.length > 1 && <ButtonGroup options={categories} selected={productCategoryIdx} onSelect={handleProductCategoryChange} /> }
        {filters.map(filter => {
          const info = filterInfo[filter]
          return (
            <Select key={filter} value={filterValues[filter] || ""} onValueChange={handleFilterChange(filter)}>
              <SelectTrigger className="w-[180px] border-primary" value={filterValues[filter] || ""} onReset={() => handleFilterChange(filter)("")}>
                <SelectValue placeholder={info.title} />
              </SelectTrigger>
              <SelectContent>
                {info.values.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          )
      })}
      </div>

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
    </div>
  );
}
