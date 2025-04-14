import { Document, ObjectId } from "mongoose";

export interface IPatientSocials {
  twitter?: string;
  website?: string;
  instagram?: string;
  linkedin?: string;
}

export interface IPatient extends Document {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  uniqueName: string;
  bio: string;
  photoUrl?: string;
  dob?: Date;
  nationality?: string;
  genes: ObjectId[]; 
  isVerified: boolean;
  socialLinks?: IPatientSocials;
  awards?: string[];
  totalDataPublished: number;
  followerOrgs: number;
  createdAt: Date;
  updatedAt: Date;
}
