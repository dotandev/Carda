"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { History, ExternalLink, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cardanoService } from "@/lib/lucid"

interface Transaction {
  hash: string
  block_time: number
  fees: string
  size: number
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const address = cardanoService.getConnectedWalletAddress()
        if (address) {
          const txHistory = await cardanoService.getTransactionHistory(address)
          setTransactions(txHistory)
        }
      } catch (error) {
        console.error("Failed to load transaction history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatFees = (fees: string) => {
    return (Number.parseInt(fees) / 1000000).toFixed(2) + " ADA"
  }

  const getTransactionStatus = (blockTime: number) => {
    const now = Date.now() / 1000
    const age = now - blockTime

    if (age < 300) return { status: "Recent", color: "green", icon: CheckCircle }
    if (age < 3600) return { status: "Confirmed", color: "blue", icon: CheckCircle }
    return { status: "Settled", color: "gray", icon: CheckCircle }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => {
              const status = getTransactionStatus(tx.block_time)
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-4 h-4 text-${status.color}-600`} />
                    <div>
                      <p className="font-mono text-sm">{tx.hash.slice(0, 16)}...</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.block_time)} • Fees: {formatFees(tx.fees)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-${status.color}-600 border-${status.color}-300`}>
                      {status.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://cardanoscan.io/transaction/${tx.hash}`, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
