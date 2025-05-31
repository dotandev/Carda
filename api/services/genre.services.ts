import { IBase } from "../types";
import { Model, QueryOptions } from "mongoose";

export class GenreService<T> implements IBase<T> {
  private model: Model<T>;

  constructor(model: any) {
    this.model = model;
  }

  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }

  async findAll(query: any,): Promise<T[]> {

   let queryFilter = {};
    if (query) {
      queryFilter = { ...query };
    }
    if (query.title) {
      queryFilter = { ...queryFilter, title: query.title };
    }
    if (query.author) {
      queryFilter = { ...queryFilter, author: query.author };
    }
    return await this.model.find(queryFilter).populate("author").populate("genre");
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async update(id: string, item: T): Promise<T | null> {
    const updatingItem = { ...item } as QueryOptions;
    const updated = await this.model.findByIdAndUpdate(id, updatingItem, { new: true });
    return updated as T;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
