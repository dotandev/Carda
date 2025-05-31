"use client"

import { useState, useEffect } from "react"
import { recordsAPI, type MedicalRecord } from "@/lib/api"
import { useAuth } from "./use-auth"

export function useRecords() {
  const { token } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)
      const data = await recordsAPI.getAccessibleRecords(token)
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch records")
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async (recordData: Partial<MedicalRecord>) => {
    if (!token) throw new Error("No authentication token")

    try {
      const newRecord = await recordsAPI.createRecord(recordData, token)
      setRecords((prev) => [newRecord, ...prev])
      return newRecord
    } catch (err) {
      throw err
    }
  }

  const updateRecord = async (recordId: string, updateData: Partial<MedicalRecord>) => {
    if (!token) throw new Error("No authentication token")

    try {
      const updatedRecord = await recordsAPI.updateRecord(recordId, updateData, token)
      setRecords((prev) => prev.map((record) => (record._id === recordId ? updatedRecord : record)))
      return updatedRecord
    } catch (err) {
      throw err
    }
  }

  const deleteRecord = async (recordId: string) => {
    if (!token) throw new Error("No authentication token")

    try {
      await recordsAPI.deleteRecord(recordId, token)
      setRecords((prev) => prev.filter((record) => record._id !== recordId))
    } catch (err) {
      throw err
    }
  }

  const addAccess = async (recordId: string, userId: string, access: "read" | "write") => {
    if (!token) throw new Error("No authentication token")

    try {
      await recordsAPI.addAccess(recordId, userId, access, token)
      // Refresh records to get updated access
      await fetchRecords()
    } catch (err) {
      throw err
    }
  }

  const removeAccess = async (recordId: string, userId: string) => {
    if (!token) throw new Error("No authentication token")

    try {
      await recordsAPI.removeAccess(recordId, userId, token)
      // Refresh records to get updated access
      await fetchRecords()
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [token])

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    addAccess,
    removeAccess,
  }
}
