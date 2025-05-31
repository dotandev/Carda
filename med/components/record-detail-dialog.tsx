"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Calendar, User, FileText, Activity } from "lucide-react"
import { AccessControlDialog } from "./access-control-dialog"
import type { MedicalRecord } from "@/lib/api"

interface RecordDetailDialogProps {
  record: MedicalRecord
  onSuccess?: () => void
}

export function RecordDetailDialog({ record, onSuccess }: RecordDetailDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical Record Details</DialogTitle>
          <DialogDescription>Created on {new Date(record.createdAt).toLocaleDateString()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                Patient ID
              </div>
              <p className="font-medium">{record.patientId}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Last Updated
              </div>
              <p className="font-medium">{new Date(record.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Record Entries */}
          {record.recordEntries && record.recordEntries.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Record Entries
              </h3>
              {record.recordEntries.map((entry, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{entry.type}</Badge>
                    <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <h4 className="font-medium">{entry.summary}</h4>
                  {entry.details && <p className="text-sm text-gray-600">{entry.details}</p>}
                  {entry.attachedFiles && entry.attachedFiles.length > 0 && (
                    <div className="text-sm text-gray-500">Attachments: {entry.attachedFiles.length} file(s)</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vitals */}
          {record.vitals && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Vital Signs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {record.vitals.temperature && (
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-medium">{record.vitals.temperature}°F</p>
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div>
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="font-medium">{record.vitals.heartRate} bpm</p>
                  </div>
                )}
                {record.vitals.bloodPressure && (
                  <div>
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="font-medium">{record.vitals.bloodPressure}</p>
                  </div>
                )}
                {record.vitals.respiratoryRate && (
                  <div>
                    <p className="text-sm text-gray-600">Respiratory Rate</p>
                    <p className="font-medium">{record.vitals.respiratoryRate} /min</p>
                  </div>
                )}
                {record.vitals.oxygenSaturation && (
                  <div>
                    <p className="text-sm text-gray-600">Oxygen Saturation</p>
                    <p className="font-medium">{record.vitals.oxygenSaturation}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical History */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {record.allergies && record.allergies.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                <div className="space-y-1">
                  {record.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {record.pastConditions && record.pastConditions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Past Conditions</h4>
                <div className="space-y-1">
                  {record.pastConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {record.currentMedications && record.currentMedications.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Medications</h4>
                <div className="space-y-1">
                  {record.currentMedications.map((medication, index) => (
                    <Badge key={index} variant="outline" className="mr-1">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Access Control */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Shared with {record.sharedWith?.length || 0} user(s)</p>
            </div>
            <AccessControlDialog record={record} onSuccess={onSuccess} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
