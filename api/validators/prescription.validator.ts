import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId"
});

export const createPrescriptionSchema = z.object({
  patientId: objectIdSchema,
  doctorId: objectIdSchema,
  medications: z.array(z.object({
    name: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),
    frequency: z.string().min(1, "Frequency is required"),
    duration: z.string().min(1, "Duration is required")
  })),
  notes: z.string().optional(),
  issuedDate: z.coerce.date().optional()
});

export const updatePrescriptionSchema = createPrescriptionSchema.partial();
