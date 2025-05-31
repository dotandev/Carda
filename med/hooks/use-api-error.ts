"use client"

import { useState } from "react"

export function useApiError() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const executeWithErrorHandling = async (apiCall, errorMessage) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage || "An error occurred"
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError,
  }
}
