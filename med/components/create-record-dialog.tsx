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
import { Plus, Loader2 } from "lucide-react"
import { useRecords } from "@/hooks/use-records"
import type { RecordEntry } from "@/lib/api"

interface CreateRecordDialogProps {
  patientId?: string
  onSuccess?: () => void
}

export function CreateRecordDialog({ patientId, onSuccess }: CreateRecordDialogProps) {
  const { createRecord } = useRecords()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    recordEntry: {
      type: "consultation" as const,
      summary: "",
      details: "",
      date: new Date().toISOString().split("T")[0],
    },
    vitals: {
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
    allergies: "",
    pastConditions: "",
    currentMedications: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const recordData = {
        patientId: formData.patientId,
        recordEntries: [
          {
            type: formData.recordEntry.type,
            summary: formData.recordEntry.summary,
            details: formData.recordEntry.details,
            date: formData.recordEntry.date,
            attachedFiles: [],
          } as RecordEntry,
        ],
        vitals: {
          temperature: formData.vitals.temperature ? Number.parseFloat(formData.vitals.temperature) : undefined,
          heartRate: formData.vitals.heartRate ? Number.parseInt(formData.vitals.heartRate) : undefined,
          bloodPressure: formData.vitals.bloodPressure || undefined,
          respiratoryRate: formData.vitals.respiratoryRate
            ? Number.parseInt(formData.vitals.respiratoryRate)
            : undefined,
          oxygenSaturation: formData.vitals.oxygenSaturation
            ? Number.parseFloat(formData.vitals.oxygenSaturation)
            : undefined,
        },
        allergies: formData.allergies ? formData.allergies.split(",").map((a) => a.trim()) : [],
        pastConditions: formData.pastConditions ? formData.pastConditions.split(",").map((c) => c.trim()) : [],
        currentMedications: formData.currentMedications
          ? formData.currentMedications.split(",").map((m) => m.trim())
          : [],
      }

      await createRecord(recordData)
      setOpen(false)
      onSuccess?.()

      // Reset form
      setFormData({
        patientId: patientId || "",
        recordEntry: {
          type: "consultation",
          summary: "",
          details: "",
          date: new Date().toISOString().split("T")[0],
        },
        vitals: {
          temperature: "",
          heartRate: "",
          bloodPressure: "",
          respiratoryRate: "",
          oxygenSaturation: "",
        },
        allergies: "",
        pastConditions: "",
        currentMedications: "",
      })
    } catch (error) {
      console.error("Error creating record:", error)
      alert("Failed to create record. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Record
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Medical Record</DialogTitle>
          <DialogDescription>Add a new medical record for the patient</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient ID */}
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

          {/* Record Entry */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Record Entry</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.recordEntry.type}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({
                      ...prev,
                      recordEntry: { ...prev.recordEntry, type: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Lab Test</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="note">Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.recordEntry.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recordEntry: { ...prev.recordEntry, date: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                value={formData.recordEntry.summary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recordEntry: { ...prev.recordEntry, summary: e.target.value },
                  }))
                }
                placeholder="Brief summary of the record"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={formData.recordEntry.details}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recordEntry: { ...prev.recordEntry, details: e.target.value },
                  }))
                }
                placeholder="Detailed description"
                rows={3}
              />
            </div>
          </div>

          {/* Vitals */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vitals</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.vitals.temperature}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vitals: { ...prev.vitals, temperature: e.target.value },
                    }))
                  }
                  placeholder="98.6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={formData.vitals.heartRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vitals: { ...prev.vitals, heartRate: e.target.value },
                    }))
                  }
                  placeholder="72"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  value={formData.vitals.bloodPressure}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vitals: { ...prev.vitals, bloodPressure: e.target.value },
                    }))
                  }
                  placeholder="120/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={formData.vitals.respiratoryRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vitals: { ...prev.vitals, respiratoryRate: e.target.value },
                    }))
                  }
                  placeholder="16"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  step="0.1"
                  value={formData.vitals.oxygenSaturation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vitals: { ...prev.vitals, oxygenSaturation: e.target.value },
                    }))
                  }
                  placeholder="98"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies (comma-separated)</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                placeholder="Penicillin, Shellfish"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pastConditions">Past Conditions (comma-separated)</Label>
              <Input
                id="pastConditions"
                value={formData.pastConditions}
                onChange={(e) => setFormData((prev) => ({ ...prev, pastConditions: e.target.value }))}
                placeholder="Hypertension, Diabetes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Medications (comma-separated)</Label>
              <Input
                id="currentMedications"
                value={formData.currentMedications}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
                placeholder="Lisinopril 10mg, Metformin 500mg"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
