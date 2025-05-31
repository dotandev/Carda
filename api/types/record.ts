import { Document, ObjectId } from "mongoose";

export interface ISharedAccess {
    userId: ObjectId;
    access: "read" | "write";
  }

// Prescription Medication Entry
export interface IMedication {
  drugName: string;
  dosage: string;              // e.g. "500mg", "10ml"
  frequency: string;           // e.g. "twice a day"
  duration: string;            // e.g. "7 days"
  route: "oral" | "intravenous" | "topical" | "inhalation" | "other";
  instructions?: string;       // e.g. "Take after meals"
}

// Prescription Interface
export interface IPrescription extends Document {
  _id: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  medications: IMedication[];
  diagnosis: string;
  notes?: string;
  issuedAt: Date;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Vital signs snapshot
export interface IVitals {
  temperature?: number;        // in Celsius
  heartRate?: number;          // bpm
  bloodPressure?: string;      // e.g. "120/80"
  respiratoryRate?: number;    // breaths per minute
  oxygenSaturation?: number;   // %
}

// Medical Record Entry
export interface IRecordEntry {
  type: "consultation" | "lab" | "imaging" | "surgery" | "note";
  summary: string;
  details?: string;
  date: Date;
  attachedFiles?: string[];    // URLs or file references
}

// Medical Record Interface
export interface IMedicalRecord extends Document {
  _id: ObjectId;
  patientId: ObjectId;
  doctorId: ObjectId;
  recordEntries: IRecordEntry[];
  vitals?: IVitals;
  sharedWith?: ISharedAccess[]; // List of users with access to this record
  allergies?: string[];
  pastConditions?: string[];
  currentMedications?: string[];
  prescriptions?: ObjectId[];    // Reference to IPrescription
  createdAt: Date;
  updatedAt: Date;
}
