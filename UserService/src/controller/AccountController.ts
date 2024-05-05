import { NextFunction, Request, Response } from "express";

import { AccountRegistrationDto } from "../dto/AccountDto";
import AccountService from "../services/AccountService";
import BaseError from "../utils/Error";
import { HttpStatusCode } from "../utils/ErrorCode";

export default class AccountController {
  accountService = new AccountService();
  public async register(req: Request, res: Response, next: NextFunction) {
    const accountRegistrationDto = req.body as AccountRegistrationDto;
    try {
      const user = await this.accountService.saveUser(accountRegistrationDto);
      this.accountService.beginVerification(user);
      return res.status(200).json({ result: "OK" });
    } catch (e) {
      next(e);
    }
  }

  public async verifyAccount(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query;
    if (id == null || id == undefined) {
      throw new BaseError(
        "INVALID INPUT",
        HttpStatusCode.BAD_REQUEST,
        JSON.stringify({ error: "Id cannot be empty" })
      );
    }
    try {
      await this.accountService.verifyAccount(id as string);
      res.status(200).json({ result: "OK" });
    } catch (e) {
      next(e);
    }
  }

  public deleteAccount(req: Request, res: Response): void {
    // TODO : complete the delete Account parameter
    res.status(200).json({ result: "OK" });
  }
}
