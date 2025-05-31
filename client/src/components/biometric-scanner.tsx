"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Fingerprint, Eye, Mic, Shield, CheckCircle, AlertCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BiometricScannerProps {
  onAuthSuccess?: (method: string, confidence: number) => void
  onAuthFailed?: (reason: string) => void
  requiredMethods?: ("fingerprint" | "retina" | "voice")[]
}

export function BiometricScanner({
  onAuthSuccess,
  onAuthFailed,
  requiredMethods = ["fingerprint"],
}: BiometricScannerProps) {
  const [currentMethod, setCurrentMethod] = useState<"fingerprint" | "retina" | "voice">("fingerprint")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [authStatus, setAuthStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle")
  const [confidence, setConfidence] = useState(0)
  const [completedMethods, setCompletedMethods] = useState<string[]>([])

  const scanMethods = {
    fingerprint: {
      icon: Fingerprint,
      title: "Fingerprint Scan",
      instruction: "Place your finger on the scanner",
      duration: 3000,
      pattern: "radial",
    },
    retina: {
      icon: Eye,
      title: "Retinal Scan",
      instruction: "Look directly into the scanner",
      duration: 4000,
      pattern: "circular",
    },
    voice: {
      icon: Mic,
      title: "Voice Recognition",
      instruction: "Say: 'Authorize medical access'",
      duration: 5000,
      pattern: "wave",
    },
  }

  const startScan = async () => {
    setIsScanning(true)
    setAuthStatus("scanning")
    setScanProgress(0)

    const method = scanMethods[currentMethod]
    const duration = method.duration

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100)
        return Math.min(newProgress, 100)
      })
    }, 100)

    // Simulate biometric analysis
    await new Promise((resolve) => setTimeout(resolve, duration))
    clearInterval(interval)

    // Simulate authentication result (90% success rate)
    const success = Math.random() > 0.1
    const authConfidence = success ? 85 + Math.random() * 15 : 30 + Math.random() * 40

    setConfidence(authConfidence)

    if (success && authConfidence > 80) {
      setAuthStatus("success")
      setCompletedMethods((prev) => [...prev, currentMethod])

      setTimeout(() => {
        onAuthSuccess?.(currentMethod, authConfidence)
        setIsScanning(false)
        setScanProgress(0)
        setAuthStatus("idle")
      }, 2000)
    } else {
      setAuthStatus("failed")
      setTimeout(() => {
        onAuthFailed?.(`${currentMethod} authentication failed - confidence too low`)
        setIsScanning(false)
        setScanProgress(0)
        setAuthStatus("idle")
      }, 2000)
    }
  }

  const ScanAnimation = ({ method }: { method: typeof currentMethod }) => {
    const config = scanMethods[method]

    if (config.pattern === "radial") {
      return (
        <motion.div className="relative w-32 h-32">
          {/* Fingerprint ridges */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border-2 border-cyan-400 rounded-full"
              style={{
                width: `${(i + 1) * 20}px`,
                height: `${(i + 1) * 20}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={
                isScanning
                  ? {
                      opacity: [0.2, 1, 0.2],
                      scale: [0.8, 1.2, 0.8],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: isScanning ? Number.POSITIVE_INFINITY : 0,
                delay: i * 0.2,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <config.icon className="w-8 h-8 text-cyan-400" />
          </div>
        </motion.div>
      )
    }

    if (config.pattern === "circular") {
      return (
        <motion.div className="relative w-32 h-32">
          {/* Retinal scan pattern */}
          <motion.div
            className="absolute inset-0 border-4 border-cyan-400 rounded-full"
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 border-2 border-cyan-400 rounded-full"
            animate={isScanning ? { rotate: -360 } : {}}
            transition={{ duration: 1.5, repeat: isScanning ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-8 border-2 border-cyan-400 rounded-full"
            animate={isScanning ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 1, repeat: isScanning ? Number.POSITIVE_INFINITY : 0 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <config.icon className="w-8 h-8 text-cyan-400" />
          </div>
        </motion.div>
      )
    }

    // Voice pattern
    return (
      <motion.div className="relative w-32 h-32 flex items-center justify-center">
        {/* Sound waves */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 border-cyan-400 rounded-full"
            style={{
              width: `${(i + 1) * 30}px`,
              height: `${(i + 1) * 30}px`,
            }}
            animate={
              isScanning
                ? {
                    scale: [0, 1.5],
                    opacity: [1, 0],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: isScanning ? Number.POSITIVE_INFINITY : 0,
              delay: i * 0.3,
            }}
          />
        ))}
        <config.icon className="w-8 h-8 text-cyan-400 z-10" />
      </motion.div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border-cyan-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="w-5 h-5 text-cyan-400" />
          Biometric Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="flex gap-2">
          {(Object.keys(scanMethods) as Array<keyof typeof scanMethods>).map((method) => {
            const config = scanMethods[method]
            const isCompleted = completedMethods.includes(method)
            const isRequired = requiredMethods.includes(method)

            return (
              <Button
                key={method}
                variant={currentMethod === method ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentMethod(method)}
                disabled={isScanning}
                className={`flex-1 relative ${isCompleted ? "bg-green-600" : ""}`}
              >
                <config.icon className="w-4 h-4 mr-1" />
                {method}
                {isRequired && <span className="text-red-400 ml-1">*</span>}
                {isCompleted && <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-green-400" />}
              </Button>
            )
          })}
        </div>

        {/* Scanner Display */}
        <div className="bg-black/50 rounded-lg p-6 border border-cyan-500/30">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-white">{scanMethods[currentMethod].title}</h3>

            <div className="flex justify-center">
              <ScanAnimation method={currentMethod} />
            </div>

            <p className="text-sm text-gray-300">{scanMethods[currentMethod].instruction}</p>

            {/* Progress Bar */}
            {isScanning && (
              <div className="space-y-2">
                <Progress value={scanProgress} className="h-2" />
                <p className="text-xs text-cyan-400">Analyzing biometric data... {Math.round(scanProgress)}%</p>
              </div>
            )}

            {/* Status Display */}
            <AnimatePresence>
              {authStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center gap-2 text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Authentication Successful</span>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {confidence.toFixed(1)}% confidence
                  </Badge>
                </motion.div>
              )}

              {authStatus === "failed" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center gap-2 text-red-400"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Authentication Failed</span>
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    {confidence.toFixed(1)}% confidence
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Scan Button */}
        <Button
          onClick={startScan}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              Scanning...
            </div>
          ) : (
            `Start ${scanMethods[currentMethod].title}`
          )}
        </Button>

        {/* Security Info */}
        <div className="text-xs text-gray-400 text-center space-y-1">
          <p>🔒 End-to-end encrypted biometric data</p>
          <p>🛡️ Zero-knowledge authentication protocol</p>
          <p>⚡ Quantum-resistant encryption</p>
        </div>
      </CardContent>
    </Card>
  )
}
