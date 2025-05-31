import type { IUser, IDoctor, IOrganization, IMedicalRecord, IPrescription } from "@/types"

const API_BASE = "/api"

export class MedicalAPI {
  // User Management
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return response.json()
  }

  static async getUserByWallet(walletAddress: string): Promise<IUser | null> {
    const response = await fetch(`${API_BASE}/users/wallet/${walletAddress}`)
    return response.ok ? response.json() : null
  }

  // Organization Management
  static async createOrganization(orgData: Partial<IOrganization>): Promise<IOrganization> {
    const response = await fetch(`${API_BASE}/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orgData),
    })
    return response.json()
  }

  static async addDoctorToOrg(orgId: string, doctorId: string): Promise<void> {
    await fetch(`${API_BASE}/organizations/${orgId}/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId }),
    })
  }

  static async assignDoctorToPatient(orgId: string, doctorId: string, patientId: string): Promise<void> {
    await fetch(`${API_BASE}/organizations/${orgId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId, patientId }),
    })
  }

  static async getOrganizationDoctors(orgId: string): Promise<IDoctor[]> {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/doctors`)
    return response.json()
  }

  static async getOrganizationPatients(orgId: string): Promise<IUser[]> {
    const response = await fetch(`${API_BASE}/organizations/${orgId}/patients`)
    return response.json()
  }

  // Doctor Management
  static async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
    const response = await fetch(`${API_BASE}/doctors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorData),
    })
    return response.json()
  }

  static async joinOrganization(doctorId: string, orgId: string): Promise<void> {
    await fetch(`${API_BASE}/doctors/${doctorId}/join-org`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId }),
    })
  }

  static async getDoctorPatients(doctorId: string): Promise<IUser[]> {
    const response = await fetch(`${API_BASE}/doctors/${doctorId}/patients`)
    return response.json()
  }

  // Medical Records
  static async createMedicalRecord(recordData: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const response = await fetch(`${API_BASE}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recordData),
    })
    return response.json()
  }

  static async getPatientRecords(patientId: string): Promise<IMedicalRecord[]> {
    const response = await fetch(`${API_BASE}/records/patient/${patientId}`)
    return response.json()
  }

  static async shareRecordWithPharmacist(recordId: string, pharmacistId: string): Promise<void> {
    await fetch(`${API_BASE}/records/${recordId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacistId }),
    })
  }

  static async revokeRecordAccess(recordId: string, pharmacistId: string): Promise<void> {
    await fetch(`${API_BASE}/records/${recordId}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacistId }),
    })
  }

  // Prescriptions
  static async createPrescription(prescriptionData: Partial<IPrescription>): Promise<IPrescription> {
    const response = await fetch(`${API_BASE}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prescriptionData),
    })
    return response.json()
  }

  static async getPatientPrescriptions(patientId: string): Promise<IPrescription[]> {
    const response = await fetch(`${API_BASE}/prescriptions/patient/${patientId}`)
    return response.json()
  }

  static async sharePrescriptionWithPharmacist(prescriptionId: string, pharmacistId: string): Promise<void> {
    await fetch(`${API_BASE}/prescriptions/${prescriptionId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacistId }),
    })
  }

  static async revokePrescriptionAccess(prescriptionId: string, pharmacistId: string): Promise<void> {
    await fetch(`${API_BASE}/prescriptions/${prescriptionId}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pharmacistId }),
    })
  }

  // Pharmacist Access
  static async getSharedRecords(pharmacistId: string): Promise<IMedicalRecord[]> {
    const response = await fetch(`${API_BASE}/pharmacists/${pharmacistId}/shared-records`)
    return response.json()
  }

  static async getSharedPrescriptions(pharmacistId: string): Promise<IPrescription[]> {
    const response = await fetch(`${API_BASE}/pharmacists/${pharmacistId}/shared-prescriptions`)
    return response.json()
  }

  // Patient Access Management
  static async giveAccessToOrganization(patientId: string, orgId: string): Promise<void> {
    await fetch(`${API_BASE}/patients/${patientId}/give-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId }),
    })
  }

  static async getAssignedDoctors(patientId: string): Promise<IDoctor[]> {
    const response = await fetch(`${API_BASE}/patients/${patientId}/doctors`)
    return response.json()
  }
}
