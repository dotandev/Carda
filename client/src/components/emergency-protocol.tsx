"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Activity,
  Zap,
  Shield,
  User,
  FileText,
  Pill,
  Navigation,
  Siren,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  priority: number
  avatar?: string
}

interface MedicalInfo {
  bloodType: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergencyNotes: string
}

interface EmergencyProtocolProps {
  isActive?: boolean
  onActivate?: () => void
  onDeactivate?: () => void
  patientInfo?: {
    name: string
    age: number
    medicalInfo: MedicalInfo
    emergencyContacts: EmergencyContact[]
    location?: {
      lat: number
      lng: number
      address: string
    }
  }
}

export function EmergencyProtocol({ isActive = false, onActivate, onDeactivate, patientInfo }: EmergencyProtocolProps) {
  const [emergencyState, setEmergencyState] = useState<"idle" | "countdown" | "active" | "dispatched">("idle")
  const [countdown, setCountdown] = useState(10)
  const [dispatchTime, setDispatchTime] = useState<Date | null>(null)
  const [contactingServices, setContactingServices] = useState<string[]>([])
  const [vitals, setVitals] = useState({
    heartRate: 85,
    bloodPressure: "120/80",
    oxygenSat: 98,
    temperature: 98.6,
  })

  const emergencyServices = [
    { id: "ems", name: "Emergency Medical Services", phone: "911", icon: Siren },
    { id: "hospital", name: "Nearest Hospital", phone: "(555) 123-4567", icon: Heart },
    { id: "poison", name: "Poison Control", phone: "1-800-222-1222", icon: Shield },
    { id: "doctor", name: "Primary Care Doctor", phone: "(555) 987-6543", icon: User },
  ]

  const mockPatientInfo: typeof patientInfo = patientInfo || {
    name: "John Doe",
    age: 45,
    medicalInfo: {
      bloodType: "O+",
      allergies: ["Penicillin", "Shellfish"],
      medications: ["Lisinopril 10mg", "Metformin 500mg"],
      conditions: ["Hypertension", "Type 2 Diabetes"],
      emergencyNotes: "History of cardiac episodes. Prefers City General Hospital.",
    },
    emergencyContacts: [
      { id: "1", name: "Jane Doe", relationship: "Spouse", phone: "(555) 123-4567", priority: 1 },
      { id: "2", name: "Dr. Sarah Johnson", relationship: "Primary Care", phone: "(555) 987-6543", priority: 2 },
      { id: "3", name: "Mike Doe", relationship: "Brother", phone: "(555) 456-7890", priority: 3 },
    ],
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "123 Main St, New York, NY 10001",
    },
  }

  useEffect(() => {
    if (emergencyState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (emergencyState === "countdown" && countdown === 0) {
      activateEmergency()
    }
  }, [emergencyState, countdown])

  const startEmergencyCountdown = () => {
    setEmergencyState("countdown")
    setCountdown(10)
  }

  const cancelEmergency = () => {
    setEmergencyState("idle")
    setCountdown(10)
    onDeactivate?.()
  }

  const activateEmergency = async () => {
    setEmergencyState("active")
    setDispatchTime(new Date())
    onActivate?.()

    // Simulate contacting emergency services
    for (const service of emergencyServices) {
      setContactingServices((prev) => [...prev, service.id])
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setEmergencyState("dispatched")
  }

  const EmergencyButton = () => (
    <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <motion.button
        onClick={startEmergencyCountdown}
        disabled={emergencyState !== "idle"}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 border-4 border-red-300 shadow-2xl flex items-center justify-center relative overflow-hidden"
        animate={
          emergencyState === "countdown"
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 20px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                ],
              }
            : {}
        }
        transition={{ duration: 1, repeat: emergencyState === "countdown" ? Number.POSITIVE_INFINITY : 0 }}
      >
        <div className="text-center text-white">
          <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
          <span className="text-sm font-bold">EMERGENCY</span>
        </div>

        {emergencyState === "countdown" && (
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {emergencyState === "countdown" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <div className="text-3xl font-bold">{countdown}</div>
            <div className="text-xs">Activating...</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  const VitalsMonitor = () => (
    <Card className="bg-gray-900 border-red-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Activity className="w-5 h-5" />
          Live Vitals Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-400">Heart Rate</span>
            </div>
            <motion.div
              className="text-2xl font-bold text-red-400"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              {vitals.heartRate}
            </motion.div>
            <span className="text-xs text-gray-500">BPM</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Blood Pressure</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{vitals.bloodPressure}</div>
            <span className="text-xs text-gray-500">mmHg</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Oxygen Sat</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{vitals.oxygenSat}%</div>
            <span className="text-xs text-gray-500">SpO2</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Temperature</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{vitals.temperature}°</div>
            <span className="text-xs text-gray-500">Fahrenheit</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Emergency Status Header */}
      <Card
        className={`border-2 ${emergencyState === "idle" ? "border-gray-700" : "border-red-500"} ${emergencyState !== "idle" ? "bg-red-900/20" : ""}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={emergencyState !== "idle" ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5, repeat: emergencyState !== "idle" ? Number.POSITIVE_INFINITY : 0 }}
              >
                <AlertTriangle className={`w-6 h-6 ${emergencyState !== "idle" ? "text-red-400" : "text-gray-400"}`} />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white">Emergency Protocol System</h2>
                <p className="text-sm text-gray-400">Automated emergency response and medical alert system</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={emergencyState === "idle" ? "outline" : "destructive"}
                className={emergencyState !== "idle" ? "animate-pulse" : ""}
              >
                {emergencyState === "idle" && "Standby"}
                {emergencyState === "countdown" && "Countdown Active"}
                {emergencyState === "active" && "Emergency Active"}
                {emergencyState === "dispatched" && "Services Dispatched"}
              </Badge>

              {dispatchTime && (
                <div className="text-right text-sm">
                  <div className="text-gray-400">Activated</div>
                  <div className="text-white font-mono">{dispatchTime.toLocaleTimeString()}</div>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Emergency Activation */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">Emergency Activation</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <EmergencyButton />

              {emergencyState === "countdown" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <Progress value={(10 - countdown) * 10} className="h-2" />
                  <p className="text-sm text-gray-400">Emergency services will be contacted in {countdown} seconds</p>
                  <Button
                    onClick={cancelEmergency}
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    Cancel Emergency
                  </Button>
                </motion.div>
              )}

              {emergencyState === "active" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="text-red-400 font-semibold">🚨 EMERGENCY ACTIVE 🚨</div>
                  <p className="text-sm text-gray-400">Contacting emergency services...</p>
                  <div className="space-y-2">
                    {emergencyServices.map((service) => (
                      <div key={service.id} className="flex items-center gap-2 text-sm">
                        <service.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{service.name}</span>
                        {contactingServices.includes(service.id) ? (
                          <Badge variant="default" className="bg-green-600">
                            Contacted
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {emergencyState === "dispatched" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="text-green-400 font-semibold">✅ SERVICES DISPATCHED</div>
                  <p className="text-sm text-gray-400">Emergency responders are on the way</p>
                  <Badge className="bg-green-600">ETA: 8-12 minutes</Badge>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <VitalsMonitor />
        </div>

        {/* Patient Information */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback>
                  {mockPatientInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-white">{mockPatientInfo.name}</h3>
              <p className="text-gray-400">Age: {mockPatientInfo.age}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-white mb-2">Critical Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blood Type:</span>
                    <Badge variant="destructive">{mockPatientInfo.medicalInfo.bloodType}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-400">Allergies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mockPatientInfo.medicalInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-red-400 border-red-400">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Current Medications</h4>
                <div className="space-y-1">
                  {mockPatientInfo.medicalInfo.medications.map((med, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Pill className="w-3 h-3 text-blue-400" />
                      <span className="text-gray-300">{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Medical Conditions</h4>
                <div className="space-y-1">
                  {mockPatientInfo.medicalInfo.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="w-3 h-3 text-yellow-400" />
                      <span className="text-gray-300">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {mockPatientInfo.medicalInfo.emergencyNotes && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Emergency Notes</h4>
                  <p className="text-sm text-gray-300 bg-gray-800/50 p-2 rounded">
                    {mockPatientInfo.medicalInfo.emergencyNotes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts & Location */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPatientInfo.emergencyContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{contact.name}</p>
                    <p className="text-xs text-gray-400">{contact.relationship}</p>
                    <p className="text-sm text-gray-300 font-mono">{contact.phone}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Priority {contact.priority}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {mockPatientInfo.location && (
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-300">{mockPatientInfo.location.address}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Lat: {mockPatientInfo.location.lat}</span>
                    <span>Lng: {mockPatientInfo.location.lng}</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Navigation className="w-4 h-4 mr-2" />
                  Share Location with EMS
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
