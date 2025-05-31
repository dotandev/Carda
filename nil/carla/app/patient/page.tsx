"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  Heart,
  FileText,
  Pill,
  Share2,
  Download,
  Plus,
  Calendar,
  User,
  Activity,
  Shield,
  Bell,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { TransactionHistory } from "@/components/transaction-history"
import { RecordVerification } from "@/components/record-verification"

const medicalRecords = [
  {
    id: "1",
    title: "Annual Physical Exam",
    date: "2024-01-15",
    doctor: "Dr. Sarah Johnson",
    type: "Checkup",
    status: "Completed",
    priority: "Normal",
  },
  {
    id: "2",
    title: "Blood Test Results",
    date: "2024-01-10",
    doctor: "Dr. Michael Chen",
    type: "Lab Results",
    status: "Reviewed",
    priority: "Normal",
  },
  {
    id: "3",
    title: "X-Ray - Chest",
    date: "2024-01-05",
    doctor: "Dr. Emily Davis",
    type: "Imaging",
    status: "Completed",
    priority: "High",
  },
]

const prescriptions = [
  {
    id: "1",
    medication: "Lisinopril 10mg",
    prescriber: "Dr. Sarah Johnson",
    date: "2024-01-15",
    refills: 2,
    status: "Active",
  },
  {
    id: "2",
    medication: "Metformin 500mg",
    prescriber: "Dr. Michael Chen",
    date: "2024-01-10",
    refills: 1,
    status: "Active",
  },
]

export default function PatientDashboard() {
  const [records, setRecords] = useState(medicalRecords)
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(records)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setRecords(items)
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
                <p className="text-sm text-gray-600">Welcome back, John Doe</p>
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
                  <p className="text-purple-600 text-sm font-medium">Shared Records</p>
                  <p className="text-2xl font-bold text-purple-800">8</p>
                </div>
                <Share2 className="w-8 h-8 text-purple-600" />
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

        {/* Main Content */}
        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Medical Records</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Request Record
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="records">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {records.map((record, index) => (
                      <Draggable key={record.id} draggableId={record.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            layout
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`${
                              snapshot.isDragging ? "rotate-2 shadow-2xl" : ""
                            } transition-all duration-200`}
                          >
                            <Card className="cursor-move hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-800">{record.title}</h3>
                                      <p className="text-sm text-gray-600">Dr. {record.doctor}</p>
                                      <p className="text-xs text-gray-500">{record.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={record.priority === "High" ? "destructive" : "secondary"}>
                                      {record.priority}
                                    </Badge>
                                    <Badge variant="outline">{record.type}</Badge>
                                    <Button variant="ghost" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Active Prescriptions</h2>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Refill
              </Button>
            </div>

            <div className="grid gap-4">
              {prescriptions.map((prescription) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Pill className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{prescription.medication}</h3>
                            <p className="text-sm text-gray-600">Prescribed by {prescription.prescriber}</p>
                            <p className="text-xs text-gray-500">Date: {prescription.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800 mb-2">{prescription.status}</Badge>
                          <p className="text-sm text-gray-600">Refills: {prescription.refills}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
                    <User className="w-5 h-5" />
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
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Access Control</span>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Data Integrity</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
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
    </div>
  )
}
