"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, FileText, Pill, Calendar, Share2, Download, Plus, Activity } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"
import { useRecords } from "@/hooks/use-records"

// Import the new components
import { AccessControlDialog } from "@/components/access-control-dialog"
import { LoadingSpinner } from "@/components/loading-spinner"

const mockVitals = {
  heartRate: 72,
  bloodPressure: "120/80",
  temperature: 98.6,
  weight: 165,
  height: "5'8\"",
}

export default function PatientDashboard() {
  const { user } = useAuth()
  const { records, loading, error, fetchRecords } = useRecords()
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter records by type for different sections
  const recentRecords = records.slice(0, 3)
  const prescriptionRecords = records.filter((record) => record.prescriptions && record.prescriptions.length > 0)

  // Calculate stats from real data
  const totalRecords = records.length
  const activePrescriptions = prescriptionRecords.length
  const sharedAccess = records.reduce((acc, record) => acc + (record.sharedWith?.length || 0), 0)

  // Update the loading state to use the new spinner
  if (loading) {
    return (
      <DashboardLayout userType="patient" userName={user?.username || "Patient"} userEmail={user?.email || ""}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading your medical records..." />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="patient" userName={user?.username || "Patient"} userEmail={user?.email || ""}>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading records: {error}</p>
          <Button onClick={fetchRecords}>Try Again</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="patient" userName={user?.username || "Patient"} userEmail={user?.email || ""}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
            <p className="text-gray-600 mt-1">Manage your health records and prescriptions</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Records
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Records", value: totalRecords.toString(), icon: FileText, color: "text-blue-600" },
            {
              label: "Active Prescriptions",
              value: activePrescriptions.toString(),
              icon: Pill,
              color: "text-green-600",
            },
            { label: "Upcoming Appointments", value: "0", icon: Calendar, color: "text-purple-600" }, // This would need a separate API
            { label: "Shared Access", value: sharedAccess.toString(), icon: Share2, color: "text-orange-600" },
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
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Recent Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRecords.map((record) => (
                      <motion.div
                        key={record._id}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => setSelectedRecord(record._id)}
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.recordEntries?.[0]?.summary || "Medical Record"}
                          </p>
                          <p className="text-sm text-gray-600">{record.doctorId || "Unknown Doctor"}</p>
                          <p className="text-xs text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="secondary">{record.recordEntries?.[0]?.type || "record"}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Prescriptions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Active Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prescriptionRecords.map((prescription) => (
                      <div key={prescription._id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{prescription.recordEntries?.[0]?.summary}</p>
                          <Badge variant="outline" className="text-green-600">
                            active
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Dosage info</p>
                        <p className="text-xs text-gray-500">Refills remaining</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Health Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {records.flatMap(
                    (record) =>
                      record.recordEntries?.map((entry, index) => (
                        <motion.div
                          key={`${record._id}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{entry.summary}</p>
                              <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm text-gray-600">{entry.details}</p>
                            <p className="text-xs text-gray-500 mt-1">Type: {entry.type}</p>
                          </div>
                        </motion.div>
                      )) || [],
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Medical Records</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Request Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {records.map((record, index) => (
                    <motion.div
                      key={record._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedRecord(record._id)}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="secondary">{record.recordEntries?.[0]?.type}</Badge>
                            <p className="text-xs text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{record.recordEntries?.[0]?.summary}</h3>
                          <p className="text-sm text-gray-600 mb-3">{record.recordEntries?.[0]?.details}</p>
                          {/* Add AccessControlDialog to the records section */}
                          <div className="flex items-center justify-between mt-3">
                            <AccessControlDialog record={record} onSuccess={fetchRecords} />
                            <p className="text-xs text-gray-500">by {record.doctorId}</p>
                          </div>
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
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>View and manage your current prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptionRecords.map((prescription, index) => (
                    <motion.div
                      key={prescription._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{prescription.recordEntries?.[0]?.summary}</h3>
                        <Badge variant="outline" className="text-green-600">
                          active
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Dosage</p>
                          <p className="font-medium">Dosage info</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium">Duration info</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Refills</p>
                          <p className="font-medium">Refills remaining</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Prescribed by</p>
                          <p className="font-medium">{prescription.doctorId}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(mockVitals).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 capitalize mb-2">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">{value}</p>
                      <p className="text-sm text-gray-500 mt-1">Last updated: Today</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
