export interface IBase<T> {
    create(item: T): Promise<T>;
    findAll(query: any): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    update(id: string, item: T): Promise<T | null>;
    delete(id: string): Promise<boolean>;
  }
  