import { BookiesRouter } from "../types";
import { RecordController } from "../controllers";
import express from "express";
import { Authenticator } from "../middlewares";

const { authenticate } = new Authenticator();


export const recordAuthRouter = BookiesRouter()
const controller = new RecordController();

// Apply authentication middleware globally for these routes
recordAuthRouter.use(authenticate);

// CRUD routes
recordAuthRouter.get("/:recordId", controller.getRecord);
recordAuthRouter.put("/:recordId", controller.updateRecord);
recordAuthRouter.delete("/:recordId", controller.deleteRecord);
recordAuthRouter.post("/", controller.createRecord);

// Access management routes
recordAuthRouter.post("/:recordId/access", controller.addAccess);      // Add or update access
recordAuthRouter.delete("/:recordId/access", controller.removeAccess); // Remove access

// Get all records accessible by the logged-in user
recordAuthRouter.get("/", controller.getAccessibleRecords);

