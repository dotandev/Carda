import { IMedicalRecord, IMedication, IPrescription, IRecordEntry, IVitals } from "../types/record";
import mongoose, { model, Schema } from "mongoose";

const MedicationSchema = new Schema<IMedication>({
  drugName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  route: { type: String, enum: ["oral", "intravenous", "topical", "inhalation", "other"], required: true },
  instructions: { type: String }
}, { _id: false });

const PrescriptionSchema = new Schema<IPrescription>({
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medications: { type: [MedicationSchema], required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String },
  issuedAt: { type: Date, default: Date.now },
  followUpDate: { type: Date }
}, {
  timestamps: true
});

const VitalsSchema = new Schema<IVitals>({
  temperature: Number,
  heartRate: Number,
  bloodPressure: String,
  respiratoryRate: Number,
  oxygenSaturation: Number
}, { _id: false });

const RecordEntrySchema = new Schema<IRecordEntry>({
  type: { type: String, enum: ["consultation", "lab", "imaging", "surgery", "note"], required: true },
  summary: { type: String, required: true },
  details: { type: String },
  date: { type: Date, required: true },
  attachedFiles: { type: [String], default: [] }
}, { _id: false });

const RecordSchema = new Schema<IMedicalRecord>({
  patientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctors" },  // added

  recordEntries: { type: [RecordEntrySchema], default: [] },   // added

  vitals: { type: VitalsSchema },                             // added

  allergies: { type: [String], default: [] },                 // added
  pastConditions: { type: [String], default: [] },            // added
  currentMedications: { type: [String], default: [] },        // added

  prescriptions: [{ type: Schema.Types.ObjectId, ref: "Prescriptions" }],

  sharedWith: [
    {
      userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
      access: { type: String, enum: ["read", "write"], required: true }
    }
  ],
}, { timestamps: true });


const Prescriptions = model<IPrescription>("Prescriptions",PrescriptionSchema);
const Records = model<IMedicalRecord>("Records", RecordSchema);

export {
  Prescriptions,
  Records
}
