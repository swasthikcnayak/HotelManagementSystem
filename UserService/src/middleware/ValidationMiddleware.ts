import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BaseError from '../utils/Error';
import { HttpStatusCode } from '../utils/ErrorCode';

const validate = (validations: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(
            validations.map((validation: any) => validation.run(req))
        );
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const response = errors.array().map((error) => {
            return {
                type: error.type,
                detail: error.msg,
                code: 422,
            };
        });
        next(new BaseError("VALIDATION FAILURE", HttpStatusCode.BAD_REQUEST, JSON.stringify(response)))
    };
};

export default validate;