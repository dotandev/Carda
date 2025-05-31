"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pill,
  Package,
  Calendar,
  Search,
  Plus,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Scan,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockPrescriptions = [
  {
    id: "1",
    patient: "John Doe",
    doctor: "Dr. Sarah Johnson",
    medication: "Lisinopril 10mg",
    quantity: 30,
    status: "pending",
    issuedDate: "2024-01-15",
    priority: "normal",
  },
  {
    id: "2",
    patient: "Jane Smith",
    doctor: "Dr. Michael Chen",
    medication: "Metformin 500mg",
    quantity: 90,
    status: "verified",
    issuedDate: "2024-01-14",
    priority: "normal",
  },
  {
    id: "3",
    patient: "Robert Johnson",
    doctor: "Dr. Emily Davis",
    medication: "Insulin Glargine",
    quantity: 5,
    status: "urgent",
    issuedDate: "2024-01-15",
    priority: "high",
  },
]

const mockInventory = [
  {
    id: "1",
    name: "Lisinopril 10mg",
    category: "ACE Inhibitor",
    stock: 450,
    minStock: 100,
    status: "in-stock",
    expiry: "2025-06-15",
  },
  {
    id: "2",
    name: "Metformin 500mg",
    category: "Antidiabetic",
    stock: 75,
    minStock: 100,
    status: "low-stock",
    expiry: "2025-03-20",
  },
  {
    id: "3",
    name: "Insulin Glargine",
    category: "Insulin",
    stock: 25,
    minStock: 50,
    status: "critical",
    expiry: "2024-12-10",
  },
]

const mockConsultations = [
  {
    id: "1",
    patient: "Mary Wilson",
    time: "10:00 AM",
    type: "Medication Review",
    status: "scheduled",
  },
  {
    id: "2",
    patient: "David Brown",
    time: "11:30 AM",
    type: "Drug Interaction Check",
    status: "in-progress",
  },
]

export default function PharmacistDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null)

  const filteredPrescriptions = mockPrescriptions.filter(
    (prescription) =>
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600"
      case "verified":
        return "text-green-600"
      case "urgent":
        return "text-red-600"
      case "dispensed":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock * 0.5) return { status: "critical", color: "text-red-600" }
    if (stock <= minStock) return { status: "low-stock", color: "text-yellow-600" }
    return { status: "in-stock", color: "text-green-600" }
  }

  return (
    <DashboardLayout userType="pharmacist" userName="Dr. Alex Thompson" userEmail="alex.thompson@pharmacy.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy System</h1>
            <p className="text-gray-600 mt-1">Verify prescriptions and manage medication inventory</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Scan className="w-4 h-4 mr-2" />
              Scan Prescription
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Consultation
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Pending Prescriptions", value: "12", icon: Clock, color: "text-yellow-600" },
            { label: "Verified Today", value: "28", icon: CheckCircle, color: "text-green-600" },
            { label: "Low Stock Items", value: "5", icon: AlertTriangle, color: "text-red-600" },
            { label: "Consultations", value: "7", icon: User, color: "text-blue-600" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Urgent Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Urgent Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPrescriptions
                      .filter((p) => p.status === "urgent" || p.priority === "high")
                      .map((prescription, index) => (
                        <motion.div
                          key={prescription.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{prescription.medication}</p>
                            <p className="text-sm text-gray-600">{prescription.patient}</p>
                            <p className="text-xs text-gray-500">Qty: {prescription.quantity}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive">{prescription.status}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{prescription.issuedDate}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Consultations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today's Consultations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockConsultations.map((consultation, index) => (
                      <motion.div
                        key={consultation.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{consultation.patient}</p>
                          <p className="text-sm text-gray-600">{consultation.type}</p>
                          <p className="text-xs text-gray-500">{consultation.time}</p>
                        </div>
                        <Badge variant={consultation.status === "in-progress" ? "default" : "secondary"}>
                          {consultation.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inventory Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockInventory
                    .filter((item) => item.status !== "in-stock")
                    .map((item, index) => {
                      const stockInfo = getStockStatus(item.stock, item.minStock)
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <Badge variant={stockInfo.status === "critical" ? "destructive" : "outline"}>
                              {stockInfo.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stock:</span>
                            <span className={`font-medium ${stockInfo.color}`}>{item.stock}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Min Stock:</span>
                            <span className="font-medium">{item.minStock}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prescription Verification</CardTitle>
                  <Button size="sm">
                    <Scan className="w-4 h-4 mr-2" />
                    Scan New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search prescriptions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPrescriptions.map((prescription, index) => (
                    <motion.div
                      key={prescription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPrescription(prescription.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <Pill className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{prescription.medication}</p>
                          <p className="text-sm text-gray-600">{prescription.patient}</p>
                          <p className="text-xs text-gray-500">
                            Prescribed by {prescription.doctor} • Qty: {prescription.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            prescription.status === "urgent"
                              ? "destructive"
                              : prescription.status === "verified"
                                ? "secondary"
                                : "outline"
                          }
                          className={getStatusColor(prescription.status)}
                        >
                          {prescription.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{prescription.issuedDate}</p>
                        {prescription.priority === "high" && (
                          <Badge variant="destructive" className="mt-1">
                            High Priority
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medication Inventory</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockInventory.map((item, index) => {
                    const stockInfo = getStockStatus(item.stock, item.minStock)
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <Badge
                                variant={
                                  stockInfo.status === "critical"
                                    ? "destructive"
                                    : stockInfo.status === "low-stock"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {stockInfo.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Current Stock</span>
                                <span className={`font-medium ${stockInfo.color}`}>{item.stock}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Minimum Stock</span>
                                <span className="font-medium">{item.minStock}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Expiry Date</span>
                                <span className="font-medium">{item.expiry}</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  stockInfo.status === "critical"
                                    ? "bg-red-500"
                                    : stockInfo.status === "low-stock"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Patient Consultations</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockConsultations.map((consultation, index) => (
                    <motion.div
                      key={consultation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{consultation.patient}</p>
                          <p className="text-sm text-gray-600">{consultation.type}</p>
                          <p className="text-xs text-gray-500">Scheduled for {consultation.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={consultation.status === "in-progress" ? "default" : "secondary"}>
                          {consultation.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Activity className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
