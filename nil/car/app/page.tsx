"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Shield, Users, Pill, ArrowRight, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Appy } from "./t"

const roles = [
  {
    id: "patient",
    title: "Patient",
    description: "Access your medical records and manage prescriptions",
    icon: Heart,
    color: "from-blue-500 to-cyan-500",
    href: "/patient",
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Create records, prescriptions, and verify patient data",
    icon: Stethoscope,
    color: "from-green-500 to-emerald-500",
    href: "/doctor",
  },
  {
    id: "pharmacist",
    title: "Pharmacist",
    description: "View prescriptions and dispense medications",
    icon: Pill,
    color: "from-purple-500 to-violet-500",
    href: "/pharmacist",
  },
  {
    id: "organization",
    title: "Organization",
    description: "Manage users and view system analytics",
    icon: Users,
    color: "from-orange-500 to-red-500",
    href: "/organization",
  },
]

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Appy />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MedChain
              </span>
            </div>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
              Connect Wallet
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Secure Medical Records on Cardano
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A decentralized platform for secure medical record verification, prescription management, and healthcare
            data sharing powered by blockchain technology.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>Patient-Centric</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Multi-Role Access</span>
            </div>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Choose Your Role</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setSelectedRole(role.id)}
                onHoverEnd={() => setSelectedRole(null)}
              >
                <Link href={role.href}>
                  <Card className="h-full cursor-pointer border-2 hover:border-transparent transition-all duration-300 group overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <CardHeader className="text-center relative z-10">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <role.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                        {role.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center relative z-10">
                      <CardDescription className="text-gray-600 mb-4">{role.description}</CardDescription>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: selectedRole === role.id ? 1 : 0,
                          x: selectedRole === role.id ? 0 : -10,
                        }}
                        className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <h3 className="text-2xl font-bold mb-8 text-gray-800">Why Choose MedChain?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Secure & Private</h4>
              <p className="text-gray-600 text-sm">End-to-end encryption with blockchain immutability</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Patient-Controlled</h4>
              <p className="text-gray-600 text-sm">Patients own and control their medical data</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Interoperable</h4>
              <p className="text-gray-600 text-sm">Seamless data sharing across healthcare providers</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
