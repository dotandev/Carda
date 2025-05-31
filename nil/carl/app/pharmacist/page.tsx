"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  Pill,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Scan,
  User,
  TrendingUp,
  Activity,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const prescriptions = [
  {
    id: "1",
    patient: "John Doe",
    medication: "Lisinopril 10mg",
    quantity: "30 tablets",
    prescriber: "Dr. Sarah Johnson",
    date: "2024-01-15",
    status: "Pending",
    priority: "Normal",
    refills: 2,
  },
  {
    id: "2",
    patient: "Jane Smith",
    medication: "Metformin 500mg",
    quantity: "60 tablets",
    prescriber: "Dr. Michael Chen",
    date: "2024-01-15",
    status: "Ready",
    priority: "High",
    refills: 1,
  },
  {
    id: "3",
    patient: "Robert Johnson",
    medication: "Atorvastatin 20mg",
    quantity: "30 tablets",
    prescriber: "Dr. Emily Davis",
    date: "2024-01-14",
    status: "Dispensed",
    priority: "Normal",
    refills: 3,
  },
]

const inventory = [
  {
    id: "1",
    name: "Lisinopril 10mg",
    stock: 150,
    minStock: 50,
    expiry: "2025-06-15",
    supplier: "PharmaCorp",
  },
  {
    id: "2",
    name: "Metformin 500mg",
    stock: 25,
    minStock: 30,
    expiry: "2025-03-20",
    supplier: "MediSupply",
  },
  {
    id: "3",
    name: "Atorvastatin 20mg",
    stock: 200,
    minStock: 75,
    expiry: "2025-08-10",
    supplier: "PharmaCorp",
  },
]

export default function PharmacistDashboard() {
  const [prescriptionList, setPrescriptionList] = useState(prescriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(prescriptionList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPrescriptionList(items)
  }

  const filteredPrescriptions = prescriptionList.filter(
    (prescription) =>
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const updatePrescriptionStatus = (id: string, newStatus: string) => {
    setPrescriptionList((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Pharmacy Portal</h1>
                <p className="text-sm text-gray-600">MediCare Pharmacy - Downtown</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
                <Scan className="w-4 h-4 mr-2" />
                Scan Prescription
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
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
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Pending Prescriptions</p>
                  <p className="text-2xl font-bold text-purple-800">12</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Dispensed Today</p>
                  <p className="text-2xl font-bold text-green-800">45</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Low Stock Items</p>
                  <p className="text-2xl font-bold text-orange-800">3</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Inventory</p>
                  <p className="text-2xl font-bold text-blue-800">1,247</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prescriptions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="prescriptions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="prescriptions" className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search prescriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="dispensed">Dispensed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="prescriptions">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {filteredPrescriptions.map((prescription, index) => (
                          <Draggable key={prescription.id} draggableId={prescription.id} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                layout
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`${
                                  snapshot.isDragging ? "rotate-1 shadow-2xl" : ""
                                } transition-all duration-200`}
                                onClick={() => setSelectedPrescription(prescription.id)}
                              >
                                <Card
                                  className={`cursor-move hover:shadow-lg transition-shadow ${
                                    selectedPrescription === prescription.id ? "ring-2 ring-purple-500" : ""
                                  }`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                                          <Pill className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-gray-800">{prescription.medication}</h3>
                                          <p className="text-sm text-gray-600">Patient: {prescription.patient}</p>
                                          <p className="text-xs text-gray-500">
                                            {prescription.quantity} • Prescribed by {prescription.prescriber}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={
                                            prescription.status === "Pending"
                                              ? "secondary"
                                              : prescription.status === "Ready"
                                                ? "default"
                                                : "outline"
                                          }
                                        >
                                          {prescription.status}
                                        </Badge>
                                        <div className="flex flex-col gap-1">
                                          {prescription.status === "Pending" && (
                                            <Button
                                              size="sm"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                updatePrescriptionStatus(prescription.id, "Ready")
                                              }}
                                            >
                                              Prepare
                                            </Button>
                                          )}
                                          {prescription.status === "Ready" && (
                                            <Button
                                              size="sm"
                                              className="bg-green-600 hover:bg-green-700"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                updatePrescriptionStatus(prescription.id, "Dispensed")
                                              }}
                                            >
                                              Dispense
                                            </Button>
                                          )}
                                        </div>
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

              <TabsContent value="inventory" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Inventory Management</h3>
                  <Button variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Add Stock
                  </Button>
                </div>

                {inventory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.name}</h4>
                              <p className="text-sm text-gray-600">Supplier: {item.supplier}</p>
                              <p className="text-xs text-gray-500">Expires: {item.expiry}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Stock: {item.stock}</span>
                              {item.stock < item.minStock && <Badge variant="destructive">Low Stock</Badge>}
                            </div>
                            <Progress value={(item.stock / (item.minStock * 2)) * 100} className="w-24 h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Daily Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Prescriptions Filled</span>
                        <span className="text-sm font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Wait Time</span>
                        <span className="text-sm font-medium">8 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Top Medications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Metformin</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-16 h-2" />
                          <span className="text-xs text-gray-500">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lisinopril</span>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="w-16 h-2" />
                          <span className="text-xs text-gray-500">72%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Atorvastatin</span>
                        <div className="flex items-center gap-2">
                          <Progress value={68} className="w-16 h-2" />
                          <span className="text-xs text-gray-500">68%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Prescription
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Check Inventory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Patient Lookup
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
                  <p className="text-xs text-orange-600">Metformin 500mg - Only 25 units left</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm font-medium text-red-800">Expiry Warning</p>
                  <p className="text-xs text-red-600">3 medications expiring within 30 days</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Prescription dispensed</p>
                  <p className="text-gray-600">Jane Smith - Metformin</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Stock updated</p>
                  <p className="text-gray-600">Lisinopril 10mg +50 units</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Prescription verified</p>
                  <p className="text-gray-600">Robert Johnson - Atorvastatin</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
