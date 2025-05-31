"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, User, Stethoscope, Pill, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cardanoService } from "@/lib/lucid"
import { useToast } from "@/hooks/use-toast"

interface MedicalRecordFormProps {
  patientAddress?: string
  onClose: () => void
  onSuccess: (txHash: string) => void
}

export function MedicalRecordForm({ patientAddress, onClose, onSuccess }: MedicalRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientAddress: patientAddress || "",
    recordType: "",
    diagnosis: "",
    treatment: "",
    medications: [] as string[],
    newMedication: "",
  })
  const { toast } = useToast()

  const recordTypes = [
    "General Checkup",
    "Emergency Visit",
    "Surgery",
    "Lab Results",
    "Imaging",
    "Consultation",
    "Follow-up",
    "Vaccination",
  ]

  const handleAddMedication = () => {
    if (formData.newMedication.trim()) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, prev.newMedication.trim()],
        newMedication: "",
      }))
    }
  }

  const handleRemoveMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const doctorAddress = cardanoService.getConnectedWalletAddress()
      if (!doctorAddress) {
        throw new Error("Please connect your wallet first")
      }

      const txHash = await cardanoService.createMedicalRecord({
        patientAddress: formData.patientAddress,
        doctorAddress,
        recordType: formData.recordType,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        medications: formData.medications,
      })

      toast({
        title: "Medical Record Created",
        description: `Transaction submitted: ${txHash.slice(0, 20)}...`,
      })

      onSuccess(txHash)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create medical record",
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
              <FileText className="w-5 h-5" />
              Create Medical Record
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

            {/* Record Type */}
            <div className="space-y-2">
              <Label htmlFor="recordType" className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Record Type
              </Label>
              <Select
                value={formData.recordType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, recordType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Enter diagnosis details..."
                rows={3}
                required
              />
            </div>

            {/* Treatment */}
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan</Label>
              <Textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) => setFormData((prev) => ({ ...prev, treatment: e.target.value }))}
                placeholder="Enter treatment plan..."
                rows={3}
                required
              />
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Medications
              </Label>
              <div className="flex gap-2">
                <Input
                  value={formData.newMedication}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newMedication: e.target.value }))}
                  placeholder="Add medication..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMedication())}
                />
                <Button type="button" onClick={handleAddMedication} variant="outline">
                  Add
                </Button>
              </div>
              {formData.medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medications.map((medication, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {medication}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Create Record
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
