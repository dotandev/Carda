import Joi from "joi";
import { IPatient } from "../types";
import { BaseValidator } from "./base.validator";

export class PatientValidator extends BaseValidator<IPatient> {
  createSchema = Joi.object({
    name: Joi.string().required(),
    userId: Joi.string().required(),
    uniqueName: Joi.string().required(),
    bio: Joi.string().optional(),
    photoUrl: Joi.string().uri().optional(),
    dob: Joi.date().optional(),
    nationality: Joi.string().optional(),
    genes: Joi.array().items(Joi.string()).optional(),
    isVerified: Joi.boolean().optional(),
    socialLinks: Joi.object({
      twitter: Joi.string().optional(),
      website: Joi.string().optional(),
      instagram: Joi.string().optional(),
      linkedin: Joi.string().optional(),
    }).optional(),
    awards: Joi.array().items(Joi.string()).optional(),
    totalDataPublished: Joi.number().optional(),
    followerOrgs: Joi.number().optional(),
  });

  updateSchema = this.createSchema.fork(
    Object.keys(this.createSchema.describe().keys),
    field => field.optional()
  );
}
