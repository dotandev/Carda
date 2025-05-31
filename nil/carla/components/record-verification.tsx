"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Search, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cardanoService } from "@/lib/lucid"

export function RecordVerification() {
  const [txHash, setTxHash] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyRecord = async () => {
    if (!txHash.trim()) return

    setLoading(true)
    setError(null)
    setVerificationResult(null)

    try {
      const result = await cardanoService.verifyRecord(txHash.trim())
      if (result) {
        setVerificationResult(result)
      } else {
        setError("No medical record metadata found for this transaction")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatus = () => {
    if (verificationResult) {
      return {
        status: "Verified",
        color: "green",
        icon: CheckCircle,
        description: "This record is authentic and verified on the Cardano blockchain",
      }
    }
    if (error) {
      return {
        status: "Invalid",
        color: "red",
        icon: XCircle,
        description: error,
      }
    }
    return null
  }

  const status = getVerificationStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Record Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter transaction hash..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="font-mono text-sm"
          />
          <Button onClick={verifyRecord} disabled={loading || !txHash.trim()}>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {status && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              status.color === "green" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <status.icon className={`w-5 h-5 text-${status.color}-600`} />
              <Badge variant={status.color === "green" ? "default" : "destructive"}>{status.status}</Badge>
            </div>
            <p className={`text-sm text-${status.color}-700`}>{status.description}</p>
          </motion.div>
        )}

        {verificationResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h4 className="font-semibold">Record Details:</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Label:</span>
                <span>{verificationResult.label}</span>
              </div>
              {verificationResult.json_metadata && (
                <div>
                  <span className="font-medium">Metadata:</span>
                  <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                    {JSON.stringify(verificationResult.json_metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
