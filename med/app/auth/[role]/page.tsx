"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wallet, Mail, User, Building, Shield } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

const roleConfig = {
  patient: {
    title: "Patient Portal",
    description: "Access your medical records securely",
    color: "from-emerald-500 to-teal-600",
    icon: User,
  },
  doctor: {
    title: "Doctor Dashboard",
    description: "Manage patient records and prescriptions",
    color: "from-blue-500 to-indigo-600",
    icon: Shield,
  },
  organization: {
    title: "Organization Hub",
    description: "Oversee healthcare operations",
    color: "from-purple-500 to-violet-600",
    icon: Building,
  },
  pharmacist: {
    title: "Pharmacy System",
    description: "Verify prescriptions and manage inventory",
    color: "from-orange-500 to-red-600",
    icon: Shield,
  },
}

export default function AuthPage() {
  const params = useParams()
  const router = useRouter()
  const role = params.role as string
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    walletAddress: "",
    username: "",
    email: "",
    name: "",
    orgId: "",
  })

  const { login } = useAuth()

  const config = roleConfig[role as keyof typeof roleConfig]
  const Icon = config?.icon || User

  if (!config) {
    return <div>Invalid role</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let response

      if (isLogin) {
        // Login flow
        switch (role) {
          case "patient":
            response = await authAPI.loginUser(formData.walletAddress)
            break
          case "doctor":
            response = await authAPI.loginDoctor(formData.walletAddress)
            break
          case "organization":
            response = await authAPI.loginOrg(formData.walletAddress)
            break
          case "pharmacist":
            response = await authAPI.loginPharmacist(formData.walletAddress)
            break
          default:
            throw new Error("Invalid role")
        }
      } else {
        // Signup flow
        switch (role) {
          case "patient":
            response = await authAPI.createUser({
              walletAddress: formData.walletAddress,
              username: formData.username,
              role: "patient",
              email: formData.email,
            })
            break
          case "doctor":
            response = await authAPI.createDoctor({
              walletAddress: formData.walletAddress,
              username: formData.username,
              role: "doctor",
              name: formData.name,
              orgId: formData.orgId,
              email: formData.email,
            })
            break
          case "organization":
            response = await authAPI.createOrg({
              walletAddress: formData.walletAddress,
              username: formData.username,
              role: "org",
              name: formData.name,
              email: formData.email,
            })
            break
          case "pharmacist":
            response = await authAPI.createPharmacist({
              walletAddress: formData.walletAddress,
              username: formData.username,
              role: "pharmacist",
              name: formData.name,
              orgId: formData.orgId,
              email: formData.email,
            })
            break
          default:
            throw new Error("Invalid role")
        }
      }

      if (response.error) {
        throw new Error(response.error)
      }

      // For login, we expect a token in the response
      // For signup, we show success message and redirect to login
      if (isLogin && response.token) {
        login(response.token, response.user)
        router.push(`/dashboard/${role}`)
      } else {
        // Show success message for signup
        alert("Account created successfully! Please check your email for the magic link.")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      alert(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${config.color} flex items-center justify-center mb-4`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
            <Badge variant="secondary" className="w-fit mx-auto mt-2">
              {isLogin ? "Sign In" : "Create Account"}
            </Badge>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="wallet"
                    placeholder="addr1..."
                    className="pl-10"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange("walletAddress", e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="username"
                        placeholder="Enter username"
                        className="pl-10"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {(role === "doctor" || role === "pharmacist") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="org">Organization</Label>
                        <Select onValueChange={(value) => handleInputChange("orgId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="org1">General Hospital</SelectItem>
                            <SelectItem value="org2">City Medical Center</SelectItem>
                            <SelectItem value="org3">Regional Pharmacy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {role === "organization" && (
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input
                        id="orgName"
                        placeholder="Enter organization name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
