import mongoose, { Schema, model, Types } from "mongoose";
import { IPatient } from "../types";

const PatientSchema: Schema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "Users", required: true },
    uniqueName: { type: String, required: true, unique: true },
    bio: { type: String },
    photoUrl: { type: String },
    dob: { type: Date },
    nationality: { type: String },
    genes: [{ type: [String] }],
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      twitter: String,
      website: String,
      instagram: String,
      linkedin: String,
    },
    awards: [String],
    totalDataPublished: { type: Number, default: 0 },
    followerOrgs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Patients = model<IPatient>("Patients", PatientSchema);
