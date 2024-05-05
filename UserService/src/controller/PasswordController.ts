import { NextFunction, Request, Response } from "express"

import PasswordService from "../services/PasswordService"
import BaseError from "../utils/Error"
import { HttpStatusCode } from "../utils/ErrorCode"

export default class PasswordController {
    passwordService = new PasswordService()

    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body
        if (email == null || email === undefined) {
            throw new BaseError("INVALID INPUT", HttpStatusCode.BAD_REQUEST, "Email cannot be empty")
        }
        try {
            const data = await this.passwordService.forgotPassword(email)
            this.passwordService.dbEntry(data)
            const resetPasswordLink = await this.passwordService.generateLink(data.hash)
            this.passwordService.sendLink(resetPasswordLink, email)
            return res.status(200).json({result: "OK"})
        } catch (e) {
            next(e)
        }
    }



    public async resetPassword(req: Request, res: Response, next: NextFunction) {
        const { id } = req.query
        const { password } = req.body
        if (id == null || id == undefined) {
            throw new BaseError("INVALID INPUT", HttpStatusCode.BAD_REQUEST, JSON.stringify({ error: "Id cannot be empty" }))
        }
        try {
            await this.passwordService.resetPassword(id as string, password)
            res.status(200).json({result: "OK"})
        } catch (e) {
            next(e)
        }
    }
}