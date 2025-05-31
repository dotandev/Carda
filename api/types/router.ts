import { Router, RequestHandler } from 'express';
import { AppUser } from '../types/auth';
import { AuthenticatedHandler } from './handlers';


export interface RequestMetadata {
    requestId: string;
    timestamp: number;
    source: string;
    ip: string;
    userAgent: string;
    location?: string;
    device?: string;
    os?: string;
    browser?: string;
    referrer?: string;
    language?: string;
}

// declare global {
//     namespace Express {
//         interface Request {
//             user: AppUser;
//             metadata: RequestMetadata;
//         }
//     }
// }


export interface AuthenticatedRouter {
    get: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    post: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    put: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    delete: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    patch: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    all?: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    head?: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    options?: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    trace?: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    connect?: (path: string, ...handlers: AuthenticatedHandler[]) => AuthenticatedRouter;
    use: typeof Router.prototype.use;
    router: Router;
}

export function BookiesRouter(): AuthenticatedRouter {
    const router = Router();

    const typedRouter: AuthenticatedRouter = {
        get: (path, ...handlers) => {
            router.get(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        post: (path, ...handlers) => {
            router.post(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        put: (path, ...handlers) => {
            router.put(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        patch: (path, ...handlers) => {
            router.patch(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        delete: (path, ...handlers) => {
            router.delete(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        use: router.use.bind(router),
        router,
    };

    return {
        get: (path, ...handlers) => {
            router.get(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        post: (path, ...handlers) => {
            router.post(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        put: (path, ...handlers) => {
            router.put(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        patch: (path, ...handlers) => {
            router.patch(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        delete: (path, ...handlers) => {
            router.delete(path, ...handlers as RequestHandler[]);
            return typedRouter;
        },
        use: router.use.bind(router),
        router,
    };
}
