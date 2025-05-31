"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Pill, User, Hash, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cardanoService } from "@/lib/lucid"
import { useToast } from "@/hooks/use-toast"

interface PrescriptionFormProps {
  patientAddress?: string
  onClose: () => void
  onSuccess: (txHash: string) => void
}

export function PrescriptionForm({ patientAddress, onClose, onSuccess }: PrescriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientAddress: patientAddress || "",
    medication: "",
    dosage: "",
    quantity: "",
    refills: "",
    instructions: "",
  })
  const { toast } = useToast()

  const commonMedications = [
    "Lisinopril",
    "Metformin",
    "Atorvastatin",
    "Amlodipine",
    "Omeprazole",
    "Levothyroxine",
    "Albuterol",
    "Hydrochlorothiazide",
    "Losartan",
    "Gabapentin",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const doctorAddress = cardanoService.getConnectedWalletAddress()
      if (!doctorAddress) {
        throw new Error("Please connect your wallet first")
      }

      const txHash = await cardanoService.createPrescription({
        patientAddress: formData.patientAddress,
        doctorAddress,
        medication: formData.medication,
        dosage: formData.dosage,
        quantity: Number.parseInt(formData.quantity),
        refills: Number.parseInt(formData.refills),
      })

      toast({
        title: "Prescription Created",
        description: `Transaction submitted: ${txHash.slice(0, 20)}...`,
      })

      onSuccess(txHash)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create prescription",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Create Prescription
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Address */}
            <div className="space-y-2">
              <Label htmlFor="patientAddress" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Address
              </Label>
              <Input
                id="patientAddress"
                value={formData.patientAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientAddress: e.target.value }))}
                placeholder="addr1..."
                required
                className="font-mono text-sm"
              />
            </div>

            {/* Medication */}
            <div className="space-y-2">
              <Label htmlFor="medication" className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Medication
              </Label>
              <Select
                value={formData.medication}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, medication: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {commonMedications.map((med) => (
                    <SelectItem key={med} value={med}>
                      {med}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or enter custom medication"
                value={formData.medication}
                onChange={(e) => setFormData((prev) => ({ ...prev, medication: e.target.value }))}
              />
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 10mg, 500mg, 1 tablet"
                required
              />
            </div>

            {/* Quantity and Refills */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refills">Refills</Label>
                <Input
                  id="refills"
                  type="number"
                  value={formData.refills}
                  onChange={(e) => setFormData((prev) => ({ ...prev, refills: e.target.value }))}
                  placeholder="2"
                  min="0"
                  max="11"
                  required
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="Take one tablet daily with food..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Create Prescription
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
