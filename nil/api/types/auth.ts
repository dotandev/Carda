import { Request } from "express";
import { RequestMetadata } from "./router";

interface IUser {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username: string;
    _id?: string;
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
    userId: string;
    role?: 'user' | 'admin';
    email: string;
  };
  


  export { 
    IUser,
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


