export interface IValidator<T> {
    validateCreate(item: T): Promise<void>;
    validateUpdate(item: T): Promise<void>;
    validateDelete(id: string): Promise<void>;
    validateGet(id: string): Promise<void>;
    validateGetAll(): Promise<void>;
    validateGetById(id: string): Promise<void>;
    validateGetByField(field: string, value: string): Promise<void>;
    validateGetByFields(fields: Record<string, string>): Promise<void>;
}