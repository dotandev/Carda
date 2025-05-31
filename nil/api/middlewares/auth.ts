import { JWTPayload } from "../types";
import { JWTController } from "../utils";

const jwtController = new JWTController();
const { verifyAccessToken } = jwtController;


export class Authenticator {
    public authenticate(req: any, res: any, next: any) {
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const payload = verifyAccessToken(token);
        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (payload === null) {
            return res.status(401).json({ message: 'Unauthorized Due to null.' });
        }
        req.user = payload;
        next();
    }

    public authorize(roles: string[]) {
        return (req: any, res: any, next: any) => {
            const userRole = req.headers['role'];
            if (roles.includes(userRole)) {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden' });
            }
        };
    }

    public logRequest(req: any, res: any, next: any) {
        console.log(`${req.method} ${req.url}`);
        next();
    }

    public logResponse(res: any, req: any, next: any) {
        res.on('finish', () => {
            console.log(`Response: ${res.statusCode}`);
        });
        next();
    }

    public handleError(err: any, req: any, res: any, next: any) {
        console.error(err.stack);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    public validateRequest(schema: any) {
        return (req: any, res: any, next: any) => {
            const { error } = schema.validate(req.body);
            if (error) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                next();
            }
        };
    }

    public validateQuery(schema: any) {
        return (req: any, res: any, next: any) => {
            const { error } = schema.validate(req.query);
            if (error) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                next();
            }
        };
    }

    public validateParams(schema: any) {
        return (req: any, res: any, next: any) => {
            const { error } = schema.validate(req.params);
            if (error) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                next();
            }
        };
    }

    public validateHeaders(schema: any) {
        return (req: any, res: any, next: any) => {
            const { error } = schema.validate(req.headers);
            if (error) {
                res.status(400).json({ message: error.details[0].message });
            } else {
                next();
            }
        };
    }


}