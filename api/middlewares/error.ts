export class CustomError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string, error?: any) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        
    }

    public sendResponse(res: any) {
        return res.status(this.statusCode).json({
            status: "error",
            statusCode: this.statusCode,
            message: this.message,
            error: this.stack,
        });
    }
}

export const errorHandler = (err: CustomError, req: any, res: any, next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
    next();
    console.error(err);
};


export class ErrorMiddleware {
    public logError(err: any, req: any, res: any, next: any) {
        console.error(err.stack);
        next(err);
    }

    public APIError(err: any, req: any, res: any, next: any) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message,
        });
        next();
    }

    public notFound(req: any, res: any, next: any) {
        const error = new CustomError(404, 'Not Found');
        res.status(error.statusCode).json({
            status: "error",
            statusCode: error.statusCode,
            message: error.message,
        });
        next();
    }

    public handleError(err: any, req: any, res: any, next: any) {
        console.error(err.stack);
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message,
        });
        next();
    }

    public handleValidationError(err: any, req: any, res: any, next: any) {
        if (err.name === 'ValidationError') {
            const statusCode = 400;
            const message = err.message || 'Validation Error';
            res.status(statusCode).json({
                status: "error",
                statusCode,
                message,
            });
        } else {
            next(err);
        }
    }
}

export class CustomSuccess {
    statusCode: number;
    message: string;
    data: any;

    constructor(statusCode: number, message: string, data: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    public sendResponse(res: any) {
        return res.status(this.statusCode).json({
            status: "success",
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        });
    }

    public sendResponseWithHeaders(res: any, headers: any) {
        res.set(headers).status(this.statusCode).json({
            status: "success",
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        });
    }
}
