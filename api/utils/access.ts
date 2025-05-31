import { ISharedAccess } from "@/types/record";
import { Records } from "../models";

export const canAccessRecord = async (
  recordId: string,
  userId: string,
  requiredAccess: 'read' | 'write',
  userRole: 'doctor' | 'pharmacist' | 'org' | 'patient'
): Promise<boolean> => {
  const record = await Records.findById(recordId);
  if (!record) return false;

  if (userRole === 'patient') {
    // Patients can only access their own records
    return record.patientId.toString() === userId;
  }

  // Only doctors and pharmacists have shared access permissions
  if (userRole === 'doctor' || userRole === 'pharmacist') {
    const sharedAccessList = record.sharedWith as unknown as ISharedAccess[] || [];
    const sharedEntry = sharedAccessList.find(entry => entry.userId.toString() === userId);
    if (!sharedEntry) return false;

    if (requiredAccess === 'read') {
      return sharedEntry.access === 'read' || sharedEntry.access === 'write';
    } else {
      // requiredAccess === 'write'
      return sharedEntry.access === 'write';
    }
  }

  // Other roles (org, etc.) no access by default
  return false;
};
