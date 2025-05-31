"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Building,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  Settings,
  Bell,
  Search,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

const organizationData = [
  { month: "Jan", records: 1200, prescriptions: 800, users: 150 },
  { month: "Feb", records: 1400, prescriptions: 950, users: 165 },
  { month: "Mar", records: 1600, prescriptions: 1100, users: 180 },
  { month: "Apr", records: 1350, prescriptions: 900, users: 175 },
  { month: "May", records: 1800, prescriptions: 1250, users: 195 },
  { month: "Jun", records: 2000, prescriptions: 1400, users: 210 },
]

const userDistribution = [
  { name: "Patients", value: 1250, color: "#3b82f6" },
  { name: "Doctors", value: 85, color: "#10b981" },
  { name: "Pharmacists", value: 45, color: "#8b5cf6" },
  { name: "Staff", value: 120, color: "#f59e0b" },
]

const departments = [
  {
    id: "1",
    name: "Cardiology",
    head: "Dr. Sarah Johnson",
    patients: 450,
    doctors: 12,
    efficiency: 94,
  },
  {
    id: "2",
    name: "Emergency",
    head: "Dr. Michael Chen",
    patients: 680,
    doctors: 18,
    efficiency: 87,
  },
  {
    id: "3",
    name: "Pediatrics",
    head: "Dr. Emily Davis",
    patients: 320,
    doctors: 8,
    efficiency: 96,
  },
]

export default function OrganizationDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Organization Portal</h1>
                <p className="text-sm text-gray-600">City General Hospital - Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
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
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold text-orange-800">1,500</p>
                  <p className="text-xs text-orange-600">+12% from last month</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Records Processed</p>
                  <p className="text-2xl font-bold text-blue-800">12,450</p>
                  <p className="text-xs text-blue-600">+8% from last month</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">System Uptime</p>
                  <p className="text-2xl font-bold text-green-800">99.9%</p>
                  <p className="text-xs text-green-600">Excellent performance</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Security Score</p>
                  <p className="text-2xl font-bold text-purple-800">98%</p>
                  <p className="text-xs text-purple-600">All systems secure</p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      System Activity
                    </CardTitle>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      records: { label: "Records", color: "hsl(var(--chart-1))" },
                      prescriptions: { label: "Prescriptions", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={organizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="records" fill="var(--color-records)" />
                        <Bar dataKey="prescriptions" fill="var(--color-prescriptions)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* User Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    User Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <RechartsPieChart data={userDistribution} cx="50%" cy="50%" outerRadius={80}>
                          {userDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </RechartsPieChart>
                        <ChartTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {userDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">New user registration</p>
                        <p className="text-sm text-gray-600">Dr. James Wilson joined Cardiology department</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">System update completed</p>
                        <p className="text-sm text-gray-600">Security patches applied successfully</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">High system load detected</p>
                        <p className="text-sm text-gray-600">Emergency department experiencing peak usage</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Department Overview</h2>
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid gap-6">
              {departments.map((department) => (
                <motion.div
                  key={department.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDepartment(department.id)}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-lg transition-all ${
                      selectedDepartment === department.id ? "ring-2 ring-orange-500" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Building className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{department.name}</h3>
                            <p className="text-gray-600">Head: {department.head}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{department.patients} patients</span>
                              <span>{department.doctors} doctors</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">Efficiency</span>
                            <Badge
                              variant={
                                department.efficiency >= 95
                                  ? "default"
                                  : department.efficiency >= 90
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {department.efficiency}%
                            </Badge>
                          </div>
                          <Progress value={department.efficiency} className="w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Processing Speed</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium">0.1%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed Login Attempts</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Encryption</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compliance Score</span>
                    <span className="font-medium">99.8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Concurrent Users</span>
                    <span className="font-medium">456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Storage Used</span>
                    <span className="font-medium">2.4 TB</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="doctors">Doctors</SelectItem>
                    <SelectItem value="patients">Patients</SelectItem>
                    <SelectItem value="pharmacists">Pharmacists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                        <p className="text-sm text-gray-600">Cardiology Department</p>
                        <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Doctor</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-gray-600">Patient ID: P001234</p>
                        <p className="text-xs text-gray-500">Last visit: 1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Patient</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>MP</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">Maria Pharmacist</h4>
                        <p className="text-sm text-gray-600">Downtown Pharmacy</p>
                        <p className="text-xs text-gray-500">Last active: 30 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Pharmacist</Badge>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
