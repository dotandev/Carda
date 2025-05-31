"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Fingerprint, Eye, Shield, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ATMInterfaceProps {
  onRecordShare?: (recordId: string, recipientAddress: string) => void
  onClose?: () => void
}

export function ATMInterface({ onRecordShare, onClose }: ATMInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<"insert" | "auth" | "menu" | "share" | "processing" | "complete">(
    "insert",
  )
  const [authMethod, setAuthMethod] = useState<"fingerprint" | "retina" | "voice">("fingerprint")
  const [isScanning, setIsScanning] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)

  const records = [
    { id: "1", title: "Blood Test Results", date: "2024-01-15", type: "Lab" },
    { id: "2", title: "X-Ray Chest", date: "2024-01-10", type: "Imaging" },
    { id: "3", title: "Prescription History", date: "2024-01-05", type: "Medication" },
  ]

  const handleBiometricScan = async () => {
    setIsScanning(true)
    // Simulate biometric scanning
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsScanning(false)
    setCurrentStep("menu")
  }

  const handleRecordSelection = (recordId: string) => {
    setSelectedRecord(recordId)
    setCurrentStep("share")
  }

  const handleShare = async () => {
    if (!selectedRecord || !recipientAddress) return

    setCurrentStep("processing")
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 4000))

    onRecordShare?.(selectedRecord, recipientAddress)
    setCurrentStep("complete")

    setTimeout(() => {
      onClose?.()
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      {/* ATM Machine Frame */}
      <motion.div
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative w-96 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl shadow-2xl border-4 border-gray-700"
      >
        {/* Screen */}
        <div className="absolute top-8 left-8 right-8 h-80 bg-black rounded-2xl border-4 border-gray-600 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 relative">
            {/* Scan Lines Effect */}
            <motion.div
              animate={{ y: [-400, 400] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-8"
            />

            <AnimatePresence mode="wait">
              {currentStep === "insert" && (
                <motion.div
                  key="insert"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="p-6 text-center text-white h-full flex flex-col justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <CreditCard className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                  </motion.div>
                  <h2 className="text-xl font-bold mb-2">Insert Medical Card</h2>
                  <p className="text-sm text-gray-300">Place your medical ID card in the slot below</p>

                  <motion.div
                    className="mt-6 w-full h-2 bg-gray-700 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.div>
                </motion.div>
              )}

              {currentStep === "auth" && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-6 text-center text-white h-full flex flex-col justify-center"
                >
                  <h2 className="text-xl font-bold mb-4">Biometric Authentication</h2>

                  <div className="flex justify-center gap-4 mb-6">
                    {(["fingerprint", "retina", "voice"] as const).map((method) => (
                      <Button
                        key={method}
                        variant={authMethod === method ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAuthMethod(method)}
                        className="flex-1"
                      >
                        {method === "fingerprint" && <Fingerprint className="w-4 h-4" />}
                        {method === "retina" && <Eye className="w-4 h-4" />}
                        {method === "voice" && <Zap className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>

                  <motion.div
                    className="relative w-32 h-32 mx-auto mb-4"
                    animate={isScanning ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isScanning ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <div className="w-full h-full rounded-full border-4 border-cyan-400 flex items-center justify-center bg-cyan-400/10">
                      {authMethod === "fingerprint" && <Fingerprint className="w-12 h-12 text-cyan-400" />}
                      {authMethod === "retina" && <Eye className="w-12 h-12 text-cyan-400" />}
                      {authMethod === "voice" && <Zap className="w-12 h-12 text-cyan-400" />}
                    </div>

                    {isScanning && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-cyan-400"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.div>

                  <Button onClick={handleBiometricScan} disabled={isScanning} className="bg-cyan-600 hover:bg-cyan-700">
                    {isScanning ? "Scanning..." : "Start Scan"}
                  </Button>
                </motion.div>
              )}

              {currentStep === "menu" && (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="p-4 text-white h-full overflow-y-auto"
                >
                  <h2 className="text-lg font-bold mb-4 text-center">Select Medical Record</h2>

                  <div className="space-y-3">
                    {records.map((record) => (
                      <motion.div
                        key={record.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRecordSelection(record.id)}
                        className="p-3 bg-gray-800/50 rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">{record.title}</h3>
                            <p className="text-xs text-gray-400">{record.date}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {record.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === "share" && (
                <motion.div
                  key="share"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="p-4 text-white h-full flex flex-col justify-center"
                >
                  <h2 className="text-lg font-bold mb-4 text-center">Share Record</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Recipient Address</label>
                      <Input
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="addr1..."
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => setCurrentStep("menu")} variant="outline" className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={handleShare}
                        disabled={!recipientAddress}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 text-center text-white h-full flex flex-col justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <Shield className="w-full h-full text-cyan-400" />
                  </motion.div>

                  <h2 className="text-xl font-bold mb-2">Processing Transaction</h2>
                  <p className="text-sm text-gray-300 mb-4">Encrypting and broadcasting to Cardano network...</p>

                  <div className="space-y-2">
                    <motion.div
                      className="w-full h-1 bg-gray-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-green-500"
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 4 }}
                      />
                    </motion.div>
                    <p className="text-xs text-gray-400">Quantum encryption active...</p>
                  </div>
                </motion.div>
              )}

              {currentStep === "complete" && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 text-center text-white h-full flex flex-col justify-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  </motion.div>

                  <h2 className="text-xl font-bold mb-2">Transaction Complete!</h2>
                  <p className="text-sm text-gray-300">Medical record shared successfully</p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500"
                  >
                    <p className="text-xs text-green-300">TX: 0x1a2b3c...def456</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card Slot */}
        <motion.div
          className="absolute bottom-20 left-8 right-8 h-4 bg-gray-600 rounded-lg"
          whileHover={{ scale: 1.05 }}
          onClick={() => setCurrentStep("auth")}
        >
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg border-2 border-gray-500 cursor-pointer" />
        </motion.div>

        {/* Keypad */}
        <div className="absolute bottom-4 left-8 right-8 grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-gray-700 rounded-lg text-white text-sm font-bold hover:bg-gray-600 transition-colors"
            >
              {key}
            </motion.button>
          ))}
        </div>

        {/* Status LEDs */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 bg-blue-400 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
