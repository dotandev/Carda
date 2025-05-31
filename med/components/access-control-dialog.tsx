"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Share2, Plus, Trash2, Loader2 } from "lucide-react"
import { useRecords } from "@/hooks/use-records"
import type { MedicalRecord } from "@/lib/api"

interface AccessControlDialogProps {
  record: MedicalRecord
  onSuccess?: () => void
}

export function AccessControlDialog({ record, onSuccess }: AccessControlDialogProps) {
  const { addAccess, removeAccess } = useRecords()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newAccess, setNewAccess] = useState({
    userId: "",
    access: "read" as "read" | "write",
  })

  const handleAddAccess = async () => {
    if (!newAccess.userId) return

    setLoading(true)
    try {
      await addAccess(record._id, newAccess.userId, newAccess.access)
      setNewAccess({ userId: "", access: "read" })
      onSuccess?.()
    } catch (error) {
      console.error("Error adding access:", error)
      alert("Failed to add access. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAccess = async (userId: string) => {
    setLoading(true)
    try {
      await removeAccess(record._id, userId)
      onSuccess?.()
    } catch (error) {
      console.error("Error removing access:", error)
      alert("Failed to remove access. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Manage Access
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Record Access</DialogTitle>
          <DialogDescription>Control who can view and edit this medical record</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Current Access</h3>
            {record.sharedWith && record.sharedWith.length > 0 ? (
              <div className="space-y-2">
                {record.sharedWith.map((access, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{access.userId}</p>
                      <Badge variant="outline" className="text-xs">
                        {access.access}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAccess(access.userId)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shared access configured</p>
            )}
          </div>

          {/* Add New Access */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Add New Access</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID"
                  value={newAccess.userId}
                  onChange={(e) => setNewAccess((prev) => ({ ...prev, userId: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access">Access Level</Label>
                <Select
                  value={newAccess.access}
                  onValueChange={(value: "read" | "write") => setNewAccess((prev) => ({ ...prev, access: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read & Write</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddAccess} disabled={loading || !newAccess.userId} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Access
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
