"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Stethoscope, Users, FileText, Pill, Plus, Search, Calendar, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MedicalAPI } from "@/lib/api"
import type { IUser, IMedicalRecord, IPrescription, IRecordEntry, IMedication } from "@/types"

export default function DoctorDashboard() {
  const [assignedPatients, setAssignedPatients] = useState<IUser[]>([])
  const [selectedPatient, setSelectedPatient] = useState<IUser | null>(null)
  const [patientRecords, setPatientRecords] = useState<IMedicalRecord[]>([])
  const [patientPrescriptions, setPatientPrescriptions] = useState<IPrescription[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateRecord, setShowCreateRecord] = useState(false)
  const [showCreatePrescription, setShowCreatePrescription] = useState(false)
  const [showJoinOrg, setShowJoinOrg] = useState(false)
  const { toast } = useToast()

  // Form states
  const [newRecord, setNewRecord] = useState({
    type: "consultation" as const,
    summary: "",
    details: "",
    vitals: {
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
    allergies: [] as string[],
    pastConditions: [] as string[],
    currentMedications: [] as string[],
  })

  const [newPrescription, setNewPrescription] = useState({
    diagnosis: "",
    notes: "",
    followUpDate: "",
    medications: [] as IMedication[],
  })

  const [newMedication, setNewMedication] = useState({
    drugName: "",
    dosage: "",
    frequency: "",
    duration: "",
    route: "oral" as const,
    instructions: "",
  })

  const [orgJoinData, setOrgJoinData] = useState({
    orgId: "",
  })

  useEffect(() => {
    loadDoctorData()
  }, [])

  const loadDoctorData = async () => {
    try {
      const doctorId = "current-doctor-id" // Replace with actual doctor ID from auth
      const patients = await MedicalAPI.getDoctorPatients(doctorId)
      setAssignedPatients(patients)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load doctor data",
        variant: "destructive",
      })
    }
  }

  const loadPatientData = async (patientId: string) => {
    try {
      const [records, prescriptions] = await Promise.all([
        MedicalAPI.getPatientRecords(patientId),
        MedicalAPI.getPatientPrescriptions(patientId),
      ])
      setPatientRecords(records)
      setPatientPrescriptions(prescriptions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load patient data",
        variant: "destructive",
      })
    }
  }

  const handleSelectPatient = (patient: IUser) => {
    setSelectedPatient(patient)
    if (patient._id) {
      loadPatientData(patient._id.toString())
    }
  }

  const handleCreateRecord = async () => {
    if (!selectedPatient?._id) return

    try {
      const recordEntry: IRecordEntry = {
        type: newRecord.type,
        summary: newRecord.summary,
        details: newRecord.details,
        date: new Date(),
        attachedFiles: [],
      }

      const recordData = {
        patientId: selectedPatient._id,
        doctorId: "current-doctor-id", // Replace with actual doctor ID
        recordEntries: [recordEntry],
        vitals: {
          temperature: Number(newRecord.vitals.temperature) || undefined,
          heartRate: Number(newRecord.vitals.heartRate) || undefined,
          bloodPressure: newRecord.vitals.bloodPressure || undefined,
          respiratoryRate: Number(newRecord.vitals.respiratoryRate) || undefined,
          oxygenSaturation: Number(newRecord.vitals.oxygenSaturation) || undefined,
        },
        allergies: newRecord.allergies,
        pastConditions: newRecord.pastConditions,
        currentMedications: newRecord.currentMedications,
        prescriptions: [],
      }

      await MedicalAPI.createMedicalRecord(recordData)
      toast({
        title: "Success",
        description: "Medical record created successfully",
      })
      setShowCreateRecord(false)
      loadPatientData(selectedPatient._id.toString())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create medical record",
        variant: "destructive",
      })
    }
  }

  const handleAddMedication = () => {
    if (newMedication.drugName && newMedication.dosage) {
      setNewPrescription({
        ...newPrescription,
        medications: [...newPrescription.medications, newMedication],
      })
      setNewMedication({
        drugName: "",
        dosage: "",
        frequency: "",
        duration: "",
        route: "oral",
        instructions: "",
      })
    }
  }

  const handleCreatePrescription = async () => {
    if (!selectedPatient?._id) return

    try {
      const prescriptionData = {
        patientId: selectedPatient._id,
        doctorId: "current-doctor-id", // Replace with actual doctor ID
        medications: newPrescription.medications,
        diagnosis: newPrescription.diagnosis,
        notes: newPrescription.notes,
        issuedAt: new Date(),
        followUpDate: newPrescription.followUpDate ? new Date(newPrescription.followUpDate) : undefined,
      }

      await MedicalAPI.createPrescription(prescriptionData)
      toast({
        title: "Success",
        description: "Prescription created successfully",
      })
      setShowCreatePrescription(false)
      loadPatientData(selectedPatient._id.toString())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      })
    }
  }

  const handleJoinOrganization = async () => {
    try {
      const doctorId = "current-doctor-id" // Replace with actual doctor ID
      await MedicalAPI.joinOrganization(doctorId, orgJoinData.orgId)
      toast({
        title: "Success",
        description: "Successfully joined organization",
      })
      setShowJoinOrg(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join organization",
        variant: "destructive",
      })
    }
  }

  const filteredPatients = assignedPatients.filter((patient) =>
    patient.username.toLowerCase().includes(searchTerm.toLowerCase()),
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
              <Dialog open={showJoinOrg} onOpenChange={setShowJoinOrg}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Building className="w-4 h-4 mr-2" />
                    Join Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Organization</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orgId">Organization ID</Label>
                      <Input
                        id="orgId"
                        value={orgJoinData.orgId}
                        onChange={(e) => setOrgJoinData({ orgId: e.target.value })}
                        placeholder="Enter organization ID"
                      />
                    </div>
                    <Button onClick={handleJoinOrganization} className="w-full">
                      Join Organization
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <p className="text-green-600 text-sm font-medium">Assigned Patients</p>
                  <p className="text-2xl font-bold text-green-800">{assignedPatients.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Records Created</p>
                  <p className="text-2xl font-bold text-blue-800">{patientRecords.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Prescriptions</p>
                  <p className="text-2xl font-bold text-purple-800">{patientPrescriptions.length}</p>
                </div>
                <Pill className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Today's Appointments</p>
                  <p className="text-2xl font-bold text-orange-800">8</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Patients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredPatients.map((patient) => (
                      <motion.div key={patient._id?.toString()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedPatient?._id === patient._id ? "ring-2 ring-green-500" : ""
                          }`}
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback>
                                  {patient.username
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{patient.username}</h4>
                                <p className="text-sm text-gray-600">ID: {patient._id?.toString().slice(-8)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <Tabs defaultValue="records" className="space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="records">Medical Records</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <Dialog open={showCreateRecord} onOpenChange={setShowCreateRecord}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                          <Plus className="w-4 h-4 mr-2" />
                          New Record
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Medical Record</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="recordType">Record Type</Label>
                            <Select
                              value={newRecord.type}
                              onValueChange={(value: any) => setNewRecord({ ...newRecord, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="lab">Lab Results</SelectItem>
                                <SelectItem value="imaging">Imaging</SelectItem>
                                <SelectItem value="surgery">Surgery</SelectItem>
                                <SelectItem value="note">Note</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="summary">Summary</Label>
                            <Input
                              id="summary"
                              value={newRecord.summary}
                              onChange={(e) => setNewRecord({ ...newRecord, summary: e.target.value })}
                              placeholder="Brief summary of the record"
                            />
                          </div>
                          <div>
                            <Label htmlFor="details">Details</Label>
                            <Textarea
                              id="details"
                              value={newRecord.details}
                              onChange={(e) => setNewRecord({ ...newRecord, details: e.target.value })}
                              placeholder="Detailed information"
                              rows={4}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="temperature">Temperature (°F)</Label>
                              <Input
                                id="temperature"
                                type="number"
                                value={newRecord.vitals.temperature}
                                onChange={(e) =>
                                  setNewRecord({
                                    ...newRecord,
                                    vitals: { ...newRecord.vitals, temperature: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                              <Input
                                id="heartRate"
                                type="number"
                                value={newRecord.vitals.heartRate}
                                onChange={(e) =>
                                  setNewRecord({
                                    ...newRecord,
                                    vitals: { ...newRecord.vitals, heartRate: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <Button onClick={handleCreateRecord} className="w-full">
                            Create Record
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showCreatePrescription} onOpenChange={setShowCreatePrescription}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Pill className="w-4 h-4 mr-2" />
                          New Prescription
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Prescription</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="diagnosis">Diagnosis</Label>
                            <Input
                              id="diagnosis"
                              value={newPrescription.diagnosis}
                              onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                              placeholder="Primary diagnosis"
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={newPrescription.notes}
                              onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                              placeholder="Additional notes"
                            />
                          </div>

                          {/* Medication Section */}
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-4">Add Medications</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="drugName">Drug Name</Label>
                                <Input
                                  id="drugName"
                                  value={newMedication.drugName}
                                  onChange={(e) => setNewMedication({ ...newMedication, drugName: e.target.value })}
                                  placeholder="e.g., Lisinopril"
                                />
                              </div>
                              <div>
                                <Label htmlFor="dosage">Dosage</Label>
                                <Input
                                  id="dosage"
                                  value={newMedication.dosage}
                                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                  placeholder="e.g., 10mg"
                                />
                              </div>
                              <div>
                                <Label htmlFor="frequency">Frequency</Label>
                                <Input
                                  id="frequency"
                                  value={newMedication.frequency}
                                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                  placeholder="e.g., Once daily"
                                />
                              </div>
                              <div>
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                  id="duration"
                                  value={newMedication.duration}
                                  onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                                  placeholder="e.g., 30 days"
                                />
                              </div>
                            </div>
                            <Button onClick={handleAddMedication} className="mt-4" variant="outline">
                              Add Medication
                            </Button>

                            {newPrescription.medications.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-medium mb-2">Added Medications:</h5>
                                {newPrescription.medications.map((med, index) => (
                                  <div key={index} className="p-2 bg-gray-50 rounded mb-2">
                                    <p className="font-medium">{med.drugName}</p>
                                    <p className="text-sm text-gray-600">
                                      {med.dosage} - {med.frequency} for {med.duration}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button onClick={handleCreatePrescription} className="w-full">
                            Create Prescription
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <TabsContent value="records" className="space-y-4">
                  {patientRecords.map((record) => (
                    <motion.div
                      key={record._id?.toString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{record.recordEntries[0]?.summary || "Medical Record"}</h4>
                              <p className="text-sm text-gray-600">Type: {record.recordEntries[0]?.type || "N/A"}</p>
                              <p className="text-xs text-gray-500">Created: {record.createdAt?.toLocaleDateString()}</p>
                            </div>
                            <Badge variant="outline">{record.recordEntries[0]?.type || "record"}</Badge>
                          </div>
                          {record.vitals && (
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                              <h5 className="font-medium mb-2">Vitals</h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {record.vitals.temperature && <p>Temperature: {record.vitals.temperature}°F</p>}
                                {record.vitals.heartRate && <p>Heart Rate: {record.vitals.heartRate} bpm</p>}
                                {record.vitals.bloodPressure && <p>Blood Pressure: {record.vitals.bloodPressure}</p>}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="prescriptions" className="space-y-4">
                  {patientPrescriptions.map((prescription) => (
                    <motion.div
                      key={prescription._id?.toString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{prescription.diagnosis}</h4>
                              <p className="text-sm text-gray-600">
                                Issued: {prescription.issuedAt.toLocaleDateString()}
                              </p>
                              {prescription.followUpDate && (
                                <p className="text-xs text-gray-500">
                                  Follow-up: {prescription.followUpDate.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">Prescription</Badge>
                          </div>
                          <div className="mt-4">
                            <h5 className="font-medium mb-2">Medications:</h5>
                            {prescription.medications.map((med, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded mb-2">
                                <p className="font-medium">{med.drugName}</p>
                                <p className="text-sm text-gray-600">
                                  {med.dosage} - {med.frequency} for {med.duration}
                                </p>
                                {med.instructions && <p className="text-xs text-gray-500">{med.instructions}</p>}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Patient</h3>
                  <p className="text-gray-500">
                    Choose a patient from the list to view their records and create new ones.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
