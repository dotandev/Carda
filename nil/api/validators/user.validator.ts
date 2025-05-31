import Joi from "joi";
import { IUser } from "../types";
import { BaseValidator } from "./base.validator";

export class UserValidator extends BaseValidator<IUser> {
    createSchema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username: Joi.string().alphanum().min(3).required(),
    });

    loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    updateSchema = Joi.object({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        username: Joi.string().alphanum().min(3),
    });
}
