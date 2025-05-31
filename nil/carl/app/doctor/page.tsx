"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  Stethoscope,
  Users,
  FileText,
  Pill,
  Calendar,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MedicalRecordForm } from "@/components/medical-record-form"
import { PrescriptionForm } from "@/components/prescription-form"
import { WalletConnect } from "@/components/wallet-connect"

const patients = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    condition: "Hypertension",
    lastVisit: "2024-01-15",
    status: "Stable",
    priority: "Normal",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    condition: "Diabetes Type 2",
    lastVisit: "2024-01-14",
    status: "Monitoring",
    priority: "High",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Robert Johnson",
    age: 67,
    condition: "Heart Disease",
    lastVisit: "2024-01-12",
    status: "Critical",
    priority: "Urgent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const appointments = [
  {
    id: "1",
    patient: "John Doe",
    time: "09:00 AM",
    type: "Follow-up",
    status: "Confirmed",
  },
  {
    id: "2",
    patient: "Jane Smith",
    time: "10:30 AM",
    type: "Consultation",
    status: "Pending",
  },
  {
    id: "3",
    patient: "Robert Johnson",
    time: "02:00 PM",
    type: "Emergency",
    status: "Urgent",
  },
]

export default function DoctorDashboard() {
  const [patientList, setPatientList] = useState(patients)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [selectedPatientForForm, setSelectedPatientForForm] = useState<string | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(patientList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPatientList(items)
  }

  const filteredPatients = patientList.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Doctor Portal</h1>
                <p className="text-sm text-gray-600">Dr. Sarah Johnson - Cardiology</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!walletConnected ? (
                <WalletConnect onConnect={() => setWalletConnected(true)} />
              ) : (
                <>
                  <Button
                    onClick={() => setShowRecordForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Record
                  </Button>
                  <Button onClick={() => setShowPrescriptionForm(true)} variant="outline">
                    <Pill className="w-4 h-4 mr-2" />
                    New Prescription
                  </Button>
                </>
              )}
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>SJ</AvatarFallback>
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
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Patients</p>
                  <p className="text-2xl font-bold text-green-800">156</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Today's Appointments</p>
                  <p className="text-2xl font-bold text-blue-800">8</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Records Created</p>
                  <p className="text-2xl font-bold text-purple-800">23</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Prescriptions</p>
                  <p className="text-2xl font-bold text-orange-800">45</p>
                </div>
                <Pill className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="patients" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
              </TabsList>

              <TabsContent value="patients" className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
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
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="patients">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {filteredPatients.map((patient, index) => (
                          <Draggable key={patient.id} draggableId={patient.id} index={index}>
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
                                onClick={() => setSelectedPatient(patient.id)}
                              >
                                <Card
                                  className={`cursor-move hover:shadow-lg transition-shadow ${
                                    selectedPatient === patient.id ? "ring-2 ring-green-500" : ""
                                  }`}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <Avatar>
                                          <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                                          <AvatarFallback>
                                            {patient.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                                          <p className="text-sm text-gray-600">
                                            Age: {patient.age} • {patient.condition}
                                          </p>
                                          <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant={
                                            patient.priority === "Urgent"
                                              ? "destructive"
                                              : patient.priority === "High"
                                                ? "default"
                                                : "secondary"
                                          }
                                        >
                                          {patient.priority}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                          {patient.status === "Critical" && (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                          )}
                                          {patient.status === "Stable" && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                          )}
                                          {patient.status === "Monitoring" && (
                                            <Clock className="w-4 h-4 text-yellow-500" />
                                          )}
                                          <span className="text-sm text-gray-600">{patient.status}</span>
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

              <TabsContent value="appointments" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Today's Schedule</h3>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </div>

                {appointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{appointment.patient}</h4>
                              <p className="text-sm text-gray-600">{appointment.type}</p>
                              <p className="text-xs text-gray-500">{appointment.time}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              appointment.status === "Urgent"
                                ? "destructive"
                                : appointment.status === "Confirmed"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Records</h3>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Record
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a patient to view their records</p>
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
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowPrescriptionForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Prescription
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setShowRecordForm(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Record
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Patient Satisfaction</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Wait Time</span>
                  <span className="text-sm font-medium">12 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Records Processed</span>
                  <span className="text-sm font-medium">156</span>
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
                  <p className="font-medium">Record created</p>
                  <p className="text-gray-600">John Doe - Blood Test</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Prescription issued</p>
                  <p className="text-gray-600">Jane Smith - Metformin</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Appointment completed</p>
                  <p className="text-gray-600">Robert Johnson</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showRecordForm && (
        <MedicalRecordForm
          patientAddress={selectedPatientForForm || undefined}
          onClose={() => {
            setShowRecordForm(false)
            setSelectedPatientForForm(null)
          }}
          onSuccess={(txHash) => {
            setShowRecordForm(false)
            setSelectedPatientForForm(null)
            // You can add a toast notification here
          }}
        />
      )}

      {showPrescriptionForm && (
        <PrescriptionForm
          patientAddress={selectedPatientForForm || undefined}
          onClose={() => {
            setShowPrescriptionForm(false)
            setSelectedPatientForForm(null)
          }}
          onSuccess={(txHash) => {
            setShowPrescriptionForm(false)
            setSelectedPatientForForm(null)
            // You can add a toast notification here
          }}
        />
      )}
    </div>
  )
}
