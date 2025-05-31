"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, Pill, Calendar, Search, Plus, Activity, Stethoscope, UserPlus, Edit, Eye } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { useRecords } from "@/hooks/use-records"
import { CreateRecordDialog } from "@/components/create-record-dialog"
// Import the new components
import { PrescriptionDialog } from "@/components/prescription-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"

const mockPatients = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "stable",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    lastVisit: "2024-01-12",
    condition: "Diabetes Type 2",
    status: "monitoring",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Robert Johnson",
    age: 58,
    lastVisit: "2024-01-10",
    condition: "Heart Disease",
    status: "critical",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockAppointments = [
  {
    id: "1",
    patient: "John Doe",
    time: "09:00 AM",
    type: "Follow-up",
    status: "confirmed",
  },
  {
    id: "2",
    patient: "Jane Smith",
    time: "10:30 AM",
    type: "Consultation",
    status: "pending",
  },
  {
    id: "3",
    patient: "Robert Johnson",
    time: "02:00 PM",
    type: "Emergency",
    status: "urgent",
  },
]

const mockRecords = [
  {
    id: "1",
    patient: "John Doe",
    type: "consultation",
    title: "Hypertension Follow-up",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    patient: "Jane Smith",
    type: "lab",
    title: "Blood Sugar Monitoring",
    date: "2024-01-12",
    status: "pending",
  },
]

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { records, loading, error, createRecord, fetchRecords } = useRecords()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter and process real data
  const patientRecords = records.filter((record) => record.patientId)
  const recentRecords = records.slice(0, 5)
  const pendingRecords = records.filter((record) => !record.recordEntries || record.recordEntries.length === 0)

  // Calculate stats from real data
  const totalPatients = new Set(patientRecords.map((r) => r.patientId)).size
  const todaysRecords = records.filter(
    (record) => new Date(record.createdAt).toDateString() === new Date().toDateString(),
  ).length

  // Update the loading state
  if (loading) {
    return (
      <DashboardLayout
        userType="doctor"
        userName={user?.name || user?.username || "Doctor"}
        userEmail={user?.email || ""}
      >
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading dashboard..." />
        </div>
      </DashboardLayout>
    )
  }

  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout
      userType="doctor"
      userName={user?.name || user?.username || "Doctor"}
      userEmail={user?.email || ""}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage patients and medical records</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Patients", value: totalPatients.toString(), icon: Users, color: "text-blue-600" },
            { label: "Today's Records", value: todaysRecords.toString(), icon: Calendar, color: "text-green-600" },
            {
              label: "Pending Records",
              value: pendingRecords.length.toString(),
              icon: FileText,
              color: "text-orange-600",
            },
            { label: "Total Records", value: records.length.toString(), icon: Pill, color: "text-purple-600" },
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
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patient}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-xs text-gray-500">{appointment.time}</p>
                        </div>
                        <Badge variant={appointment.status === "urgent" ? "destructive" : "secondary"}>
                          {appointment.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRecords.map((record, index) => (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.recordEntries?.[0]?.summary || "New Medical Record"}
                          </p>
                          <p className="text-sm text-gray-600">Patient ID: {record.patientId}</p>
                          <p className="text-xs text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline">{record.recordEntries?.[0]?.type || "record"}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Critical Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Patients Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPatients
                    .filter((p) => p.status === "critical" || p.status === "monitoring")
                    .map((patient, index) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full" />
                              <div>
                                <p className="font-medium text-gray-900">{patient.name}</p>
                                <p className="text-sm text-gray-600">Age {patient.age}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{patient.condition}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant={patient.status === "critical" ? "destructive" : "secondary"}>
                                {patient.status}
                              </Badge>
                              <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Patient Management</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">
                            Age {patient.age} • {patient.condition}
                          </p>
                          <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={patient.status === "critical" ? "destructive" : "secondary"}>
                          {patient.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medical Records</CardTitle>
                  <CreateRecordDialog onSuccess={fetchRecords} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary">{record.type}</Badge>
                            <Badge variant={record.status === "pending" ? "outline" : "secondary"}>
                              {record.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{record.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{record.patient}</p>
                          <p className="text-xs text-gray-500">{record.date}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prescription Management</CardTitle>
                  <PrescriptionDialog
                    onSuccess={(data) => {
                      console.log("Prescription created:", data)
                      // Handle prescription creation success
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions yet</h3>
                  <p className="text-gray-600 mb-4">Start writing prescriptions for your patients</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Write First Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
