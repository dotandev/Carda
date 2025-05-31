import { IValidator } from "@/types";
import Joi from "joi";

export abstract class BaseValidator<T> implements IValidator<T> {
  abstract createSchema: Joi.ObjectSchema;
  abstract updateSchema: Joi.ObjectSchema;
  
  async validateCreate(item: T): Promise<void> {
    await this.createSchema.validateAsync(item);
  }

  async validateUpdate(item: T): Promise<void> {
    await this.updateSchema.validateAsync(item);
  }

  async validateDelete(id: string): Promise<void> {
    Joi.string().required().validateAsync(id);
  }

  async validateGet(id: string): Promise<void> {
    Joi.string().required().validateAsync(id);
  }

  async validateGetAll(): Promise<void> {
    return;
  }

  async validateGetById(id: string): Promise<void> {
    Joi.string().required().validateAsync(id);
  }

  async validateGetByField(field: string, value: string): Promise<void> {
    Joi.string().required().validateAsync(field);
    Joi.string().required().validateAsync(value);
  }

  async validateGetByFields(fields: Record<string, string>): Promise<void> {
    Joi.object().pattern(Joi.string(), Joi.string().required()).validateAsync(fields);
  }
}
