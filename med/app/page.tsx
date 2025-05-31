"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Pill, ArrowRight, Stethoscope, Building2, UserCheck } from "lucide-react"
import Link from "next/link"

const userTypes = [
  {
    type: "patient",
    title: "Patient Portal",
    description: "Access your medical records, prescriptions, and health data securely",
    icon: Heart,
    color: "from-emerald-500 to-teal-600",
    features: ["View Medical Records", "Track Prescriptions", "Share with Doctors", "Health Timeline"],
  },
  {
    type: "doctor",
    title: "Doctor Dashboard",
    description: "Manage patient records, create prescriptions, and collaborate with healthcare teams",
    icon: Stethoscope,
    color: "from-blue-500 to-indigo-600",
    features: ["Patient Management", "Create Records", "Write Prescriptions", "Access Control"],
  },
  {
    type: "organization",
    title: "Organization Hub",
    description: "Oversee healthcare operations, manage staff, and ensure compliance",
    icon: Building2,
    color: "from-purple-500 to-violet-600",
    features: ["Staff Management", "System Overview", "Compliance Reports", "Data Analytics"],
  },
  {
    type: "pharmacist",
    title: "Pharmacy System",
    description: "Verify prescriptions, manage medication dispensing, and track inventory",
    icon: Pill,
    color: "from-orange-500 to-red-600",
    features: ["Prescription Verification", "Medication Tracking", "Inventory Management", "Patient Consultation"],
  },
]

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedChain</h1>
                <p className="text-sm text-gray-600">Secure Medical Records on Cardano</p>
              </div>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <UserCheck className="w-4 h-4 mr-2" />
              Blockchain-Secured Healthcare
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Secure Medical Records
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                On Cardano
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionizing healthcare with blockchain technology. Secure, transparent, and patient-controlled medical
              record management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Portal</h2>
            <p className="text-lg text-gray-600">Select your role to access the appropriate dashboard</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon
              return (
                <motion.div
                  key={userType.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onHoverStart={() => setSelectedType(userType.type)}
                  onHoverEnd={() => setSelectedType(null)}
                >
                  <Card className="h-full cursor-pointer group border-2 hover:border-blue-300 transition-all duration-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${userType.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{userType.title}</CardTitle>
                      <CardDescription className="text-sm">{userType.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AnimatePresence>
                        {selectedType === userType.type && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 mb-4"
                          >
                            {userType.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                                {feature}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Link href={`/auth/${userType.type}`}>
                        <Button className="w-full group">
                          Enter Portal
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MedChain?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on Cardano blockchain for maximum security, transparency, and patient control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Blockchain Security",
                description: "Your medical data is secured by Cardano's proof-of-stake blockchain technology",
              },
              {
                icon: Users,
                title: "Controlled Sharing",
                description: "You decide who can access your medical records with granular permission controls",
              },
              {
                icon: Heart,
                title: "Patient-Centric",
                description: "Designed with patients at the center, ensuring privacy and accessibility",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MedChain</span>
          </div>
          <p className="text-gray-400 mb-4">Secure, transparent, and patient-controlled medical records on Cardano</p>
          <p className="text-sm text-gray-500">© 2024 MedChain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
