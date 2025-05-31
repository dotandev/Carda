"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, FileText, Pill, Share2, Activity, Shield, Bell, Settings, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { TransactionHistory } from "@/components/transaction-history"
import { RecordVerification } from "@/components/record-verification"
import { HolographicCard } from "@/components/holographic-card"
import { BiometricScanner } from "@/components/biometric-scanner"
import { MedicalAIAssistant } from "@/components/medical-ai-assistant"
import { QuantumEncryptionDisplay } from "@/components/quantum-encryption-display"
import { MedicalNFTGallery } from "@/components/medical-nft-gallery"
import { EmergencyProtocol } from "@/components/emergency-protocol"
import { ATMInterface } from "@/components/atm-interface"

const medicalRecords = [
  {
    id: "1",
    title: "Annual Physical Exam",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    type: "Checkup",
    status: "Completed",
    confidentiality: "private" as const,
  },
  {
    id: "2",
    title: "Blood Test Results",
    date: "2024-01-10",
    doctor: "Dr. Michael Chen",
    type: "Lab Results",
    status: "Reviewed",
    confidentiality: "public" as const,
  },
  {
    id: "3",
    title: "X-Ray - Chest",
    date: "2024-01-05",
    doctor: "Dr. Emily Davis",
    type: "Imaging",
    status: "Completed",
    confidentiality: "restricted" as const,
  },
]

export default function PatientDashboard() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [showATM, setShowATM] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showQuantum, setShowQuantum] = useState(false)
  const [showNFTs, setShowNFTs] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)

  const patientData = {
    name: "John Doe",
    age: 45,
    conditions: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Patient Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {patientData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              {!walletConnected ? (
                <WalletConnect onConnect={() => setWalletConnected(true)} />
              ) : (
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Records</p>
                  <p className="text-2xl font-bold text-blue-800">24</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-green-800">3</p>
                </div>
                <Pill className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Health NFTs</p>
                  <p className="text-2xl font-bold text-purple-800">12</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Health Score</p>
                  <p className="text-2xl font-bold text-orange-800">85%</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0"
              onClick={() => setShowATM(true)}
            >
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">ATM Interface</h3>
                <p className="text-sm opacity-90">Secure record sharing terminal</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0"
              onClick={() => setShowBiometric(true)}
            >
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Biometric Auth</h3>
                <p className="text-sm opacity-90">Advanced security scanning</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0"
              onClick={() => setShowAI(true)}
            >
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">AI Assistant</h3>
                <p className="text-sm opacity-90">Medical intelligence support</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-500 to-orange-600 text-white border-0"
              onClick={() => setShowEmergency(true)}
            >
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Emergency</h3>
                <p className="text-sm opacity-90">Emergency response system</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="nfts" onClick={() => setShowNFTs(true)}>
              Health NFTs
            </TabsTrigger>
            <TabsTrigger value="quantum" onClick={() => setShowQuantum(true)}>
              Quantum Security
            </TabsTrigger>
            <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <FileText className="w-4 h-4 mr-2" />
                Request Record
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HolographicCard record={record} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nfts" className="space-y-6">
            {showNFTs && <MedicalNFTGallery />}
          </TabsContent>

          <TabsContent value="quantum" className="space-y-6">
            {showQuantum && <QuantumEncryptionDisplay data="Patient medical record data..." />}
          </TabsContent>

          <TabsContent value="sharing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Data Sharing Permissions</h2>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Shield className="w-4 h-4 mr-2" />
                Manage Access
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Authorized Providers
                  </CardTitle>
                  <CardDescription>Healthcare providers with access to your records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">City General Hospital</p>
                      <p className="text-sm text-gray-600">Full access</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Limited access</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Privacy Score
                  </CardTitle>
                  <CardDescription>Your data privacy and security status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Encryption Level</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Access Control</span>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Data Integrity</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <TransactionHistory />
              <RecordVerification />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Feature Modals */}
      {showATM && (
        <ATMInterface
          onRecordShare={(recordId, recipient) => {
            console.log("Sharing record", recordId, "with", recipient)
          }}
          onClose={() => setShowATM(false)}
        />
      )}

      {showBiometric && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative">
            <Button
              onClick={() => setShowBiometric(false)}
              className="absolute -top-4 -right-4 z-10 rounded-full w-8 h-8 p-0"
              variant="destructive"
            >
              ×
            </Button>
            <BiometricScanner
              onAuthSuccess={(method, confidence) => {
                console.log("Auth success:", method, confidence)
                setShowBiometric(false)
              }}
              onAuthFailed={(reason) => {
                console.log("Auth failed:", reason)
              }}
            />
          </div>
        </div>
      )}

      {showAI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              onClick={() => setShowAI(false)}
              className="absolute -top-4 -right-4 z-10 rounded-full w-8 h-8 p-0"
              variant="destructive"
            >
              ×
            </Button>
            <MedicalAIAssistant patientData={patientData} />
          </div>
        </div>
      )}

      {showEmergency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-7xl">
            <Button
              onClick={() => setShowEmergency(false)}
              className="absolute -top-4 -right-4 z-10 rounded-full w-8 h-8 p-0"
              variant="destructive"
            >
              ×
            </Button>
            <EmergencyProtocol />
          </div>
        </div>
      )}
    </div>
  )
}
