"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2, Trash2 } from "lucide-react"
import type { Medication } from "@/lib/api"

interface PrescriptionDialogProps {
  patientId?: string
  onSuccess?: (prescriptionData: any) => void
}

export function PrescriptionDialog({ patientId, onSuccess }: PrescriptionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    diagnosis: "",
    notes: "",
    followUpDate: "",
    medications: [
      {
        drugName: "",
        dosage: "",
        frequency: "",
        duration: "",
        route: "oral" as const,
        instructions: "",
      },
    ] as Medication[],
  })

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          drugName: "",
          dosage: "",
          frequency: "",
          duration: "",
          route: "oral" as const,
          instructions: "",
        },
      ],
    }))
  }

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would call your prescription API
      // For now, we'll just simulate the call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess?.(formData)
      setOpen(false)

      // Reset form
      setFormData({
        patientId: patientId || "",
        diagnosis: "",
        notes: "",
        followUpDate: "",
        medications: [
          {
            drugName: "",
            dosage: "",
            frequency: "",
            duration: "",
            route: "oral",
            instructions: "",
          },
        ],
      })
    } catch (error) {
      console.error("Error creating prescription:", error)
      alert("Failed to create prescription. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Write Prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write Prescription</DialogTitle>
          <DialogDescription>Create a new prescription for the patient</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
                placeholder="Enter patient ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, followUpDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Input
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
              placeholder="Enter diagnosis"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
              rows={3}
            />
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Medications</h3>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {formData.medications.map((medication, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  {formData.medications.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(index)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Drug Name</Label>
                    <Input
                      value={medication.drugName}
                      onChange={(e) => updateMedication(index, "drugName", e.target.value)}
                      placeholder="e.g., Lisinopril"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Dosage</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Input
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                      placeholder="e.g., Once daily"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      placeholder="e.g., 30 days"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select
                      value={medication.route}
                      onValueChange={(value: any) => updateMedication(index, "route", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="intravenous">Intravenous</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="inhalation">Inhalation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Instructions</Label>
                    <Input
                      value={medication.instructions}
                      onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                      placeholder="Special instructions"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Prescription
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
