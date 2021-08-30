import React from "react"
import useAxios from "axios-hooks"

const api = (request) => {
  const [{ data, loading, error }] = useAxios(request)

  return [data, loading, error]
}

export default api
