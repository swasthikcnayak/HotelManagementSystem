import User from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';
import BaseError from "../utils/Error";
import { HttpStatusCode } from "../utils/ErrorCode";
import { AccessTokenPaload } from "../dto/AuthDto";
import { SECRET_ACCESS_TOKEN } from "../config";

export async function Verify(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers["authorization"];
        
        if (!token) return next(new BaseError("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, JSON.stringify({ error: "Authorization header not found" })))
        jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                next(new BaseError("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, JSON.stringify({ error: "Session Expired" })))
            }
            const { id } = decoded as AccessTokenPaload;
            const user = await User.findById(id);
            if (user == null) {
                return next(new BaseError("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, JSON.stringify({ error: "Token invalid" })))
            }
            req.user = { email: user.email, phoneNumber: user.phoneNumber, id: id }; // put the data object into req.user
            next();
        });
    } catch (err) {
        next(new BaseError("INTERNAL SERVER ERROR", HttpStatusCode.INTERNAL_SERVER, JSON.stringify({ error: "Failure " })))
    }
}