import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

export const Users = model<IUser>("Users", UserSchema);
