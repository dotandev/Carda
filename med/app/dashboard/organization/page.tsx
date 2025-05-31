"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Search, Activity, TrendingUp, Shield, UserPlus, BarChart3, Settings } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

const mockStaff = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    department: "Cardiology",
    patients: 45,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Neurologist",
    department: "Neurology",
    patients: 38,
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    role: "Radiologist",
    department: "Radiology",
    patients: 52,
    status: "on-leave",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const mockDepartments = [
  {
    id: "1",
    name: "Cardiology",
    staff: 12,
    patients: 234,
    utilization: 85,
  },
  {
    id: "2",
    name: "Neurology",
    staff: 8,
    patients: 156,
    utilization: 72,
  },
  {
    id: "3",
    name: "Radiology",
    staff: 15,
    patients: 445,
    utilization: 91,
  },
]

const mockMetrics = [
  {
    label: "Total Staff",
    value: "127",
    change: "+5%",
    trend: "up",
  },
  {
    label: "Active Patients",
    value: "2,341",
    change: "+12%",
    trend: "up",
  },
  {
    label: "Records Created",
    value: "156",
    change: "+8%",
    trend: "up",
  },
  {
    label: "System Uptime",
    value: "99.9%",
    change: "0%",
    trend: "stable",
  },
]

export default function OrganizationDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const filteredStaff = mockStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout userType="organization" userName="General Hospital Admin" userEmail="admin@generalhospital.com">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Hub</h1>
            <p className="text-gray-600 mt-1">Oversee healthcare operations and manage staff</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {mockMetrics.map((metric, index) => (
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
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp
                          className={`w-4 h-4 mr-1 ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                                ? "text-red-600"
                                : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                                ? "text-red-600"
                                : "text-gray-400"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Department Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDepartments.map((dept, index) => (
                      <motion.div
                        key={dept.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{dept.name}</p>
                          <p className="text-sm text-gray-600">
                            {dept.staff} staff • {dept.patients} patients
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{dept.utilization}%</p>
                          <p className="text-xs text-gray-500">utilization</p>
                        </div>
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
                    System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New patient registered", user: "Dr. Sarah Johnson", time: "2 minutes ago" },
                      { action: "Medical record updated", user: "Dr. Michael Chen", time: "15 minutes ago" },
                      { action: "Prescription issued", user: "Dr. Emily Davis", time: "1 hour ago" },
                      { action: "Staff member added", user: "Admin", time: "2 hours ago" },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">by {activity.user}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { metric: "HIPAA Compliance", status: "Compliant", color: "text-green-600" },
                    { metric: "Data Encryption", status: "Active", color: "text-green-600" },
                    { metric: "Access Controls", status: "Configured", color: "text-green-600" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{item.metric}</p>
                      <p className={`text-sm ${item.color}`}>{item.status}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Staff Management</CardTitle>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff.map((staff, index) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-900">{staff.name}</p>
                          <p className="text-sm text-gray-600">
                            {staff.role} • {staff.department}
                          </p>
                          <p className="text-xs text-gray-500">{staff.patients} patients assigned</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={staff.status === "active" ? "secondary" : "outline"}>{staff.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDepartments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Staff Members</span>
                          <span className="font-medium">{dept.staff}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Patients</span>
                          <span className="font-medium">{dept.patients}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Utilization</span>
                          <span className="font-medium">{dept.utilization}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${dept.utilization}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Compliance Dashboard
                </CardTitle>
                <CardDescription>Monitor regulatory compliance and security standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "HIPAA Compliance",
                      status: "Compliant",
                      lastAudit: "2024-01-01",
                      nextAudit: "2024-07-01",
                      score: 98,
                    },
                    {
                      title: "Data Security",
                      status: "Secure",
                      lastAudit: "2024-01-15",
                      nextAudit: "2024-04-15",
                      score: 95,
                    },
                    {
                      title: "Access Controls",
                      status: "Configured",
                      lastAudit: "2024-01-10",
                      nextAudit: "2024-04-10",
                      score: 92,
                    },
                    {
                      title: "Audit Logs",
                      status: "Active",
                      lastAudit: "2024-01-20",
                      nextAudit: "2024-04-20",
                      score: 100,
                    },
                  ].map((compliance, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{compliance.title}</h3>
                        <Badge variant="secondary" className="text-green-600">
                          {compliance.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compliance Score</span>
                          <span className="font-medium">{compliance.score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Audit</span>
                          <span className="font-medium">{compliance.lastAudit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Audit</span>
                          <span className="font-medium">{compliance.nextAudit}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${compliance.score}%` }}
                        />
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
