import { z } from "zod";
import mongoose from "mongoose";
import { createPrescriptionSchema } from "./prescription.validator";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId"
});

export const createMedicalRecordSchema = z.object({
  patientId: objectIdSchema,
  doctorId: objectIdSchema,
  diagnosis: z.string().min(1, "Diagnosis is required"),
  symptoms: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  vitals: z.object({
    temperature: z.number().optional(),
    bloodPressure: z.string().optional(),
    heartRate: z.number().optional(),
    respiratoryRate: z.number().optional()
  }).optional(),
  visitDate: z.coerce.date().optional(),
  prescriptions: z.array(objectIdSchema).optional(),
  notes: z.string().optional()
});

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial();
