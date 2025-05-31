import { CustomError, CustomSuccess } from "../middlewares";
import { Patients } from "../models";
import { AuthenticatedRequest } from "../types";
import { Request, Response } from "express";

export class PatientController {

    public async getPatients(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            console.log("page", page);
            const patients = await Patients.find()
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit))
            if (!patients) {
                throw new CustomError(404, "Patients not found").sendResponse(res);
            }
            console.log("Patients", patients);
            const totalPatients = await patients.length;
            const totalPages = Math.ceil(totalPatients / Number(limit));
            let data = {
                totalPatients,
                totalPages,
                currentPage: Number(page),
                patients,
            }
            throw new CustomSuccess(200, "Success", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }

    public async getPatientById(req: Request, res: Response) {
        try {
            const patient = await Patients.findById(req.params.PatientId);
            if (!patient) {
                throw new CustomError(404, "Patient not found").sendResponse(res);
            }
            const data = {
                patient,
            }
            throw new CustomSuccess(200, "Success", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }

    public async createPatient(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.body.uniqueName) {
                throw new CustomError(400, "Unique name is required").sendResponse(res);
            }
            const isPatientExist = await Patients.findOne({ uniqueName: req.body.uniqueName, userId: req.user.userId });
            if (isPatientExist) {
                throw new CustomError(409, "Patient already exists").sendResponse(res);
            }
            const patient = new Patients({
                ...req.body,
                userId: req.user.userId,
            });
            await patient.save();
            const data = {
                patient,
            }
            throw new CustomSuccess(201, "Patient created successfully", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }

    public async updatePatient(req: AuthenticatedRequest, res: Response) {
        try {
            const patient = await Patients.findByIdAndUpdate(req.params.PatientId, req.body, { new: true });
            if (!patient) {
                throw new CustomError(404, "Patient not found").sendResponse(res);
            }
            const data = {
                patient,
            }
            throw new CustomSuccess(200, "Success", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }

    public async deletePatient(req: AuthenticatedRequest, res: Response) {
        try {
            const patient = await Patients.findByIdAndDelete(req.params.patientId);
            if (!patient) {
                throw new CustomError(404, "Patient not found").sendResponse(res);
            }
            const data = {
                message: "Patient deleted successfully",
            }
            throw new CustomSuccess(200, "Success", data).sendResponse(res);
        } catch (error) {
            throw new CustomError(500, "Internal Server Error").sendResponse(res);
        }
    }
}
