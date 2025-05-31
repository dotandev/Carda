"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Unlock, Zap, Atom, Binary, Key, Eye, EyeOff, CheckCircle, Cpu, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface QuantumEncryptionDisplayProps {
  data?: string
  onEncrypt?: (encryptedData: string) => void
  onDecrypt?: (decryptedData: string) => void
}

export function QuantumEncryptionDisplay({
  data = "Patient medical record data...",
  onEncrypt,
  onDecrypt,
}: QuantumEncryptionDisplayProps) {
  const [encryptionState, setEncryptionState] = useState<"idle" | "encrypting" | "encrypted" | "decrypting">("idle")
  const [encryptionProgress, setEncryptionProgress] = useState(0)
  const [quantumBits, setQuantumBits] = useState<Array<{ id: number; state: 0 | 1; entangled: boolean }>>([])
  const [encryptedData, setEncryptedData] = useState("")
  const [showRawData, setShowRawData] = useState(false)
  const [securityLevel, setSecurityLevel] = useState(256)

  // Initialize quantum bits
  useEffect(() => {
    const bits = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      state: Math.random() > 0.5 ? 1 : 0,
      entangled: Math.random() > 0.7,
    }))
    setQuantumBits(bits)
  }, [])

  // Animate quantum bits
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumBits((prev) =>
        prev.map((bit) => ({
          ...bit,
          state: Math.random() > 0.5 ? 1 : 0,
          entangled: Math.random() > 0.8,
        })),
      )
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const generateEncryptedData = (input: string) => {
    // Simulate quantum encryption
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    let result = ""
    for (let i = 0; i < input.length * 2; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const startEncryption = async () => {
    setEncryptionState("encrypting")
    setEncryptionProgress(0)

    // Simulate quantum encryption process
    for (let i = 0; i <= 100; i += 2) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setEncryptionProgress(i)
    }

    const encrypted = generateEncryptedData(data)
    setEncryptedData(encrypted)
    setEncryptionState("encrypted")
    onEncrypt?.(encrypted)
  }

  const startDecryption = async () => {
    setEncryptionState("decrypting")
    setEncryptionProgress(100)

    // Simulate quantum decryption process
    for (let i = 100; i >= 0; i -= 2) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setEncryptionProgress(i)
    }

    setEncryptionState("idle")
    onDecrypt?.(data)
  }

  const QuantumBitVisualization = () => (
    <div className="grid grid-cols-8 gap-1 p-4 bg-black/30 rounded-lg">
      {quantumBits.map((bit) => (
        <motion.div
          key={bit.id}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            bit.entangled
              ? "border-purple-400 bg-purple-400/20 text-purple-300"
              : "border-cyan-400 bg-cyan-400/20 text-cyan-300"
          }`}
          animate={{
            scale: bit.entangled ? [1, 1.2, 1] : 1,
            rotate: bit.state === 1 ? 180 : 0,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {bit.state}
        </motion.div>
      ))}
    </div>
  )

  const EncryptionVisualization = () => (
    <div className="relative h-32 bg-black/30 rounded-lg overflow-hidden">
      {/* Data stream */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={
          encryptionState === "encrypting"
            ? {
                background: [
                  "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.3) 50%, transparent 100%)",
                  "linear-gradient(90deg, transparent 100%, rgba(6, 182, 212, 0.3) 150%, transparent 200%)",
                ],
              }
            : {}
        }
        transition={{ duration: 1, repeat: encryptionState === "encrypting" ? Number.POSITIVE_INFINITY : 0 }}
      >
        <div className="text-center">
          {encryptionState === "idle" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <Lock className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-400">Ready for quantum encryption</p>
            </motion.div>
          )}

          {encryptionState === "encrypting" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Atom className="w-8 h-8 mx-auto text-cyan-400" />
              </motion.div>
              <p className="text-sm text-cyan-400">Quantum entanglement in progress...</p>
            </motion.div>
          )}

          {encryptionState === "encrypted" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <Shield className="w-8 h-8 mx-auto text-green-400" />
              <p className="text-sm text-green-400">Quantum encryption complete</p>
            </motion.div>
          )}

          {encryptionState === "decrypting" && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Key className="w-8 h-8 mx-auto text-yellow-400" />
              </motion.div>
              <p className="text-sm text-yellow-400">Quantum decryption in progress...</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quantum interference patterns */}
      {(encryptionState === "encrypting" || encryptionState === "decrypting") && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{ top: `${20 + i * 15}%` }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "linear",
              }}
            />
          ))}
        </>
      )}
    </div>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Atom className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <div>
            <h3 className="text-white font-bold">Quantum Encryption Engine</h3>
            <p className="text-sm text-gray-400">Post-quantum cryptography with entangled key distribution</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Cpu className="w-3 h-3 mr-1" />
              {securityLevel}-bit
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Wifi className="w-3 h-3 mr-1" />
              Quantum Ready
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Level Indicator */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <p className="text-sm font-semibold text-white">Security Level</p>
              <p className="text-lg font-bold text-green-400">Military Grade</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <p className="text-sm font-semibold text-white">Quantum State</p>
              <p className="text-lg font-bold text-yellow-400">Entangled</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <Binary className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <p className="text-sm font-semibold text-white">Key Length</p>
              <p className="text-lg font-bold text-cyan-400">{securityLevel} bits</p>
            </CardContent>
          </Card>
        </div>

        {/* Quantum Bit Visualization */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            Quantum Bit States
          </h4>
          <QuantumBitVisualization />
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-cyan-400 rounded-full"></div>
              <span>Standard qubits</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-purple-400 rounded-full"></div>
              <span>Entangled qubits</span>
            </div>
          </div>
        </div>

        {/* Encryption Visualization */}
        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Encryption Process
          </h4>
          <EncryptionVisualization />

          {(encryptionState === "encrypting" || encryptionState === "decrypting") && (
            <div className="mt-3">
              <Progress value={encryptionProgress} className="h-2" />
              <p className="text-xs text-gray-400 mt-1">
                {encryptionState === "encrypting" ? "Encrypting" : "Decrypting"}: {encryptionProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Data Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              Data Stream
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRawData(!showRawData)}
              className="text-gray-400 hover:text-white"
            >
              {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Original Data */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Original Data</span>
                </div>
                <div className="bg-black/50 p-3 rounded font-mono text-xs text-gray-300 max-h-32 overflow-y-auto">
                  {showRawData ? data : "••••••••••••••••••••••••••••••••"}
                </div>
              </CardContent>
            </Card>

            {/* Encrypted Data */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">Encrypted Data</span>
                </div>
                <div className="bg-black/50 p-3 rounded font-mono text-xs text-green-300 max-h-32 overflow-y-auto break-all">
                  {encryptedData || "No encrypted data"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={startEncryption}
            disabled={encryptionState !== "idle"}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {encryptionState === "encrypting" ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Atom className="w-4 h-4" />
                </motion.div>
                Encrypting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Quantum Encrypt
              </div>
            )}
          </Button>

          <Button
            onClick={startDecryption}
            disabled={encryptionState !== "encrypted"}
            variant="outline"
            className="flex-1 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
          >
            {encryptionState === "decrypting" ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Key className="w-4 h-4" />
                </motion.div>
                Decrypting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4" />
                Quantum Decrypt
              </div>
            )}
          </Button>
        </div>

        {/* Security Information */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Security Features
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Quantum key distribution (QKD)</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Post-quantum cryptography</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Perfect forward secrecy</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Quantum-resistant algorithms</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Entanglement-based security</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>Zero-knowledge protocols</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
