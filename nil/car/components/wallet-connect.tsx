"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, CheckCircle, AlertCircle, LogOut, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cardanoService } from "@/lib/lucid"

interface WalletConnectProps {
  onConnect?: (address: string) => void
  onDisconnect?: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Check if wallet was previously connected
    if (cardanoService.isWalletConnected()) {
      const address = cardanoService.getConnectedWalletAddress()
      setWalletAddress(address)
      if (address) {
        refreshBalance()
        onConnect?.(address)
      }
    }
  }, [onConnect])

  const refreshBalance = async () => {
    setIsRefreshing(true)
    try {
      const walletBalance = await cardanoService.getWalletBalance()
      setBalance(walletBalance)
    } catch (err) {
      console.error("Failed to refresh balance:", err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const connectWallet = async (walletName: "nami" | "eternl" | "flint") => {
    setIsConnecting(true)
    setError(null)

    try {
      const address = await cardanoService.connectWallet(walletName)
      setWalletAddress(address)

      const walletBalance = await cardanoService.getWalletBalance()
      setBalance(walletBalance)

      onConnect?.(address)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    cardanoService.disconnectWallet()
    setWalletAddress(null)
    setBalance(0)
    setError(null)
    onDisconnect?.()
  }

  const wallets = [
    {
      name: "nami" as const,
      displayName: "Nami",
      available: typeof window !== "undefined" && window.cardano?.nami,
      description: "Light wallet for Cardano",
    },
    {
      name: "eternl" as const,
      displayName: "Eternl",
      available: typeof window !== "undefined" && window.cardano?.eternl,
      description: "Full-featured Cardano wallet",
    },
    {
      name: "flint" as const,
      displayName: "Flint",
      available: typeof window !== "undefined" && window.cardano?.flint,
      description: "Simple and secure wallet",
    },
  ]

  if (walletAddress) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Wallet Connected
              </div>
              <Button variant="ghost" size="sm" onClick={refreshBalance} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Address:</p>
              <p className="text-xs font-mono bg-white p-2 rounded border break-all">{walletAddress}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Balance:</span>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {balance.toFixed(2)} ADA
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={disconnectWallet}
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Cardano Wallet
          </CardTitle>
          <CardDescription>Choose your preferred Cardano wallet to access the medical records system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            {wallets.map((wallet) => (
              <Button
                key={wallet.name}
                variant="outline"
                className="w-full justify-start h-16 p-4"
                onClick={() => connectWallet(wallet.name)}
                disabled={!wallet.available || isConnecting}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">{wallet.displayName}</p>
                    <p className="text-xs text-gray-500">{wallet.available ? wallet.description : "Not installed"}</p>
                  </div>
                  {isConnecting && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center pt-4 space-y-2">
            <p className="text-xs text-gray-500">Don't have a Cardano wallet?</p>
            <div className="flex gap-2 justify-center">
              <a
                href="https://namiwallet.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Install Nami
              </a>
              <span className="text-xs text-gray-400">•</span>
              <a
                href="https://eternl.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Install Eternl
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
