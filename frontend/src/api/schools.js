import { useMemo } from "react"
import useApi from "./api"
import { fetchSchools } from "./requests"

const useSchools = () => {
  const request = useMemo(() => fetchSchools(), [])
  return useApi(request)
}

export default useSchools
