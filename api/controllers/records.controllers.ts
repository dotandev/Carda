import { Request, Response } from "express";
import { Records } from "../models";
import { canAccessRecord } from "../utils/access";
import { AuthenticatedRequest } from "@/types";
import { IMedicalRecord, ISharedAccess } from "@/types/record";
import { ObjectId, Types } from "mongoose";

export class RecordController {
    async getRecord(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role as 'doctor' | 'pharmacist' | 'org' | 'patient';
            const recordId = req.params.recordId;

            if (!userId || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            const hasAccess = await canAccessRecord(recordId, userId, "read", userRole);
            if (!hasAccess) {
                 res.status(403).json({ message: "Forbidden: no read access to this record" });
            }

            const record = await Records.findById(recordId);
            if (!record) {
                 res.status(404).json({ message: "Record not found" });
            }

            res.json(record);
        } catch (err) {
            console.error("Get record error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateRecord(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role as 'doctor' | 'pharmacist';
            const recordId = req.params.recordId;
            const updateData = req.body; 

            if (!userId || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            const hasAccess = await canAccessRecord(recordId, userId, "write", userRole);
            if (!hasAccess) {
                 res.status(403).json({ message: "Forbidden: no write access to this record" });
            }

            const updatedRecord = await Records.findByIdAndUpdate(recordId, updateData, { new: true });
            if (!updatedRecord) {
                 res.status(404).json({ message: "Record not found" });
            }

            res.json(updatedRecord);
        } catch (err) {
            console.error("Update record error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteRecord(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role as 'doctor' | 'pharmacist';
            const recordId = req.params.recordId;

            if (!userId || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            const hasAccess = await canAccessRecord(recordId, userId, "write", userRole);
            if (!hasAccess) {
                 res.status(403).json({ message: "Forbidden: no write access to this record" });
            }

            const deletedRecord = await Records.findByIdAndDelete(recordId);
            if (!deletedRecord) {
                 res.status(404).json({ message: "Record not found" });
            }

            res.json({ message: "Record deleted successfully" });
        } catch (err) {
            console.error("Delete record error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async createRecord(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const recordData = req.body;

            if (!userId || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            if (userRole !== "doctor" && userRole !== "pharmacist") {
                 res.status(403).json({ message: "Forbidden: only medical staff can create records" });
            }

            const newRecord = new Records(recordData);
            await newRecord.save();

            res.status(201).json(newRecord);
        } catch (err) {
            console.error("Create record error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async addAccess(req: AuthenticatedRequest, res: Response) {
        try {
            const userRole = req.user?.role;
            const recordId = req.params.recordId;
            const { userId, access } = req.body as { userId: ObjectId; access: 'read' | 'write' };

            if (!req.user?.id || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            if (userRole !== "doctor" && userRole !== "pharmacist") {
                 res.status(403).json({ message: "Forbidden: only medical staff can modify access" });
            }

            const record = await Records.findById(recordId) as unknown as IMedicalRecord;
            if (!record)  res.status(404).json({ message: "Record not found" });

            // Ensure userId is doctor or pharmacist (maybe check userRole in real app)
            // Check if access entry already exists
            let sharedWith = record.sharedWith as ISharedAccess[] || [];

            const existingIndex = sharedWith.findIndex(entry => entry.userId === userId);
            if (existingIndex !== -1) {
                // Update existing access
                sharedWith[existingIndex].access = access;
            } else {
                // Add new access entry
                sharedWith.push({ userId: userId, access });
            }

            record.sharedWith = sharedWith;
            await record.save();

            res.json({ message: "Access updated", sharedWith });
        } catch (err) {
            console.error("Add access error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Remove access for a user from a record
    async removeAccess(req: AuthenticatedRequest, res: Response) {
        try {
            const userRole = req.user?.role;
            const recordId = req.params.recordId;
            const { userId } = req.body as { userId: string };

            if (!req.user?.id || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            if (userRole !== "doctor" && userRole !== "pharmacist") {
                 res.status(403).json({ message: "Forbidden: only medical staff can modify access" });
            }

            const record = await Records.findById(recordId) as unknown as IMedicalRecord;
            if (!record)  res.status(404).json({ message: "Record not found" });

            let sharedWith = record.sharedWith as ISharedAccess[] || [];

            sharedWith = sharedWith.filter(entry => entry.userId.toString() !== userId);

            record.sharedWith = sharedWith;
            await record.save();

            res.json({ message: "Access removed", sharedWith });
        } catch (err) {
            console.error("Remove access error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // Fetch all records the user has access to
    async getAccessibleRecords(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;

            if (!userId || !userRole) {
                 res.status(401).json({ message: "Unauthorized" });
            }

            let records;

            if (userRole === "patient") {
                // Patients get their own records
                records = await Records.find({ patientId: userId });
            } else if (userRole === "doctor" || userRole === "pharmacist") {
                // Doctors/pharmacists get records where they have shared access
                records = await Records.find({
                    sharedWith: {
                        $elemMatch: {
                            userId: new Types.ObjectId(userId)
                        }
                    }
                });
            } else {
                // Other roles no access
                 res.status(403).json({ message: "Forbidden: no records accessible" });
            }

            res.json(records);
        } catch (err) {
            console.error("Get accessible records error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
