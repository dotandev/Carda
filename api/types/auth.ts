import { Request } from "express";
import { RequestMetadata } from "./router";
import { ObjectId, Schema } from "mongoose";

interface IUser extends Document {
    _id: ObjectId;
    walletAddress: string;
    username: string;
    role: 'org' | 'doctor' | 'patient' | 'pharmacist';
    orgIds?: Schema.Types.ObjectId[];
    assignedPatients?: Schema.Types.ObjectId[];
    email: string;
    assignedDoctors?: Schema.Types.ObjectId[];
    sharedRecords?: Schema.Types.ObjectId[];
    sharedPrescriptions?: Schema.Types.ObjectId[];
  }

interface IDoctor extends Document {
    _id: ObjectId;
    name: string;
    walletAddress: string;
    role: 'org' | 'doctor' | 'patient' | 'pharmacist';
    username: string;
    specialization: string;
    email: string;
    orgId: Schema.Types.ObjectId; 
    assignedPatients?: Schema.Types.ObjectId[]; 
  }

interface IOrganization extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    role: 'org' | 'doctor' | 'patient' | 'pharmacist';
    walletAddress: string;
    username: string;
    doctors?: Schema.Types.ObjectId[]; // List of doctors in this organization
    patients?: Schema.Types.ObjectId[]; // List of patients associated with this organization
  }

interface IPharmacist extends Document {
    _id: ObjectId;
    role: 'org' | 'doctor' | 'patient' | 'pharmacist';
    name: string;
    email: string;
    orgId?: string; 
    walletAddress: string;
    username: string;
  }




interface IRole {
    id: string;
    name: string;
}
interface IToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}
interface IRefreshToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}
interface IAccessToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}
interface IPasswordResetToken {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}
interface IMetadata {
    ip: string;
    userAgent: string;
}

 interface AuthenticatedRequest extends Request {
    user: JWTPayload,
    metadata: RequestMetadata,
}

 interface AuthenticatedRequestWithToken extends Request {
    user: IUser,
    token: IToken,
    metadata: IMetadata,
}

 interface AppUser {
    id: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    lastLogin: Date;
    deviceInfo: {
      userAgent: string;
      ip: string;
      location?: string;
    };
    sessionToken: string;
  }
  
  type JWTPayload = {
    id: string;
    role?: 'doctor' | 'pharmacist' | 'patient' | 'org';
    email: string;
    walletAddress: string;
  };
  


  export { 
    IUser,  
    IDoctor,
    IOrganization,
    IPharmacist,
    IRole,
    IToken,
    IRefreshToken,
    IAccessToken,
    IPasswordResetToken,
    IMetadata,
    AuthenticatedRequest,
    AuthenticatedRequestWithToken,
    AppUser,
    JWTPayload
  }


