const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Types based on your backend models
export interface User {
  _id: string
  walletAddress: string
  username: string
  role: "patient" | "doctor" | "pharmacist" | "org"
  email: string
  orgIds?: string[]
  assignedPatients?: string[]
  assignedDoctors?: string[]
  sharedRecords?: string[]
  sharedPrescriptions?: string[]
}

export interface Doctor {
  _id: string
  walletAddress: string
  username: string
  role: "doctor"
  name: string
  orgId?: string
  assignedPatients?: string[]
  email: string
}

export interface Organization {
  _id: string
  walletAddress: string
  username: string
  role: "org"
  name: string
  doctors?: string[]
  patients?: string[]
  email: string
}

export interface Pharmacist {
  _id: string
  walletAddress: string
  username: string
  role: "pharmacist"
  name: string
  orgId?: string
  email: string
}

export interface MedicalRecord {
  _id: string
  patientId: string
  doctorId?: string
  recordEntries?: RecordEntry[]
  vitals?: Vitals
  allergies?: string[]
  pastConditions?: string[]
  currentMedications?: string[]
  prescriptions?: string[]
  sharedWith?: SharedAccess[]
  createdAt: string
  updatedAt: string
}

export interface RecordEntry {
  type: "consultation" | "lab" | "imaging" | "surgery" | "note"
  summary: string
  details?: string
  date: string
  attachedFiles?: string[]
}

export interface Vitals {
  temperature?: number
  heartRate?: number
  bloodPressure?: string
  respiratoryRate?: number
  oxygenSaturation?: number
}

export interface SharedAccess {
  userId: string
  access: "read" | "write"
}

export interface Prescription {
  _id: string
  patientId: string
  doctorId: string
  medications: Medication[]
  diagnosis: string
  notes?: string
  issuedAt: string
  followUpDate?: string
  createdAt: string
  updatedAt: string
}

export interface Medication {
  drugName: string
  dosage: string
  frequency: string
  duration: string
  route: "oral" | "intravenous" | "topical" | "inhalation" | "other"
  instructions?: string
}

// Add error handling wrapper function
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Network error" }))
    throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`)
  }
  return response.json()
}

// Auth API functions
export const authAPI = {
  // User authentication
  createUser: async (userData: {
    walletAddress: string
    username: string
    role: "patient"
    email: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/signup/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleApiResponse(response)
  },

  loginUser: async (walletAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
    return handleApiResponse(response)
  },

  // Doctor authentication
  createDoctor: async (doctorData: {
    walletAddress: string
    username: string
    role: "doctor"
    name: string
    orgId?: string
    email: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/signup/doctor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorData),
    })
    return handleApiResponse(response)
  },

  loginDoctor: async (walletAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/doctor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
    return handleApiResponse(response)
  },

  // Organization authentication
  createOrg: async (orgData: {
    walletAddress: string
    username: string
    role: "org"
    name: string
    email: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/signup/org`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orgData),
    })
    return handleApiResponse(response)
  },

  loginOrg: async (walletAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/org`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
    return handleApiResponse(response)
  },

  // Pharmacist authentication
  createPharmacist: async (pharmacistData: {
    walletAddress: string
    username: string
    role: "pharmacist"
    name: string
    orgId?: string
    email: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/signup/pharmacist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pharmacistData),
    })
    return handleApiResponse(response)
  },

  loginPharmacist: async (walletAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/api/login/pharmacist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
    return handleApiResponse(response)
  },
}

// Records API functions (requires authentication token)
export const recordsAPI = {
  // Get all accessible records for the logged-in user
  getAccessibleRecords: async (token: string): Promise<MedicalRecord[]> => {
    const response = await fetch(`${API_BASE_URL}/api/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return handleApiResponse(response)
  },

  // Get specific record by ID
  getRecord: async (recordId: string, token: string): Promise<MedicalRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    return handleApiResponse(response)
  },

  // Create new medical record
  createRecord: async (recordData: Partial<MedicalRecord>, token: string): Promise<MedicalRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    })
    return handleApiResponse(response)
  },

  // Update medical record
  updateRecord: async (recordId: string, updateData: Partial<MedicalRecord>, token: string): Promise<MedicalRecord> => {
    const response = await fetch(`${API_BASE_URL}/api/records/${recordId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
    return handleApiResponse(response)
  },

  // Delete medical record
  deleteRecord: async (recordId: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/records/${recordId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) throw new Error("Failed to delete record")
  },

  // Add access to a record
  addAccess: async (recordId: string, userId: string, access: "read" | "write", token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/records/${recordId}/access`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, access }),
    })
    return handleApiResponse(response)
  },

  // Remove access from a record
  removeAccess: async (recordId: string, userId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/records/${recordId}/access`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
    return handleApiResponse(response)
  },
}

// Utility function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Utility function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

// Utility function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// Utility function to get user data from localStorage
export const getUserData = (): any | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Utility function to set user data
export const setUserData = (userData: any): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(userData))
  }
}

// Utility function to remove user data
export const removeUserData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData")
  }
}
