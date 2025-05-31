import { IDoctor, IOrganization, IPharmacist, IUser } from '../types';
import { Schema, model, Document, models } from 'mongoose';



const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  role: { type: String, enum: ['org', 'doctor', 'patient', 'pharmacist'], required: true },
  orgIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assignedPatients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  assignedDoctors: [{ type: Schema.Types.ObjectId, ref: 'Doctors' }],
  sharedRecords: [{ type: Schema.Types.ObjectId, ref: 'Records' }],
  email: { type: String, required: true, unique: true },
  sharedPrescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescriptions' }],
});

const DoctorSchema = new Schema<IDoctor>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  orgId: { type: Schema.Types.ObjectId, ref: 'Orgs' },
  role: { type: String, enum: ['org', 'doctor', 'patient', 'pharmacist'], required: true },
  name: { type: String, required: true },
  assignedPatients: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  email: { type: String, required: true, unique: true },
})

const OrgSchema = new Schema<IOrganization>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  role: { type: String, enum: ['org', 'doctor', 'patient', 'pharmacist'], required: true },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctors' }],
  patients: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

const PharmaSchema = new Schema<IPharmacist>({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  role: { type: String, enum: ['org', 'doctor', 'patient', 'pharmacist'], required: true },
  orgId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})


const Users = models.Users || model<IUser>("Users", UserSchema);
const Orgs = models.Orgs || model<IOrganization>("Orgs", OrgSchema);
const Doctors = models.Doctors || model<IDoctor>("Doctors", DoctorSchema);
const Pharmas = models.Pharmas || model<IPharmacist>("Pharmas", PharmaSchema);


export {
  Users,
  Orgs,
  Doctors,
  Pharmas
}


