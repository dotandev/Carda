import { IBase } from "../types";
import { Model } from "mongoose";

export class UserService<T> implements Partial<IBase<T>> {
  private model: Model<T>;

  constructor(model: any) {
    this.model = model;
  }

  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }

  async findByEmail(email: string): Promise<T | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  async findByUsername(username: string): Promise<T | null> {
    return await this.model.findOne({ username });
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
