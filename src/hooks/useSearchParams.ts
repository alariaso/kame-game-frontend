// taken from https://github.com/remix-run/react-router/issues/9991#issuecomment-2282208096
import {
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useLocation, useNavigate } from 'react-router'

export default function useSearchParams() {
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  const setSearchParams = useCallback(
    (setter: SetStateAction<URLSearchParams>) => {
      const newParams =
        typeof setter === 'function' ? setter(searchParamsRef.current) : setter
      navigate(`?${newParams}`)
    },
    [navigate],
  )

  return [searchParams, setSearchParams] as const
}
