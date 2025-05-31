import { Response, NextFunction, Request } from 'express';
import { AuthenticatedRequest } from './auth';

export type AuthenticatedHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

