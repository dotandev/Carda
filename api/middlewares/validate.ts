import { IValidator } from "@/types/validators";
import { Request, Response, NextFunction } from "express";

export function createValidatorMiddleware<T>(
  validator: IValidator<T>
) {
  return {
    validateCreate: () => async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validator.validateCreate(req.body);
        next();
      } catch (err) {
        res.status(400).json({ error: "Validation error", details: err });
      }
    },
    validateUpdate: () => async (req: Request, res: Response, next: NextFunction) => {
      try {
        await validator.validateUpdate(req.body);
        next();
      } catch (err) {
        res.status(400).json({ error: "Validation error", details: err });
      }
    },
    validateId: (idType: string) => async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (idType === ":bookId") {
          await validator.validateGet(req.params.bookId);
        }
        if (idType === ":genreId") {
            await validator.validateGet(req.params.genreId)
        }
        if (idType === ":authorId") {
            await validator.validateGet(req.params.authorId)
        }
        next();
      } catch (err) {
        res.status(400).json({ error: "Invalid ID", details: err });
      }
    },

    validateFields: (fields: Record<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
        try {
          await validator.validateGetByFields(fields)
          next();
        } catch (err) {
          res.status(400).json({ error: "Validation error", details: err });
        }
      },
  };
}
