import { Router } from "express";
import { PatientController } from "../controllers";
import { Authenticator, createValidatorMiddleware } from "../middlewares";
import { CardaRouter } from "../types";
import { PatientValidator } from "../validators/patient.validator";


const authenticator = new Authenticator();
const patientController = new PatientController();
export const patientAuthRouter = CardaRouter();
export const patientRouter = Router();
const patientValidator = new PatientValidator();
const patientValidatorMiddleware = createValidatorMiddleware(patientValidator);


const {
    getPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
} = patientController;

const {
    authenticate,
    authorize,
    validateRequest
} = authenticator;

const {
    validateId,
    validateCreate,
    validateUpdate,
} = patientValidatorMiddleware

patientRouter
    .get("/", getPatients)
    .get("/:patientId", authenticate, validateId(":patientId"), getPatientById)

patientAuthRouter
    .post("/", authenticate, createPatient)
    .put("/:patientId", authenticate, validateId(":patientId"), updatePatient)
    .delete("/:patientId", authenticate, validateId(":patientId"), deletePatient);


// •⁠  ⁠GET /api/Patients (get all Patients)
// •⁠  ⁠POST /api/Patients (create new Patient)
// •⁠  ⁠GET /api/Patients/{patientId} (get Patient by ID)
// •⁠  ⁠PUT /api/Patients/{patientId} (update Patient)
// •⁠  ⁠DELETE /api/Patients/{patientId} (delete Patient)
