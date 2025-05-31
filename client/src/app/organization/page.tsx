"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building, Users, UserPlus, Search, Plus, Settings, Bell, Activity, Stethoscope, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { MedicalAPI } from "@/lib/api"
import type { IOrganization, IDoctor, IUser } from "@/lib/types"

export default function OrganizationDashboard() {
  const [organization, setOrganization] = useState<IOrganization | null>(null)
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [patients, setPatients] = useState<IUser[]>([])
  const [availableDoctors, setAvailableDoctors] = useState<IDoctor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [showAssignDoctor, setShowAssignDoctor] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const { toast } = useToast()

  // Form states
  const [newOrgData, setNewOrgData] = useState({
    name: "",
    walletAddress: "",
    username: "",
  })

  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    walletAddress: "",
    username: "",
  })

  useEffect(() => {
    loadOrganizationData()
  }, [])

  const loadOrganizationData = async () => {
    try {
      // In a real app, get current org from auth context
      const orgId = "current-org-id" // Replace with actual org ID
      const [orgDoctors, orgPatients] = await Promise.all([
        MedicalAPI.getOrganizationDoctors(orgId),
        MedicalAPI.getOrganizationPatients(orgId),
      ])
      setDoctors(orgDoctors)
      setPatients(orgPatients)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      })
    }
  }

  const handleCreateOrganization = async () => {
    try {
      const newOrg = await MedicalAPI.createOrganization({
        ...newOrgData,
        role: "org",
        doctors: [],
        patients: [],
      })
      setOrganization(newOrg)
      toast({
        title: "Success",
        description: "Organization created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      })
    }
  }

  const handleAddDoctor = async () => {
    try {
      const newDoctor = await MedicalAPI.createDoctor({
        ...newDoctorData,
        role: "doctor",
        orgId: organization?._id,
        assignedPatients: [],
      })

      if (organization?._id) {
        await MedicalAPI.addDoctorToOrg(organization._id.toString(), newDoctor._id!.toString())
        setDoctors([...doctors, newDoctor])
        setShowAddDoctor(false)
        setNewDoctorData({ name: "", walletAddress: "", username: "" })
        toast({
          title: "Success",
          description: "Doctor added successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add doctor",
        variant: "destructive",
      })
    }
  }

  const handleAssignDoctor = async () => {
    try {
      if (organization?._id && selectedDoctor && selectedPatient) {
        await MedicalAPI.assignDoctorToPatient(organization._id.toString(), selectedDoctor, selectedPatient)
        toast({
          title: "Success",
          description: "Doctor assigned to patient successfully",
        })
        setShowAssignDoctor(false)
        setSelectedDoctor("")
        setSelectedPatient("")
        loadOrganizationData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign doctor",
        variant: "destructive",
      })
    }
  }

  const filteredDoctors = doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredPatients = patients.filter((patient) =>
    patient.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <p className="text-sm text-gray-600">{organization?.name || "Healthcare Organization"}</p>
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
                <AvatarFallback>ORG</AvatarFallback>
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
                  <p className="text-orange-600 text-sm font-medium">Total Doctors</p>
                  <p className="text-2xl font-bold text-orange-800">{doctors.length}</p>
                </div>
                <Stethoscope className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-800">{patients.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Records</p>
                  <p className="text-2xl font-bold text-green-800">1,247</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold text-purple-800">98%</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="doctors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="doctors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Doctors Management</h2>
              <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctorName">Doctor Name</Label>
                      <Input
                        id="doctorName"
                        value={newDoctorData.name}
                        onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                        placeholder="Dr. John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="doctorWallet">Wallet Address</Label>
                      <Input
                        id="doctorWallet"
                        value={newDoctorData.walletAddress}
                        onChange={(e) => setNewDoctorData({ ...newDoctorData, walletAddress: e.target.value })}
                        placeholder="addr1..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="doctorUsername">Username</Label>
                      <Input
                        id="doctorUsername"
                        value={newDoctorData.username}
                        onChange={(e) => setNewDoctorData({ ...newDoctorData, username: e.target.value })}
                        placeholder="dr.johnsmith"
                      />
                    </div>
                    <Button onClick={handleAddDoctor} className="w-full">
                      Add Doctor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor._id?.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>
                              {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                            <p className="text-sm text-gray-600">@{doctor.username}</p>
                            <p className="text-xs text-gray-500">Patients: {doctor.assignedPatients.length}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Patients Management</h2>
            </div>

            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <motion.div
                  key={patient._id?.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>
                              {patient.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800">{patient.username}</h3>
                            <p className="text-sm text-gray-600">Patient ID: {patient._id?.toString().slice(-8)}</p>
                            <p className="text-xs text-gray-500">Assigned Doctors: {patient.assignedDoctors.length}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                          <Button variant="outline" size="sm">
                            View Records
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Doctor-Patient Assignments</h2>
              <Dialog open={showAssignDoctor} onOpenChange={setShowAssignDoctor}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Doctor to Patient</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="selectDoctor">Select Doctor</Label>
                      <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor._id?.toString()} value={doctor._id?.toString() || ""}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="selectPatient">Select Patient</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient._id?.toString()} value={patient._id?.toString() || ""}>
                              {patient.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAssignDoctor} className="w-full">
                      Assign Doctor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor._id?.toString()} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">Assigned Patients: {doctor.assignedPatients.length}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                    placeholder="Healthcare Organization"
                  />
                </div>
                <div>
                  <Label htmlFor="orgWallet">Wallet Address</Label>
                  <Input
                    id="orgWallet"
                    value={newOrgData.walletAddress}
                    onChange={(e) => setNewOrgData({ ...newOrgData, walletAddress: e.target.value })}
                    placeholder="addr1..."
                  />
                </div>
                <div>
                  <Label htmlFor="orgUsername">Username</Label>
                  <Input
                    id="orgUsername"
                    value={newOrgData.username}
                    onChange={(e) => setNewOrgData({ ...newOrgData, username: e.target.value })}
                    placeholder="healthcare_org"
                  />
                </div>
                <Button onClick={handleCreateOrganization} className="w-full">
                  Update Organization
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
